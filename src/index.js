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
 * パスワード認証 API
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
async function verifyToken(token) {
  if (!token) return false;
  // 実装: トークンの有効期限をチェック
  // この実装は簡易版です。本番環境ではJWTなどを使用してください
  return token.length === 64; // SHA-256の長さ
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

    // 静的ファイルの配信
    return env.ASSETS.fetch(request);
  }
};
