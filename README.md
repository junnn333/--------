# ポートフォリオサイト

パスワード保護されたポートフォリオサイトです。Cloudflare Pagesで動作します。

## ✨ 特徴

- 🔐 **パスワード認証機能**: セッションベースの認証
- 📱 **レスポンシブデザイン**: モバイル対応
- 🚀 **Cloudflare Pages対応**: サーバーレスデプロイ
- ⚡ **高速**: 静的サイトで高速読み込み
- 🎨 **モダンなUI**: グラデーション背景とスムーズなアニメーション

## 📋 セクション

1. **Profile** - 自己紹介
2. **Skills** - スキル一覧
3. **Works** - プロジェクト実績
4. **Qualifications** - 資格取得

## 🔐 デフォルトパスワード

```
1234
```

⚠️ **セキュリティ注意**: デプロイ前に必ずパスワードを変更してください！

## 🚀 デプロイ方法

### 前提条件
- GitHubアカウント
- Cloudflareアカウント

### 手順

1. **このリポジトリをGitHubにプッシュ**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Cloudflare Pagesでデプロイ**
   - [Cloudflare Pages](https://pages.cloudflare.com)にアクセス
   - GitHubリポジトリを接続
   - ビルド設定:
     - フレームワーク: なし
     - ビルドコマンド: （空白）
     - ビルド出力ディレクトリ: `/`

3. **完了！**
   - デプロイ完了後、カスタムドメインを設定できます

## 📝 カスタマイズ

### パスワードの変更
[js/auth.js](js/auth.js) の `CORRECT_PASSWORD` を変更:
```javascript
const CORRECT_PASSWORD = "your-password-here";
```

### コンテンツの編集
[index.html](index.html) を編集して、自分の情報を追加:
- Profile セクション
- Skills リスト
- Works プロジェクト
- Qualifications 資格

### スタイルの変更
[css/style.css](css/style.css) でカラースキームやレイアウトをカスタマイズ

## 📦 ファイル構成

```
.
├── index.html           # メインHTML
├── css/
│   └── style.css        # スタイルシート
├── js/
│   └── auth.js          # 認証ロジック
├── package.json         # プロジェクト設定
├── wrangler.toml        # Cloudflare設定
├── _redirects           # リダイレクト設定
├── .gitignore           # Git除外設定
├── README.md            # このファイル
└── CLOUDFLARE_PAGES.md  # Cloudflare Pages詳細ガイド
```

## 🔒 セキュリティ

- クライアント側でのパスワード認証
- セッションストレージを使用した状態管理
- オートコンプリート無効化

⚠️ **注意**: これはクライアント側の認証です。機密情報の保存には向きません。

## 🛠️ ローカルテスト

### Python を使用
```bash
python -m http.server 8000
```
http://localhost:8000 にアクセス

### Node.js を使用
```bash
npx http-server
```

## 📄 ライセンス

MIT License

## 🤝 サポート

質問や問題がある場合は、GitHubのissueを作成してください。

---

**作成日**: 2025年12月13日
**Cloudflare Pages対応**: ✅
