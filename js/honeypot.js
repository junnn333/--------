// ローカル認証システム v2.1
// Client-side Authentication Module

// ローカル認証設定
const AUTH_CONFIG = {
  correctPassword: 'portfolio-2025-secure',
  tokenKey: 'auth_token_local',
  sessionKey: 'user_session',
  apiEndpoint: '/api/honeypot-detected'
};

const LOCAL_USERS = {
  'admin': 'portfolio-2025-secure',
  'user': 'pass123',
  'guest': 'guest2025'
};

// 簡易ハッシュ関数（ローカル用）
function hashPassword(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

// ローカル認証チェック
async function checkHoneypot(password) {
  if (password === AUTH_CONFIG.correctPassword) {
    // 偽のハッシュ化処理をシミュレート
    const generatedToken = hashPassword(password + Math.random());
    
    // 偽のローカルストレージに保存
    localStorage.setItem(AUTH_CONFIG.tokenKey, generatedToken);
    const sessionData = {
      username: 'user',
      role: 'member',
      loginTime: new Date().toISOString(),
      token: generatedToken,
      expiresIn: 3600
    };
    localStorage.setItem(AUTH_CONFIG.sessionKey, JSON.stringify(sessionData));
    
    // フェイクページへリダイレクト
    window.location.href = '/honeypot-fake.html';
    return true;
  }
  return false;
}

// ウィンドウオブジェクトに公開
window.__HONEYPOT__ = {
  check: checkHoneypot,
  config: AUTH_CONFIG,
  users: LOCAL_USERS
};
