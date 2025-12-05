# Portfolio - パスワード保護ポートフォリオサイト

このポートフォリオサイトはCloudflareを使用してホストされています。

## ファイル構成

```
portfolio/
├── index.html          # メインのHTMLファイル
├── css/
│   └── style.css       # スタイルシート
├── js/
│   └── auth.js         # パスワード認証機能
├── package.json        # npmの設定
├── wrangler.toml       # Cloudflareの設定
└── README.md           # このファイル
```

## ローカルテスト

1. Python がインストールされている場合：
```bash
python -m http.server 8000
```

2. Node.js がインストールされている場合：
```bash
npx serve
```

その後、ブラウザで `http://localhost:8000` にアクセスしてください。

## Cloudflareへのデプロイ

### 前提条件
- Cloudflareアカウント
- Wrangler CLI のインストール

### デプロイ手順

1. Wranglerをインストール：
```bash
npm install -g wrangler
```

2. Cloudflareにログイン：
```bash
wrangler login
```

3. `wrangler.toml` を編集し、あなたのドメイン情報を設定：
```toml
[env.production]
routes = [
  { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
]
```

4. デプロイ：
```bash
wrangler publish
```

## パスワード設定

`js/auth.js` の以下の行でパスワードを設定できます：

```javascript
const CORRECT_PASSWORD = 'portfolio2025';
```

## セキュリティに関する注意

- このポートフォリオはクライアント側のJavaScriptでパスワード認証を行っています
- より高いセキュリティが必要な場合は、サーバー側での認証を実装してください
- パスワードは環境変数などで管理することをお勧めします

## カスタマイズ

### プロフィール情報の更新
`index.html` の Profile セクションを編集してください。

### スキル情報の更新
`index.html` の Skills セクションを編集してください。

### 制作物の追加
`index.html` の Works セクションに新しい `<div class="work-card">` を追加してください。

### スタイルの変更
`css/style.css` でカラースキームやレイアウトをカスタマイズできます。

## サポート

ご不明な点やカスタマイズが必要な場合は、お気軽にお問い合わせください。

---
作成日：2025年12月5日
