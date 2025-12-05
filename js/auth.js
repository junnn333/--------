// パスワード設定（任意に変更してください）
const CORRECT_PASSWORD = 'portfolio2025';

// LocalStorageのキー
const AUTH_KEY = 'portfolioAuth';
const AUTH_TIMEOUT = 3600000; // 1時間（ミリ秒）

// ページロード時の処理
document.addEventListener('DOMContentLoaded', function() {
    // 認証状態をチェック
    if (isAuthenticated()) {
        showMainContent();
    } else {
        showAuthPage();
    }
});

// 認証状態をチェック
function isAuthenticated() {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return false;

    try {
        const data = JSON.parse(authData);
        const currentTime = new Date().getTime();
        
        // タイムアウトをチェック
        if (currentTime - data.timestamp > AUTH_TIMEOUT) {
            localStorage.removeItem(AUTH_KEY);
            return false;
        }
        
        return data.authenticated === true;
    } catch (e) {
        localStorage.removeItem(AUTH_KEY);
        return false;
    }
}

// 認証ページを表示
function showAuthPage() {
    const authContainer = document.getElementById('authContainer');
    const mainContent = document.getElementById('mainContent');
    
    authContainer.style.display = 'flex';
    mainContent.style.display = 'none';
    
    // パスワード入力欄にフォーカス
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.focus();
    }
}

// メインコンテンツを表示
function showMainContent() {
    const authContainer = document.getElementById('authContainer');
    const mainContent = document.getElementById('mainContent');
    
    authContainer.style.display = 'none';
    mainContent.style.display = 'block';
}

// 認証処理
function authenticate() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    const errorMsg = document.getElementById('errorMsg');

    if (!password) {
        errorMsg.textContent = 'パスワードを入力してください';
        errorMsg.classList.add('show');
        return;
    }

    if (password === CORRECT_PASSWORD) {
        // 認証成功
        const authData = {
            authenticated: true,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
        
        errorMsg.classList.remove('show');
        passwordInput.value = '';
        
        // スムーズなトランジション
        setTimeout(() => {
            showMainContent();
        }, 300);
    } else {
        // 認証失敗
        errorMsg.textContent = 'パスワードが間違っています';
        errorMsg.classList.add('show');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Enterキーでログイン
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        authenticate();
    }
}

// ログアウト処理
function logout() {
    localStorage.removeItem(AUTH_KEY);
    showAuthPage();
}

// スムーズなスクロール処理
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]:not([onclick])');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
