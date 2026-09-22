// Vérifie le broadcast temps réel des Durable Objects (Comments + Appreciations) :
// livraison à toutes les sockets, ciblage par article, count non nul.
// Usage: node http/ws-broadcast-check.mjs
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

const articleA = `hib-A-${Date.now()}`;
const articleB = `hib-B-${Date.now()}`;

// --- Comments : deux sockets sur A, une sur B ---
const a1 = open(`/comments/${articleA}/ws`);
const a2 = open(`/comments/${articleA}/ws`);
const b1 = open(`/comments/${articleB}/ws`);
await Promise.all([a1.ready, a2.ready, b1.ready]);
console.log('1. 3 sockets ouvertes (2 sur article A, 1 sur article B)');

for (const [s, id, name] of [[a1, articleA, 'A#1'], [a2, articleA, 'A#2'], [b1, articleB, 'B#1']]) {
  const c = await waitFor(s.frames, (f) => f.type === 'connected', `connected ${name}`);
  assert(c.articleId === id, `${name}: articleId ${c.articleId} != ${id}`);
}
console.log("2. frame 'connected' recue sur les 3, articleId correct");

const res = await fetch(`${BASE}/comments/${articleA}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: 'test hibernation', creator: 'test-user' }),
});
assert(res.status === 200, `POST comment a echoue: ${res.status} ${await res.text()}`);
console.log('3. POST /comments/<A> -> 200');

const add1 = await waitFor(a1.frames, (f) => f.type === 'comment_added', 'comment_added A#1');
const add2 = await waitFor(a2.frames, (f) => f.type === 'comment_added', 'comment_added A#2');
console.log('4. broadcast recu par LES DEUX sockets de A (fan-out ok)');

assert(add1.articleId === articleA && add2.articleId === articleA, 'broadcast mal cible');
assert(add1.count >= 1, `count attendu >= 1, recu ${add1.count} (articleId perdu ?)`);
console.log(`5. ciblage ok (articleId=${add1.articleId}), count=${add1.count} (non nul)`);

await sleep(1500);
assert(!b1.frames.some((f) => f.type === 'comment_added'), 'fuite: article B a recu le broadcast de A');
console.log("6. isolation ok : l'article B n'a rien recu");

// --- Comments : request_count via webSocketMessage (chemin sans fetch) ---
a1.ws.send(JSON.stringify({ type: 'request_count' }));
const cu = await waitFor(a1.frames, (f) => f.type === 'count_update', 'count_update');
assert(cu.articleId === articleA, `count_update mal cible: ${cu.articleId}`);
assert(cu.count >= 1, `count_update count attendu >= 1, recu ${cu.count}`);
console.log(`7. request_count -> count_update ok (articleId=${cu.articleId}, count=${cu.count})`);

// --- Appreciations ---
const ap = open(`/appreciations/${articleA}/ws`);
await ap.ready;
const apc = await waitFor(ap.frames, (f) => f.type === 'connected', 'connected appreciations');
assert(apc.articleId === articleA, `appreciations articleId ${apc.articleId} != ${articleA}`);
console.log('8. socket appreciations ouverte, frame connected ok');

const likeRes = await fetch(`${BASE}/appreciations/${articleA}/toggle`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userid: 'test-user' }),
});
console.log('9. POST /appreciations/<A>/toggle ->', likeRes.status);
assert(likeRes.status === 200, `toggle a echoue: ${await likeRes.text()}`);

const like = await waitFor(ap.frames, (f) => f.type === 'like_added' || f.type === 'like_removed', 'like broadcast');
assert(like.articleId === articleA, `like mal cible: ${like.articleId}`);
console.log(`10. broadcast ${like.type} recu, articleId=${like.articleId}, count=${like.count}`);

for (const s of [a1, a2, b1, ap]) s.ws.close();
console.log('\nOK: les deux Durable Objects diffusent, ciblent le bon article et gardent un count coherent.');
process.exit(0);
