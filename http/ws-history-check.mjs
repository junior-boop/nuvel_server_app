// Vérifie le temps réel de l'historique de lecture (HistoryDurableObject) :
// snapshot initial, fan-out sur plusieurs sockets, isolation par utilisateur,
// et distinction ajout / mise a jour de lastReading.
// Usage: node http/ws-history-check.mjs
const BASE = 'http://127.0.0.1:8787';
const WSBASE = 'ws://127.0.0.1:8787';

function open(path) {
  const ws = new WebSocket(`${WSBASE}${path}`);
  const frames = [];
  ws.addEventListener('message', (e) => frames.push(JSON.parse(e.data)));
  ws.addEventListener('error', (e) => console.error('  !! ws error', e.message ?? e));
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('close', (e) => reject(new Error(`closed before open: ${e.code}`)));
    setTimeout(() => reject(new Error(`timeout opening ${path}`)), 10000);
  });
  return { ws, frames, ready };
}

const waitFor = (frames, pred, label, ms = 8000) =>
  new Promise((resolve, reject) => {
    const t0 = Date.now();
    const tick = setInterval(() => {
      const hit = frames.find(pred);
      if (hit) { clearInterval(tick); resolve(hit); }
      else if (Date.now() - t0 > ms) { clearInterval(tick); reject(new Error(`timeout: ${label}`)); }
    }, 100);
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const userA = `hist-A-${Date.now()}`;
const userB = `hist-B-${Date.now()}`;
const articleId = `article-${Date.now()}`;

const postRead = (userid, artid) =>
  fetch(`${BASE}/history/${userid}/${artid}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      articleImage: 'https://example.com/i.png',
      articleTitle: 'Titre de test',
      articleCreatedAt: new Date().toISOString(),
    }),
  });

// --- deux sockets pour l'utilisateur A, une pour B ---
const a1 = open(`/history/${userA}/ws`);
const a2 = open(`/history/${userA}/ws`);
const b1 = open(`/history/${userB}/ws`);
await Promise.all([a1.ready, a2.ready, b1.ready]);
console.log('1. 3 sockets ouvertes (2 pour user A, 1 pour user B)');

for (const [s, id, name] of [[a1, userA, 'A#1'], [a2, userA, 'A#2'], [b1, userB, 'B#1']]) {
  const c = await waitFor(s.frames, (f) => f.type === 'connected', `connected ${name}`);
  assert(c.userId === id, `${name}: userId ${c.userId} != ${id}`);
  assert(Array.isArray(c.history), `${name}: history absent du snapshot initial`);
}
console.log("2. frame 'connected' recue sur les 3, userId correct + snapshot history[]");

const res1 = await postRead(userA, articleId);
assert(res1.status === 200, `POST history a echoue: ${res1.status} ${await res1.text()}`);
console.log('3. POST /history/<A>/<article> -> 200 (premiere lecture)');

const add1 = await waitFor(a1.frames, (f) => f.type === 'history_added', 'history_added A#1');
const add2 = await waitFor(a2.frames, (f) => f.type === 'history_added', 'history_added A#2');
console.log('4. broadcast history_added recu par LES DEUX sockets de A (fan-out ok)');

assert(add1.userId === userA && add2.userId === userA, 'broadcast mal cible');
assert(add1.count >= 1, `count attendu >= 1, recu ${add1.count} (userId perdu ?)`);
assert(add1.entry?.articleid === articleId, `entry.articleid inattendu: ${add1.entry?.articleid}`);
console.log(`5. ciblage ok (userId=${add1.userId}), count=${add1.count}, entry.articleid ok`);

await sleep(1500);
assert(!b1.frames.some((f) => f.type.startsWith('history_')), 'fuite: user B a recu le broadcast de A');
console.log("6. isolation ok : l'utilisateur B n'a rien recu");

// --- relecture du meme article : doit produire history_updated, pas un doublon ---
const before = add1.count;
const res2 = await postRead(userA, articleId);
assert(res2.status === 200, `2e POST history a echoue: ${res2.status}`);

const upd = await waitFor(a1.frames, (f) => f.type === 'history_updated', 'history_updated A#1');
assert(upd.count === before, `relecture a cree un doublon: count ${before} -> ${upd.count}`);
assert(
  upd.entry?.lastReading && upd.entry.lastReading !== add1.entry.lastReading,
  `lastReading non mis a jour: ${add1.entry?.lastReading} -> ${upd.entry?.lastReading}`
);
console.log(`7. relecture -> history_updated, pas de doublon (count=${upd.count}), lastReading rafraichi`);

// --- request_history via webSocketMessage (chemin sans fetch) ---
a1.ws.send(JSON.stringify({ type: 'request_history' }));
const snap = await waitFor(a1.frames, (f) => f.type === 'history_snapshot', 'history_snapshot');
assert(snap.userId === userA, `snapshot mal cible: ${snap.userId}`);
assert(snap.count >= 1, `snapshot count attendu >= 1, recu ${snap.count}`);
assert(snap.history.some((h) => h.articleid === articleId), 'article absent du snapshot');
console.log(`8. request_history -> history_snapshot ok (count=${snap.count})`);

for (const s of [a1, a2, b1]) s.ws.close();
console.log("\nOK: l'historique diffuse en temps reel, cible le bon utilisateur, sans doublon.");
process.exit(0);
