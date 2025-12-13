// Cloudflare Pages Functions - 認証API
export async function onRequest(context) {
  const { request } = context;

  // CORS対応
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { password } = await request.json();

    if (!password) {
      return new Response(
        JSON.stringify({ success: false, error: 'パスワードが必要です' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 環境変数からパスワード取得
    const correctPassword = context.env.PORTFOLIO_PASSWORD;

    // 簡易的なレート制限（本番環境ではもっと厳密にすべき）
    const clientIP = request.headers.get('cf-connecting-ip') || 'unknown';
    
    // パスワード検証
    if (password === correctPassword) {
      // JWT風のトークン生成（簡易版）
      const token = Buffer.from(
        JSON.stringify({
          auth: true,
          timestamp: Date.now(),
          exp: Date.now() + 24 * 60 * 60 * 1000 // 24時間有効
        })
      ).toString('base64');

      return new Response(
        JSON.stringify({ 
          success: true, 
          token: token,
          message: 'ログインに成功しました'
        }),
        { 
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    } else {
      // ログイン失敗
      return new Response(
        JSON.stringify({ success: false, error: 'パスワードが間違っています' }),
        { 
          status: 401,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
