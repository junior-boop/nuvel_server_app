import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import users from "./routes/users";
import article from "./routes/articles";
import notes from "./routes/notes";
import images from "./images";
import groups from "./routes/groups";
import bible from "./routes/bible";
import comments from "./routes/comments";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", ({ json }) => {
  const teste = {
    name: "yaounde",
    pays: "Cameroun",
  };
  return json(teste);
});

app.get("/health", ({ json, env }) => {
  return json({
    status: true,
  });
});

// Route pour servir le fichier de test SSE
app.get("/test-sse", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test SSE - Commentaires en temps réel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .status {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 10px;
        }

        .status.connected {
            background: #10b981;
        }

        .status.disconnected {
            background: #ef4444;
        }

        .content {
            padding: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
        }

        input, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        .buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }

        button {
            flex: 1;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #6b7280;
            color: white;
        }

        .btn-success {
            background: #10b981;
            color: white;
        }

        .btn-danger {
            background: #ef4444;
            color: white;
        }

        .comments-section {
            margin-top: 30px;
        }

        .comments-section h2 {
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }

        .comment {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            border-left: 4px solid #667eea;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .comment.new {
            background: #dbeafe;
            border-left-color: #3b82f6;
        }

        .comment-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
            color: #6b7280;
        }

        .comment-content {
            color: #1f2937;
            line-height: 1.6;
        }

        .logs {
            margin-top: 20px;
            padding: 16px;
            background: #1f2937;
            color: #10b981;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }

        .log-entry {
            margin-bottom: 4px;
        }

        .log-entry.error {
            color: #ef4444;
        }

        .log-entry.success {
            color: #10b981;
        }

        .log-entry.info {
            color: #60a5fa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📡 Commentaires en Temps Réel (SSE)</h1>
            <span class="status disconnected" id="status">Déconnecté</span>
        </div>

        <div class="content">
            <div class="form-group">
                <label for="articleId">ID de l'article</label>
                <input type="text" id="articleId" placeholder="ex: article-123" value="article-123">
            </div>

            <div class="buttons">
                <button class="btn-primary" onclick="connectSSE()">🔌 Connecter au Stream</button>
                <button class="btn-danger" onclick="disconnectSSE()">🔌 Déconnecter</button>
            </div>

            <div class="form-group">
                <label for="creator">Votre nom</label>
                <input type="text" id="creator" placeholder="John Doe" value="User Test">
            </div>

            <div class="form-group">
                <label for="content">Nouveau commentaire</label>
                <textarea id="content" placeholder="Écrivez votre commentaire..."></textarea>
            </div>

            <div class="buttons">
                <button class="btn-success" onclick="postComment()">💬 Envoyer le commentaire</button>
                <button class="btn-secondary" onclick="loadComments()">🔄 Charger tous les commentaires</button>
            </div>

            <div class="comments-section">
                <h2>Commentaires (<span id="commentCount">0</span>)</h2>
                <div id="comments"></div>
            </div>

            <div class="logs" id="logs"></div>
        </div>
    </div>

    <script>
        let eventSource = null;
        const API_BASE = window.location.origin;

        function log(message, type = 'info') {
            const logs = document.getElementById('logs');
            const entry = document.createElement('div');
            entry.className = \`log-entry \${type}\`;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            logs.insertBefore(entry, logs.firstChild);
            
            while (logs.children.length > 50) {
                logs.removeChild(logs.lastChild);
            }
        }

        function updateStatus(connected) {
            const status = document.getElementById('status');
            if (connected) {
                status.textContent = '🟢 Connecté';
                status.className = 'status connected';
            } else {
                status.textContent = '🔴 Déconnecté';
                status.className = 'status disconnected';
            }
        }

        function connectSSE() {
            const articleId = document.getElementById('articleId').value;
            
            if (!articleId) {
                alert('Veuillez entrer un ID d\\'article');
                return;
            }

            if (eventSource) {
                eventSource.close();
            }

            const url = \`\${API_BASE}/comments/\${articleId}/stream\`;
            log(\`Connexion à \${url}...\`, 'info');
            
            eventSource = new EventSource(url);

            eventSource.addEventListener('connected', (event) => {
                const data = JSON.parse(event.data);
                log(\`✅ \${data.message}\`, 'success');
                updateStatus(true);
            });

            eventSource.addEventListener('update', (event) => {
                const data = JSON.parse(event.data);
                log(\`📩 Nouveaux commentaires reçus: \${data.count}\`, 'success');
                
                data.comments.forEach(comment => {
                    addComment(comment, true);
                });
            });

            eventSource.addEventListener('ping', (event) => {
                // Keep-alive
            });

            eventSource.onerror = (error) => {
                log('❌ Erreur de connexion SSE', 'error');
                updateStatus(false);
            };
        }

        function disconnectSSE() {
            if (eventSource) {
                eventSource.close();
                eventSource = null;
                updateStatus(false);
                log('🔌 Déconnecté du stream', 'info');
            }
        }

        function addComment(comment, isNew = false) {
            const commentsDiv = document.getElementById('comments');
            const commentCount = document.getElementById('commentCount');
            
            if (document.getElementById(\`comment-\${comment.id}\`)) {
                return;
            }

            const commentEl = document.createElement('div');
            commentEl.className = isNew ? 'comment new' : 'comment';
            commentEl.id = \`comment-\${comment.id}\`;
            
            commentEl.innerHTML = \`
                <div class="comment-meta">
                    <span><strong>\${comment.creator}</strong></span>
                    <span>\${new Date(comment.created).toLocaleString()}</span>
                </div>
                <div class="comment-content">\${comment.content}</div>
            \`;

            commentsDiv.insertBefore(commentEl, commentsDiv.firstChild);
            commentCount.textContent = commentsDiv.children.length;

            if (isNew) {
                setTimeout(() => {
                    commentEl.classList.remove('new');
                }, 3000);
            }
        }

        async function loadComments() {
            const articleId = document.getElementById('articleId').value;
            
            if (!articleId) {
                alert('Veuillez entrer un ID d\\'article');
                return;
            }

            try {
                log(\`📥 Chargement des commentaires...\`, 'info');
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}\`);
                const data = await response.json();
                
                document.getElementById('comments').innerHTML = '';
                
                data.comments.forEach(comment => {
                    addComment(comment, false);
                });
                
                log(\`✅ \${data.count} commentaire(s) chargé(s)\`, 'success');
            } catch (error) {
                log(\`❌ Erreur: \${error.message}\`, 'error');
            }
        }

        async function postComment() {
            const articleId = document.getElementById('articleId').value;
            const creator = document.getElementById('creator').value;
            const content = document.getElementById('content').value;

            if (!articleId || !creator || !content) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            try {
                log(\`📤 Envoi du commentaire...\`, 'info');
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        creator,
                        content
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    log(\`✅ Commentaire envoyé avec succès\`, 'success');
                    document.getElementById('content').value = '';
                } else {
                    log(\`❌ Erreur: \${data.error}\`, 'error');
                }
            } catch (error) {
                log(\`❌ Erreur: \${error.message}\`, 'error');
            }
        }

        window.addEventListener('beforeunload', () => {
            if (eventSource) {
                eventSource.close();
            }
        });

        log('💡 Application chargée. Entrez un ID d\\'article et connectez-vous au stream.', 'info');
    </script>
</body>
</html>`);
});

