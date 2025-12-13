// パスワード認証スクリプト - サーバー側認証を使用

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

    // ローディング表示
    authBtn.style.display = 'none';
    loadingSpinner.style.display = 'flex';

    try {
        // サーバー側のAPIに認証リクエストを送信
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
