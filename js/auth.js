/**
 * Cloudflare Workers 連携版
 * サーバー側でパスワード検証を行い、セッショントークンを取得します
 */

const AUTH_KEY = 'portfolioAuthToken';
const AUTH_TIMESTAMP_KEY = 'portfolioAuthTimestamp';
const SESSION_TIMEOUT = 3600000; // 1時間（ミリ秒）

// APIエンドポイント（Cloudflare Workersの場合）
const API_ENDPOINT = '/api/auth';

// ページロード時の処理
document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        showMainContent();
    } else {
        showAuthPage();
    }
});

/**
 * 認証状態をチェック
 */
function isAuthenticated() {
    const token = localStorage.getItem(AUTH_KEY);
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);

    if (!token || !timestamp) return false;

    try {
        const currentTime = new Date().getTime();
        const tokenTime = parseInt(timestamp);

        // タイムアウトをチェック
        if (currentTime - tokenTime > SESSION_TIMEOUT) {
            clearAuth();
            return false;
        }

        return true;
    } catch (e) {
        clearAuth();
        return false;
    }
}

/**
 * 認証ページを表示
 */
function showAuthPage() {
    const authContainer = document.getElementById('authContainer');
    const mainContent = document.getElementById('mainContent');

    authContainer.style.display = 'flex';
    mainContent.style.display = 'none';

    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.focus();
    }
}

/**
 * メインコンテンツを表示
 */
function showMainContent() {
    const authContainer = document.getElementById('authContainer');
    const mainContent = document.getElementById('mainContent');

    authContainer.style.display = 'none';
    mainContent.style.display = 'block';
}

/**
 * 認証処理（Cloudflare Workers経由）
 */
async function authenticate() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    const errorMsg = document.getElementById('errorMsg');
    const authBtn = document.getElementById('authBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (!password) {
        showError('パスワードを入力してください');
        return;
    }

    // ローディング表示
    authBtn.disabled = true;
    authBtn.style.opacity = '0.6';
    loadingSpinner.style.display = 'block';

    try {
        // サーバーにパスワードを送信
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password })
        });

        const result = await response.json();

        if (result.success && result.token) {
            // トークンをlocalStorageに保存
            localStorage.setItem(AUTH_KEY, result.token);
            localStorage.setItem(AUTH_TIMESTAMP_KEY, new Date().getTime().toString());

            errorMsg.classList.remove('show');
            passwordInput.value = '';

            // スムーズなトランジション
            setTimeout(() => {
                showMainContent();
                authBtn.disabled = false;
                authBtn.style.opacity = '1';
                loadingSpinner.style.display = 'none';
            }, 300);
        } else {
            showError(result.message || 'ログインに失敗しました');
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        console.error('認証エラー:', error);
        showError('ネットワークエラーが発生しました');
        passwordInput.focus();
    } finally {
        authBtn.disabled = false;
        authBtn.style.opacity = '1';
        loadingSpinner.style.display = 'none';
    }
}

/**
 * エラーメッセージを表示
 */
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
}

/**
 * Enterキーでログイン
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        const authBtn = document.getElementById('authBtn');
        if (!authBtn.disabled) {
            authenticate();
        }
    }
}

/**
 * ログアウト処理
 */
function logout() {
    clearAuth();
    showAuthPage();
}

/**
 * 認証情報をクリア
 */
function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
}

/**
 * スムーズなスクロール処理
 */
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