// Route pour la page de test avec Long Polling (plus fiable que SSE)
app.get("/test-polling", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Long Polling - Commentaires en temps réel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }

        .status {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            margin-top: 10px;
        }

        .status.connected {
            background: #10b981;
        }

        .status.disconnected {
            background: #ef4444;
        }

        .content {
            padding: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
        }

        input, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input:focus, textarea:focus {
            outline: none;
            border-color: #10b981;
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        .buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }

        button {
            flex: 1;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-primary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }

        .btn-secondary {
            background: #6b7280;
            color: white;
        }

        .btn-success {
            background: #10b981;
            color: white;
        }

        .btn-danger {
            background: #ef4444;
            color: white;
        }

        .comments-section {
            margin-top: 30px;
        }

        .comments-section h2 {
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }

        .comment {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            border-left: 4px solid #10b981;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .comment.new {
            background: #d1fae5;
            border-left-color: #059669;
        }

        .comment-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
            color: #6b7280;
        }

        .comment-content {
            color: #1f2937;
            line-height: 1.6;
        }

        .logs {
            margin-top: 20px;
            padding: 16px;
            background: #1f2937;
            color: #10b981;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 200px;
            overflow-y: auto;
        }

        .log-entry {
            margin-bottom: 4px;
        }

        .log-entry.error {
            color: #ef4444;
        }

        .log-entry.success {
            color: #10b981;
        }

        .log-entry.info {
            color: #60a5fa;
        }

        .badge {
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 12px;
            background: #10b981;
            color: white;
            margin-left: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔄 Commentaires en Temps Réel (Long Polling)</h1>
            <span class="badge">Plus fiable pour Cloudflare Workers</span>
            <br>
            <span class="status disconnected" id="status">Arrêté</span>
        </div>

        <div class="content">
            <div class="form-group">
                <label for="articleId">ID de l'article</label>
                <input type="text" id="articleId" placeholder="ex: article-123" value="article-123">
            </div>

            <div class="buttons">
                <button class="btn-primary" onclick="startPolling()">▶️ Démarrer le Polling</button>
                <button class="btn-danger" onclick="stopPolling()">⏹️ Arrêter</button>
            </div>

            <div class="form-group">
                <label for="creator">Votre nom</label>
                <input type="text" id="creator" placeholder="John Doe" value="User Test">
            </div>

            <div class="form-group">
                <label for="content">Nouveau commentaire</label>
                <textarea id="content" placeholder="Écrivez votre commentaire..."></textarea>
            </div>

            <div class="buttons">
                <button class="btn-success" onclick="postComment()">💬 Envoyer le commentaire</button>
                <button class="btn-secondary" onclick="loadComments()">🔄 Charger tous les commentaires</button>
            </div>

            <div class="comments-section">
                <h2>Commentaires (<span id="commentCount">0</span>)</h2>
                <div id="comments"></div>
            </div>

            <div class="logs" id="logs"></div>
        </div>
    </div>

    <script>
        let pollingInterval = null;
        let lastTimestamp = Date.now();
        const API_BASE = window.location.origin;

        function log(message, type = 'info') {
            const logs = document.getElementById('logs');
            const entry = document.createElement('div');
            entry.className = \`log-entry \${type}\`;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            logs.insertBefore(entry, logs.firstChild);
            
            while (logs.children.length > 50) {
                logs.removeChild(logs.lastChild);
            }
        }

        function updateStatus(active) {
            const status = document.getElementById('status');
            if (active) {
                status.textContent = '🟢 Polling actif';
                status.className = 'status connected';
            } else {
                status.textContent = '🔴 Arrêté';
                status.className = 'status disconnected';
            }
        }

        async function pollComments() {
            const articleId = document.getElementById('articleId').value;
            
            try {
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}/poll?since=\${lastTimestamp}\`);
                const data = await response.json();
                
                if (data.count > 0) {
                    log(\`📩 \${data.count} nouveau(x) commentaire(s) reçu(s)\`, 'success');
                    
                    data.comments.forEach(comment => {
                        addComment(comment, true);
                    });
                }
                
                // Mettre à jour le timestamp
                lastTimestamp = data.timestamp;
                
            } catch (error) {
                log(\`❌ Erreur de polling: \${error.message}\`, 'error');
            }
        }

        function startPolling() {
            const articleId = document.getElementById('articleId').value;
            
            if (!articleId) {
                alert('Veuillez entrer un ID d\\'article');
                return;
            }

            if (pollingInterval) {
                clearInterval(pollingInterval);
            }

            log(\`▶️ Démarrage du polling pour l'article \${articleId}\`, 'info');
            updateStatus(true);
            
            // Poll immédiatement puis toutes les 3 secondes
            pollComments();
            pollingInterval = setInterval(pollComments, 3000);
        }

        function stopPolling() {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
                updateStatus(false);
                log('⏹️ Polling arrêté', 'info');
            }
        }

        function addComment(comment, isNew = false) {
            const commentsDiv = document.getElementById('comments');
            const commentCount = document.getElementById('commentCount');
            
            if (document.getElementById(\`comment-\${comment.id}\`)) {
                return;
            }

            const commentEl = document.createElement('div');
            commentEl.className = isNew ? 'comment new' : 'comment';
            commentEl.id = \`comment-\${comment.id}\`;
            
            commentEl.innerHTML = \`
                <div class="comment-meta">
                    <span><strong>\${comment.creator}</strong></span>
                    <span>\${new Date(comment.created).toLocaleString()}</span>
                </div>
                <div class="comment-content">\${comment.content}</div>
            \`;

            commentsDiv.insertBefore(commentEl, commentsDiv.firstChild);
            commentCount.textContent = commentsDiv.children.length;

            if (isNew) {
                setTimeout(() => {
                    commentEl.classList.remove('new');
                }, 3000);
            }
        }

        async function loadComments() {
            const articleId = document.getElementById('articleId').value;
            
            if (!articleId) {
                alert('Veuillez entrer un ID d\\'article');
                return;
            }

            try {
                log(\`📥 Chargement des commentaires...\`, 'info');
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}\`);
                const data = await response.json();
                
                document.getElementById('comments').innerHTML = '';
                
                data.comments.forEach(comment => {
                    addComment(comment, false);
                });
                
                log(\`✅ \${data.count} commentaire(s) chargé(s)\`, 'success');
            } catch (error) {
                log(\`❌ Erreur: \${error.message}\`, 'error');
            }
        }

        async function postComment() {
            const articleId = document.getElementById('articleId').value;
            const creator = document.getElementById('creator').value;
            const content = document.getElementById('content').value;

            if (!articleId || !creator || !content) {
                alert('Veuillez remplir tous les champs');
                return;
            }

            try {
                log(\`📤 Envoi du commentaire...\`, 'info');
                const response = await fetch(\`\${API_BASE}/comments/\${articleId}\`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        creator,
                        content
                    })
                });

                const data = await response.json();
                
                if (data.success) {
                    log(\`✅ Commentaire envoyé avec succès\`, 'success');
                    document.getElementById('content').value = '';
                    
                    // Forcer un poll immédiat pour voir le nouveau commentaire
                    if (pollingInterval) {
                        setTimeout(pollComments, 500);
                    }
                } else {
                    log(\`❌ Erreur: \${data.error}\`, 'error');
                }
            } catch (error) {
                log(\`❌ Erreur: \${error.message}\`, 'error');
            }
        }

        window.addEventListener('beforeunload', () => {
            stopPolling();
        });

        log('💡 Application chargée. Utilisez Long Polling au lieu de SSE pour plus de fiabilité.', 'info');
    </script>
</body>
</html>`);
});

app.route("/users", users);
app.route("/articles", article);
app.route("/notes", notes);
app.route("/groups", groups);
app.route("/image", images);
app.route("/bible", bible);
app.route("/comments", comments);

export default app;

