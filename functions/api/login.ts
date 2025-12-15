interface LoginRequest {
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
}

const CORRECT_PASSWORD = 'munimuni-no';

async function generateToken(password: string, timestamp: number): Promise<string> {
  const data = new TextEncoder().encode(password + timestamp);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, message: 'Only POST requests are allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    try {
      const body: LoginRequest = await request.json();
      const password = body.password || '';

      if (password === CORRECT_PASSWORD) {
        const timestamp = Date.now();
        const token = await generateToken(password, timestamp);

        return new Response(
          JSON.stringify({ success: true, message: 'ログインしました' }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`
            }
          }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, message: 'パスワードが正しくありません' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      return new Response(
        JSON.stringify({ success: false, message: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};
