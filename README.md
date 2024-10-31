# amplify-gen2-with-playwright

🚿🚿🚿 Amplify Gen2にPlaywrightを導入してテストを実行してみる！  

[![ci](https://github.com/osawa-koki/amplify-gen2-with-playwright/actions/workflows/ci.yml/badge.svg)](https://github.com/osawa-koki/amplify-gen2-with-playwright/actions/workflows/ci.yml)
[![Dependabot Updates](https://github.com/osawa-koki/amplify-gen2-with-playwright/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/osawa-koki/amplify-gen2-with-playwright/actions/workflows/dependabot/dependabot-updates)

![成果物](./fruit.gif)  

## 実行方法

DevContainerに入り、以下のコマンドを実行します。  

```bash
npx ampx sandbox
```

`./amplify_outputs.json`にバックエンド情報が記載されるまで待ちます。  
`File written: amplify_outputs.json`というログが出力されたら、バックエンドリソースの作成が完了しています。  
このプロセスはキルせず、そのままにしておきます。  

別のターミナルで以下のコマンドを実行します。  

```bash
npm run scripts:run:setup
npx playwright test
```

また、ローカルサーバーを起動させる場合には、以下のコマンドを実行します。  

```bash
npm run dev
```

## メモ

1. 共通初期セットアップ
2. ログイン処理の簡素化
3. ユーザの切り替え

### 1. 共通初期セットアップ

`./playwright.config.ts`の`globalSetup`で指定します。  
デフォルトエクスポートした関数が実行されます。  
UIモードで実行している場合で、`globalSetup`の変更内容を反映させるには、プロセスを生成し直す必要があります。  
※ 今回はセットアップスクリプトでトークン情報を取得しているため、使用していない。  

### 2. ログイン処理の簡素化

`globalSetup`でログインして、クッキーやローカルストレージにログイン情報が保存されている状態にします。  
`page.context().storageState({ path: './storageState.json' });`でログイン情報をファイルに保存します。  
`./playwright.config.ts`の`use.storageState`にファイルパス(`./storageState.json`)を指定します。  

### 3. ユーザの切り替え

`globalSetup`で複数のユーザでログインし、それぞれのログイン情報をファイルに保存します。  
`page.context().storageState({ path: './storageState.<USER>.json' });`のようにユーザごとにファイル名を変更して保存します。  

各テストファイル内で`test.use({ storageState: './storageState.<USER>.json' });`を指定します。  

## 参考文献

- [Amplify Gen2 | Next.js App Router](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/)
