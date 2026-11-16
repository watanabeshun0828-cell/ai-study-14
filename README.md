# AI STUDY 14 — Ver.1

生成AIアドバイザー1級の学習を支援する、14日間の学習用PWAです。React + TypeScript + Viteで実装し、講義と問題をJSONから取り込みます。サーバー・アカウント登録は不要です。

**現在の収録内容はDay1「AIの基礎理解」の4章・独自作成の4択8問です。** 実際の原稿は未提供のため、Day1は動作確認用のオリジナル教材です。公式教材・公式問題の転載はしていません。資格運営団体による公式アプリではなく、試験範囲への完全な準拠や合格を保証するものではありません。Day2〜14は未収録で、テーマは仮案です。

## 起動

Node.js 22.12以上（開発確認はNode.js 24）とnpmを使用します。

```sh
npm ci
npm run dev
```

表示されたURLをブラウザで開きます。PWAとオフラインの確認は開発サーバーではなく、本番ビルドで行います。

```sh
npm run build
npm run preview
```

スマートフォンの実機からローカルプレビューする場合、PCの`127.0.0.1`はスマートフォンから接続できません。PWAのインストール・Service Workerの確認には、下記のGitHub PagesなどHTTPSの環境を使用してください。

## 機能

| 画面 | 内容 |
| --- | --- |
| ホーム | 14日間の達成状況、今日の講義、続きから再開、連続学習、復習待ち |
| 講義 | 章別テキスト、図解、学習目標、重要ポイント、読了チェック |
| テスト | 4択、回答確定、正誤・解説、関連講義、結果一覧 |
| 復習 | 最新の回答が誤答だった問題だけを再出題。正解で対象から除外 |
| 成績 | 直近7日の正答率、分野別集計、全テスト・復習履歴 |

- ライト・ダーク・端末設定追従、iPhone向け下部ナビ、セーフエリア対応。
- 講義の章位置、読了章、問題の選択、回答確定後の解説表示、テスト位置、学習履歴をIndexedDBに自動保存。
- 読み込みエラー時は保存内容を上書きせず再試行を表示。書き込み失敗時は警告・再保存を表示。
- ページのURLは`#/lessons`などのハッシュ形式。GitHub Pagesで直接再読み込みしても404になりません。
- 外部API・外部フォント・CDNへの実行時依存なし。収録教材もアプリと一緒にキャッシュします。

## 学習・集計ルール

- **1日達成**：全章を読了し、その日の通常テストで80%以上を取得。復習の点数だけでは達成扱いになりません。
- **復習待ち**：問題ごとの最新の確定回答が不正解のもの。途中のテストの確定回答も反映します。
- **成績**：完了した通常テストと復習の延べ回答を集計。再受験も含み、途中のテストは完了時に反映します。
- **日別**：端末のローカル日付で各回答を集計。日をまたいで解いた場合も回答した日を使用します。
- **連続学習**：読了または回答確定を行った日を数えます。今日まだ学んでいなくても、昨日までの連続記録は維持します。
- テスト・復習の途中データは同時に1セッション。別のセッションを始める際は置き換え確認を表示します。

## 教材追加・原稿の取り込み

詳細は[教材追加ガイド](docs/CONTENT.md)と[JSON Schema](docs/course.schema.json)を参照してください。

1. `src/data/day01.json`をコピーし、`src/data/day02.json`などを作成。
2. `day`、教材ID、章ID、問題IDを新しい値に変更し、原稿をテキスト・図解・問題に分けて入力。
3. `npm run validate:content`で形式と参照整合性を検証。
4. `npm test`と`npm run build`を実行し、更新を公開。

`day*.json`を自動検出するため、画面やimport文の追加は不要です。タイトルは追加した教材から表示され、学習プランの該当日が利用可能になります。補助的な予定テーマやグループ名は`src/data/curriculum.json`で編集します。教材はビルド時に組み込まれるため、ファイルを追加したら再ビルド・再公開が必要です。

## iPhoneにインストール・オフライン利用

1. HTTPSの公開URLをSafariで開く。
2. オンラインのまま、上部に「オフライン利用OK」が表示されることを確認。
3. Safariの共有メニュー →「ホーム画面に追加」→「追加」。
4. ホーム画面のアイコンから開く。キャッシュ済み教材は機内モードでも利用できます。

