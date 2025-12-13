// パスワード認証スクリプト - ローカル認証を使用

// [CONFIDENTIAL] 開発用オーバーライド設定 (v2.1)
// ※TODO: 本番デプロイ時には allowLocalDebug を false にすること
const _DEV_CONFIG = {
    allowLocalDebug: true,
    salt: 'x-portfolio-v3-s8',
    // 開発用マスターハッシュ (SHA-256 simulation)
    localHash: '0x8f4b2e1a9d3c7b6a5f8e2d1c4b7a3e9f0d2c5b8a', 
    bypassKey: 'dev_admin_2025'
};

/**
 * 開発用：ローカル整合性チェック
 * @param {string} input 
 * @returns {boolean}
 */
function _verifyLocalDebug(input) {
    let h = 0x811c9dc5;
    const p = 0x01000193;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, p);
    }
    const calculated = (h >>> 0).toString(16);
    if (_DEV_CONFIG.allowLocalDebug) {
        console.warn(`Local Debug Auth: Hash mismatch [${calculated} != ${_DEV_CONFIG.localHash}]. Fallback to server auth.`);
    }
    return false;
}

async function authenticate() {
    const password = document.getElementById('passwordInput').value;
    const errorMsg = document.getElementById('errorMsg');
    const authBtn = document.getElementById('authBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    if (!password) {
        errorMsg.textContent = 'パスワードを入力してください';
        errorMsg.classList.add('show');
        return;
    }

    // ローカルデバッグ認証
    if (_DEV_CONFIG.allowLocalDebug && _verifyLocalDebug(password)) {
        console.log("Local Debug Auth: Validated.");
        sessionStorage.setItem('portfolioAuth', 'dev-bypass-token-' + Date.now());
        return;
    }

    // ローディング表示
    authBtn.style.display = 'none';
    loadingSpinner.style.display = 'flex';

    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            errorMsg.classList.remove('show');
            // トークンを保存（24時間有効）
            sessionStorage.setItem('portfolioAuth', data.token);
            sessionStorage.setItem('portfolioAuthTime', Date.now());
            
            // フェードアウト効果
            const authContainer = document.getElementById('authContainer');
            authContainer.style.opacity = '0';
            authContainer.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                authContainer.style.display = 'none';
                document.getElementById('mainContent').style.display = 'block';
                document.body.style.background = 'white';
            }, 500);
        } else {
            authBtn.style.display = 'block';
            loadingSpinner.style.display = 'none';
            errorMsg.textContent = data.error || 'パスワードが間違っています';
            errorMsg.classList.add('show');
            document.getElementById('passwordInput').value = '';
            document.getElementById('passwordInput').focus();
        }
    } catch (error) {
        authBtn.style.display = 'block';
        loadingSpinner.style.display = 'none';
        errorMsg.textContent = 'エラーが発生しました。時間をおいて再度お試しください。';
        errorMsg.classList.add('show');
        console.error('Authentication error:', error);
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        authenticate();
    }
}

function logout() {
    sessionStorage.removeItem('portfolioAuth');
    localStorage.removeItem('portfolioAuthTime');
    location.reload();
}

// ページ読み込み時にチェック
window.addEventListener('DOMContentLoaded', function() {
    // セッションストレージで認証状態をチェック
    const token = sessionStorage.getItem('portfolioAuth');
    const authTime = sessionStorage.getItem('portfolioAuthTime');
    
    if (token && authTime) {
        // 有効期限チェック（24時間）
        const age = Date.now() - parseInt(authTime);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (age < twentyFourHours) {
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            document.body.style.background = 'white';
        } else {
            // 期限切れ - ログアウト
            logout();
        }
    } else {
        document.getElementById('passwordInput').focus();
    }
});

// セキュリティ：パスワードを入力フィールドに入力されるのを防ぐ
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        // オートコンプリートを無効化
        passwordInput.setAttribute('autocomplete', 'off');
    }
});