// ローカル認証システム v2.3
// Client-side Authentication Module with Encryption

// ローカル認証設定
const AUTH_CONFIG = {
  correctPassword: 'portfolio-2025-secure',
  tokenKey: 'auth_token_local',
  sessionKey: 'user_session',
  apiEndpoint: '/api/honeypot-detected',
  encryptionKey: 'muni-secure-key-2025'
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

// Base64エンコード/デコード
function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(str) {
  return decodeURIComponent(escape(atob(str)));
}

// XOR暗号化
function xorEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return base64Encode(result);
}

function xorDecrypt(encrypted, key) {
  const decoded = base64Decode(encrypted);
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

// SHA1風のハッシュ関数（実装は簡易版）
function secureHash(str, salt = '') {
  const combined = str + salt + AUTH_CONFIG.encryptionKey;
  let hash = 0;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  let hex = Math.abs(hash).toString(16);
  while (hex.length < 8) {
    hex = '0' + hex;
  }
  
  return hex + base64Encode(str.substring(0, 3)).substring(0, 8);
}

// トークン生成
function generateToken(password) {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2, 15);
  const tokenData = `${password}:${timestamp}:${nonce}`;
  
  const encrypted = xorEncrypt(tokenData, AUTH_CONFIG.encryptionKey);
  const hashed = secureHash(encrypted);
  
  return hashed;
}

// ローカル認証チェック
function checkHoneypot(password) {
  if (password === AUTH_CONFIG.correctPassword) {
    // 暗号化されたトークン生成
    const generatedToken = generateToken(password);
    
    // 暗号化されたセッションデータ
    const sessionData = {
      username: 'user',
      role: 'member',
      loginTime: new Date().toISOString(),
      token: generatedToken,
      expiresIn: 3600,
      encrypted: true
    };
    
    const encryptedSession = xorEncrypt(JSON.stringify(sessionData), AUTH_CONFIG.encryptionKey);
    
    // ローカルストレージに保存
    localStorage.setItem(AUTH_CONFIG.tokenKey, generatedToken);
    localStorage.setItem(AUTH_CONFIG.sessionKey, encryptedSession);
    
    // メタデータも保存（より本物っぽく）
    localStorage.setItem('auth_metadata', JSON.stringify({
      lastLogin: new Date().toISOString(),
      loginIp: '192.168.1.1',
      userAgent: navigator.userAgent.substring(0, 50),
      device: 'Web Browser'
    }));
    
    // フェイクページへリダイレクト
    setTimeout(() => {
      window.location.href = '/honeypot-fake.html';
    }, 300);
    
    return true;
  }
  return false;
}

// ウィンドウオブジェクトに公開
window.__HONEYPOT__ = {
  check: checkHoneypot,
  config: AUTH_CONFIG,
  users: LOCAL_USERS,
  // デバッグ用（ソース見た攻撃者が試すように）
  decrypt: xorDecrypt,
  generateToken: generateToken
};
