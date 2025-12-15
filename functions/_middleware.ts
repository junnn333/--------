export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // パブリックパス・リソース（認証不要）
  // ファイル拡張子、API、ログイン関連は許可
  if (pathname === '/' || pathname.includes('.') || pathname.startsWith('/api/')) {
    return next();
  }

  // /login.html は認証チェック対象外
  if (pathname === '/login.html' || pathname === '/login') {
    return next();
  }

  // /index.html などのページはクッキーをチェック
  const cookie = request.headers.get('cookie') || '';
  const hasAuthToken = cookie.includes('auth_token=');

  if (!hasAuthToken) {
    return new Response(null, {
      status: 302,
      headers: { 'Location': '/login.html' }
    });
  }

  return next();
};