アプリの設定にもインストール案内があります。対応ブラウザでインストールイベントが提供される場合はネイティブの案内を使います。メニュー名・配置はOSやブラウザにより異なります。

更新は自動で学習を中断しないように通知方式です。「保存して更新」を押すと新しい教材・アプリを適用します。保存中・保存失敗時は更新を実行できません。

**保存の範囲**：データは端末・ブラウザ・オリジンごとです。端末間同期やクラウドバックアップはありません。ブラウザデータの削除、プライベートブラウズの終了、OSによるストレージ回収で失われる場合があります。Safariとホーム画面アプリの保存領域の共有はOSの挙動に依存するため、普段使う起動方法を統一してください。

## 自動テスト

```sh
npm run validate:content
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

- Vitest：採点・二重確定防止・進行制御・復習対象・達成条件・日付集計・教材検証・IndexedDB保存復元・回答UI。
- Playwright：iPhone相当の幅で全学習フロー、途中再開、Service Workerによるオフライン再読み込みと保存、テーマ復元、インストール案内、320px・デスクトップのはみ出し確認。
- E2Eは`dist/`を使用します。変更後は先に`npm run build`を実行してください。
- テスト中のブラウザデータはテスト専用の一時コンテキストで分離されます。
- ChromiumでのiPhoneサイズ検証は実機Safariの代替ではありません。公開後は実機でホーム画面追加・機内モード・再起動後の復元を確認してください。

## GitHub Pagesへ公開

同梱の`.github/workflows/deploy.yml`で、テスト・教材検証・ビルド後に公開します。GitHubへのpushや公開そのものは、この開発作業では行っていません。

1. GitHubで空のリポジトリ（例：`ai-study-14`）を作成。
2. プロジェクトをpush。

```sh
git init
git add .
git commit -m "Build AI STUDY 14 v1"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/ai-study-14.git
git push -u origin main
```

3. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定。
4. **Actions → Deploy to GitHub Pages → Run workflow** を実行（以後はmainへのpushで更新）。
5. 成功後、`https://YOUR_ACCOUNT.github.io/ai-study-14/`を開く。画面・manifest・Service Workerのスコープは同じサブパスに設定されます。

ワークフローは`actions/configure-pages`の`base_path`から`VITE_BASE_PATH`を設定します。リポジトリ名をコードに埋め込む必要はありません。ユーザーサイトやカスタムドメインでは自動的にルートパスを使います。

手動でサブパスのビルドを確認する場合：

```sh
VITE_BASE_PATH=/ai-study-14/ npm run build
npm run preview
# http://127.0.0.1:4173/ai-study-14/ を開く
```

通常のローカルプレビューに戻す場合は`npm run build`を実行してください。生成物は`dist/`です。これをfile://で直接開いてもPWAは動作しません。

## プロジェクト構成

```text
src/
  App.tsx                 ナビ・テーマ・PWA・インストール案内
  components/             ホーム、講義、テスト、復習、成績、共通UI
  data/
    curriculum.json       14日分の予定テーマ
    day01.json            講義・図解・問題・解説
    index.ts              day*.jsonの自動読込
  lib/
    content.ts            教材スキーマ・整合性検証
    study.ts              採点・進行・集計（純粋関数）
    db.ts                 IndexedDB v1
    store.tsx             読込・状態更新・順序付き保存・失敗表示
  test/                   テスト共通設定
public/icons/             通常・maskable・Apple用アイコン
scripts/                  教材検証・Schema出力
tests/                    ブラウザE2E
docs/                     教材追加ガイド・JSON Schema
.github/workflows/        検証・GitHub Pages公開
```

教材、UI、学習ロジック、永続化を分離しています。DBの構造を変える場合は`db.ts`のDBバージョンとマイグレーションを追加し、`StudyState.version`の扱いも更新してください。古い教材の履歴は問題IDで参照するため、同じ問題のIDは維持してください。

実装資料：[ViteのGitHub Pages公開手順](https://vite.dev/guide/static-deploy)、[Vite PWAのService Worker設定](https://vite-pwa-org.netlify.app/guide/service-worker-strategies-and-behaviors)、[MDNのPWAインストール要件](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)。
