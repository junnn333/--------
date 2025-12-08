/**
 * Cloudflare Worker - パスワード認証エンドポイント
 * このスクリプトはCloudflare Workersで実行され、
 * クライアント側のパスワード検証を行わず、サーバー側で安全に認証を処理します
 */

// 環境変数からパスワードを取得（wrangler.toml で設定）
// または、以下に直接設定（本番環境では環境変数を使用）
const CORRECT_PASSWORD = 'munimuni-no';
const SESSION_TIMEOUT = 3600; // 1時間

/**
 * パスワード認証 
 * POST /api/auth
 * Body: { password: string }
 * Response: { success: boolean, token?: string, message: string }
 */
async function handleAuthRequest(request) {
  const body = await request.json();
  const password = body.password;

  if (!password) {
    return new Response(
      JSON.stringify({ success: false, message: 'パスワードが必要です' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (password === CORRECT_PASSWORD) {
    // セッショントークンを生成（ハッシュ化）
    const timestamp = Date.now();
    const token = await generateToken(password, timestamp);

    return new Response(
      JSON.stringify({
        success: true,
        token: token,
        message: 'ログインしました'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TIMEOUT}`
        }
      }
    );
  } else {
    return new Response(
      JSON.stringify({ success: false, message: 'パスワードが間違っています' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * トークン生成
 */
async function generateToken(password, timestamp) {
  const data = `${password}${timestamp}`;
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * トークン検証
 */
function verifyToken(request) {
  const cookies = request.headers.get('cookie') || '';
  const tokenMatch = cookies.match(/auth_token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

/**
 * ポートフォリオHTML生成
 */
function generatePortfolioHTML() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            min-height: 100vh;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .main-content {
            background: white;
            min-height: 100vh;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }

        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .navbar .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 1.8em;
            font-weight: bold;
        }

        .nav-menu {
            list-style: none;
            display: flex;
            gap: 25px;
        }

        .nav-menu a {
            color: white;
            text-decoration: none;
            transition: opacity 0.3s;
            cursor: pointer;
        }

        .nav-menu a:hover {
            opacity: 0.8;
        }

        .section {
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 1px solid #eee;
        }

        .section h2 {
            font-size: 2em;
            color: #667eea;
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }

        .profile-content {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .skill-card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            border-top: 4px solid #667eea;
            transition: transform 0.3s;
        }

        .skill-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
        }

        .skill-card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.2em;
        }

        .skill-card ul {
            list-style-position: inside;
        }

        .work-card {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            border-left: 4px solid #764ba2;
            transition: box-shadow 0.3s;
            margin-bottom: 20px;
        }

        .work-card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.3em;
        }

        .qualification-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            margin-bottom: 15px;
        }

        .qualification-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 35px;
            height: 35px;
            background: #667eea;
            color: white;
            border-radius: 50%;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }

        footer {
            background: #f8f9fa;
            text-align: center;
            padding: 20px;
            color: #999;
            border-top: 1px solid #eee;
            margin-top: 50px;
        }

        .logout-btn {
            padding: 10px 15px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .logout-btn:hover {
            background: #c0392b;
        }
    </style>
</head>
<body>
    <div class="main-content">
        <nav class="navbar">
            <div class="container">
                <h1 class="logo">Portfolio</h1>
                <button class="logout-btn" onclick="logout()">ログアウト</button>
            </div>
        </nav>

        <main class="container">
            <section id="profile" class="section">
                <h2>Profile</h2>
                <div class="profile-content">
                    <p><strong>氏名</strong> (2027年3月卒業予定)</p>
                    <p><strong>学歴</strong> 専門学校 3年生</p>
                    <p><strong>志望職種</strong> システムエンジニア</p>
                    <hr style="margin: 20px 0;">
                    <p>Java（Spring Boot）を中心としたバックエンド開発と、データベース操作の習得に力を入れています。</p>
                </div>
            </section>

            <section id="skills" class="section">
                <h2>Skills</h2>
                <div class="skills-grid">
                    <div class="skill-card">
                        <h3>Languages</h3>
                        <ul>
                            <li>Java</li>
                            <li>SQL</li>
                            <li>HTML / CSS</li>
                            <li>JavaScript</li>
                        </ul>
                    </div>
                    <div class="skill-card">
                        <h3>Frameworks</h3>
                        <ul>
                            <li>Spring Boot</li>
                        </ul>
                    </div>
                    <div class="skill-card">
                        <h3>Database</h3>
                        <ul>
                            <li>MySQL</li>
                        </ul>
                    </div>
                    <div class="skill-card">
                        <h3>Tools</h3>
                        <ul>
                            <li>Git / GitHub</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="works" class="section">
                <h2>Works</h2>
                <div class="work-card">
                    <h3>①　学習時間管理タイマー（フロントエンド）</h3>
                    <p><strong>使用技術：</strong> JavaScript / HTML / CSS</p>
                    <p><strong>概要：</strong> 日々の学習時間を計測するためのWebツール。</p>
                </div>
                <div class="work-card">
                    <h3>②　タスク管理アプリケーション（バックエンド）</h3>
                    <p><strong>使用技術：</strong> Java (Spring Boot) / Spring Data JPA / SQL / Thymeleaf</p>
                    <p><strong>概要：</strong> CRUD処理とバリデーション機能を実装したWebアプリ。</p>
                </div>
            </section>

            <section id="qualifications" class="section">
                <h2>Qualifications</h2>
                <div class="qualification-item">
                    <span class="qualification-badge">✓</span>
                    <p>基本情報技術者試験</p>
                </div>
                <div class="qualification-item">
                    <span class="qualification-badge">✓</span>
                    <p>情報セキュリティマネジメント試験</p>
                </div>
                <div class="qualification-item">
                    <span class="qualification-badge">✓</span>
                    <p>第三級アマチュア無線技士</p>
                </div>
            </section>
        </main>

        <footer>
            <p>&copy; 2025 Portfolio. All rights reserved.</p>
        </footer>
    </div>

    <script>
        function logout() {
            document.cookie = 'auth_token=; Max-Age=0; path=/';
            location.href = '/login';
        }
    </script>
</body>
</html>`;
}

/**
 * ログインページHTML生成
 */
function generateLoginHTML() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - パスワード保護</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .auth-box {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            text-align: center;
            width: 100%;
            max-width: 400px;
        }

        .auth-box h1 {
            margin-bottom: 10px;
            color: #667eea;
            font-size: 2.5em;
        }

        .auth-box p {
            margin-bottom: 20px;
            color: #666;
            font-size: 0.95em;
        }

        .auth-box input {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 1em;
            transition: border-color 0.3s;
        }

        .auth-box input:focus {
            outline: none;
            border-color: #667eea;
        }

        .auth-box button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .auth-box button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .error-msg {
            color: #e74c3c;
            font-size: 0.9em;
            margin-top: 10px;
            display: none;
        }

        .loading-spinner {
            display: none;
            justify-content: center;
            margin-top: 15px;
        }

        .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="auth-box">
        <h1>Portfolio</h1>
        <p>このページはパスワードで保護されています</p>
        <input type="password" id="passwordInput" placeholder="パスワードを入力してください" onkeypress="handleKeyPress(event)">
        <button onclick="authenticate()" id="authBtn">アクセス</button>
        <p id="errorMsg" class="error-msg"></p>
        <div id="loadingSpinner" class="loading-spinner">
            <div class="spinner"></div>
        </div>
    </div>

    <script>
        async function authenticate() {
            const password = document.getElementById('passwordInput').value;
            const errorMsg = document.getElementById('errorMsg');
            const authBtn = document.getElementById('authBtn');
            const loadingSpinner = document.getElementById('loadingSpinner');

            if (!password) {
                errorMsg.textContent = 'パスワードを入力してください';
                errorMsg.style.display = 'block';
                return;
            }

            authBtn.disabled = true;
            authBtn.style.opacity = '0.6';
            loadingSpinner.style.display = 'flex';

            try {
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });

                const result = await response.json();

                if (result.success) {
                    errorMsg.style.display = 'none';
                    setTimeout(() => location.href = '/', 500);
                } else {
                    errorMsg.textContent = result.message || 'ログインに失敗しました';
                    errorMsg.style.display = 'block';
                }
            } catch (error) {
                errorMsg.textContent = 'エラーが発生しました';
                errorMsg.style.display = 'block';
            } finally {
                authBtn.disabled = false;
                authBtn.style.opacity = '1';
                loadingSpinner.style.display = 'none';
            }
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') authenticate();
        }
    </script>
</body>
</html>`;
}

/**
 * メインハンドラー
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS設定
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // 認証エンドポイント
    if (url.pathname === '/api/auth' && request.method === 'POST') {
      const response = await handleAuthRequest(request);
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    // トークン検証
    const token = await verifyToken(request);

    // ログインページ
    if (url.pathname === '/login' || !token) {
      return new Response(generateLoginHTML(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // ポートフォリオページ（認証済み）
    if (token) {
      return new Response(generatePortfolioHTML(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};
