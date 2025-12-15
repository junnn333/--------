export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // パブリックパス（認証不要）
  const publicPaths = ['/login.html', '/api/login', '/', '/login'];

  if (publicPaths.includes(pathname)) {
    return next();
  }

  // クッキーをチェック
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
