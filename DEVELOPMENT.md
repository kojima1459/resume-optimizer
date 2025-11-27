# DEVELOPMENT.md - 開発の全記録

## プロジェクト概要とコンセプト

### プロジェクト名
**AI職務経歴書最適化メイカー**

### コンセプト
求人情報に合わせて、あなたの職務経歴書をAIが最適化するチート便利ツールです！

転職活動において、職務経歴書の作成は非常に時間がかかる作業です。特に、応募先企業ごとに職務経歴書をカスタマイズする必要があり、多くの求職者がこの作業に苦労しています。このプロジェクトは、AIを活用して職務経歴書の最適化を自動化し、転職活動を効率化することを目的としています。

### ターゲットユーザー
- 転職活動中の求職者
- 複数企業に応募する予定のある求職者
- 職務経歴書の作成に時間をかけたくない求職者
- 書類選考の通過率を向上させたい求職者

### 主な価値提案
1. **時間の節約** - 職務経歴書の作成時間を大幅に短縮
2. **品質の向上** - AIが求人情報に最適化された表現を提案
3. **複数パターン生成** - 異なるスタイルで複数パターンを生成し、比較可能
4. **AI自動評価** - 生成された職務経歴書を自動評価してスコアリング

## 技術スタックの選定理由

### フロントエンド

**React 19**
- 最新のReact機能（Server Components、Concurrent Rendering）を活用
- 豊富なエコシステムとコミュニティサポート
- 型安全性とパフォーマンスの両立

**TypeScript**
- 型安全性によるバグの早期発見
- IDEのサポートによる開発効率の向上
- フロントエンドとバックエンドで型を共有可能

**Tailwind CSS 4**
- ユーティリティファーストのアプローチによる高速開発
- カスタマイズ性の高さ
- レスポンシブデザインの容易な実装

**shadcn/ui**
- 再利用可能なUIコンポーネント
- アクセシビリティ対応
- カスタマイズ性の高さ

**tRPC 11**
- エンドツーエンドの型安全性
- フロントエンドとバックエンド間の型共有
- RESTful APIの代替として高速開発

### バックエンド

**Express 4**
- Node.jsの標準的なWebフレームワーク
- 豊富なミドルウェアエコシステム
- 軽量で柔軟性が高い

**Drizzle ORM**
- TypeScript-firstのORM
- 型安全なデータベース操作
- パフォーマンスの最適化

**MySQL/TiDB**
- 信頼性の高いリレーショナルデータベース
- スケーラビリティ
- Manusプラットフォームとの統合

### AI・外部サービス

**Manus LLM API**
- 高品質なAI生成
- 簡単な統合
- コスト効率

**Manus Storage API**
- ファイルストレージの簡単な統合
- セキュリティ対応
- スケーラビリティ

**Tesseract.js**
- オープンソースのOCRエンジン
- ブラウザで動作
- 多言語対応

## 開発フェーズの詳細

### フェーズ1: プロジェクト初期化とコア機能実装

**期間:** 2025年11月初旬

**実装内容:**
- プロジェクトの初期化（Manus webdev_init_project）
- データベーススキーマの設計（users, resumes, api_keys, templates, user_templates）
- 基本的なUI実装（職務経歴書入力、求人情報入力、出力項目選択）
- AI生成機能の実装（tRPC procedure: resume.generate）
- 認証機能の実装（Manus OAuth）

**技術的課題:**
- tRPCとDrizzle ORMの統合
- Manus LLM APIの統合
- JSON形式のレスポンスパース

**解決策:**
- tRPCのprocedureでDrizzle ORMを使用したデータベース操作を実装
- Manus LLM APIのinvokeLLM関数を使用してAI生成を実装
- 正規表現を使用してマークダウンのコードブロックを削除してからJSONパース

### フェーズ2: ファイルアップロード機能とOCR機能

**期間:** 2025年11月中旬

**実装内容:**
- ファイルアップロード機能（PDF、Word、画像）
- OCR機能（Tesseract.js）
- ファイルからのテキスト抽出

**技術的課題:**
- ブラウザでのOCR処理のパフォーマンス
- 複数ファイル形式のサポート
- ファイルサイズ制限

**解決策:**
- Tesseract.jsのWorkerを使用して非同期処理
- pdf-parse、mammothライブラリを使用してPDF/Word文書からテキスト抽出
- ファイルサイズ制限を16MBに設定

### フェーズ3: 複数パターン生成機能

**期間:** 2025年11月中旬

**実装内容:**
- 複数パターン生成機能（tRPC procedure: resume.generateMultiple）
- 異なるスタイルでの生成（実績重視、情熱重視、チームワーク重視など）
- パターン選択UI

**技術的課題:**
- 複数パターンの並列生成
- 異なるスタイルの実装
- パターン選択UIの実装

**解決策:**
- forループで順次生成（並列処理は将来の改善点）
- スタイル指定プロンプトを使用して異なるスタイルを実現
- ダイアログUIでパターンを一覧表示し、選択可能に

### フェーズ4: AI自動評価機能

**期間:** 2025年11月下旬

**実装内容:**
- AI自動評価機能（server/evaluation.ts）
- 評価項目（求人との関連性、明確性、インパクト、完全性）
- スコアリング（0-100点）

**技術的課題:**
- 評価基準の設計
- 複数パターンの並列評価
- 評価結果の表示

**解決策:**
- 評価項目を4つに分類し、各項目を0-25点で評価
- Promise.allを使用して複数パターンを並列評価
- パターン選択ダイアログに評価スコアを表示

### フェーズ5: テンプレート機能

**期間:** 2025年11月下旬

**実装内容:**
- 業界別・職種別テンプレート機能
- ユーザー独自テンプレート機能
- テンプレート管理UI

**技術的課題:**
- テンプレートデータの設計
- テンプレート選択UIの実装
- ユーザー独自テンプレートの保存

**解決策:**
- templatesテーブルとuser_templatesテーブルを分離
- ドロップダウンUIでテンプレートを選択
- tRPC procedureでユーザー独自テンプレートのCRUD操作を実装

### フェーズ6: お気に入り機能と履歴管理

**期間:** 2025年11月下旬

**実装内容:**
- お気に入り機能（favorite_resumes, favorite_patterns）
- 履歴管理機能（resumes）
- 履歴一覧UI

**技術的課題:**
- お気に入りと履歴の分離
- 履歴一覧の表示
- 履歴の再利用

**解決策:**
- favorite_resumesとfavorite_patternsテーブルを分離
- ダイアログUIで履歴を一覧表示
- 履歴をクリックすると入力フォームに復元

### フェーズ7: 多言語対応

**期間:** 2025年11月下旬

**実装内容:**
- i18next統合
- 日本語・英語翻訳ファイル（ja.json、en.json）
- 言語切り替えUI

**技術的課題:**
- 全UIの翻訳対応
- 翻訳キーの管理
- 言語切り替え時の状態管理

**解決策:**
- i18nextのuseTranslation hookを使用
- 翻訳キーを階層構造で管理（header, buttons, errors, toasts）
- LanguageSwitcherコンポーネントで言語切り替え

### フェーズ8: 品質保証とドキュメント作成

**期間:** 2025年11月下旬

**実装内容:**
- コードレビュー
- テスト実装（Vitest）
- UI/UX改善
- ドキュメント作成（README.md、DEVELOPMENT.md、CHANGELOG.md）

**技術的課題:**
- テストカバレッジの向上
- UI/UX改善の優先順位付け
- ドキュメントの網羅性

**解決策:**
- Vitestで39個のテストを実装し、全て成功
- キャッチコピーを大きく太字で目立つように表示
- README.md、DEVELOPMENT.md、CHANGELOG.mdを作成

## 技術的課題と解決策

### 課題1: tRPCのレスポンス構造変更によるテスト失敗

**問題:**
AI評価機能の統合時に、`generateMultiple` procedureのレスポンス構造が変更されたため、テストが失敗しました。

**旧構造:**
```typescript
{ summary: "...", motivation: "..." }
```

**新構造:**
```typescript
{ pattern: { summary: "...", motivation: "..." }, evaluation: {...} }
```

**解決策:**
テストファイル（server/resume.generateMultiple.test.ts）を修正して、新しいレスポンス構造に対応しました。

```typescript
// 修正前
result.patterns.forEach((pattern) => {
  expect(pattern).toHaveProperty("summary");
  expect(pattern).toHaveProperty("motivation");
});

// 修正後
result.patterns.forEach((item) => {
  expect(item).toHaveProperty("pattern");
  expect(item).toHaveProperty("evaluation");
  expect(item.pattern).toHaveProperty("summary");
  expect(item.pattern).toHaveProperty("motivation");
});
```

### 課題2: OCR処理のパフォーマンス問題

**問題:**
ブラウザでのOCR処理が遅く、ユーザー体験が悪化していました。

**解決策:**
Tesseract.jsのWorkerを使用して非同期処理を実装し、処理中はローディング表示を追加しました。

```typescript
const worker = await createWorker('jpn');
const { data: { text } } = await worker.recognize(imageFile);
await worker.terminate();
```

### 課題3: 翻訳機能の初期化問題

**問題:**
i18nextの初期化が完了する前にコンポーネントがレンダリングされ、翻訳が表示されない問題が発生しました。

**解決策:**
i18nextの初期化を`main.tsx`で行い、`Suspense`コンポーネントでラップしてローディング状態を表示しました。

```typescript
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja',
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
  });

<Suspense fallback={<div>Loading...</div>}>
  <App />
</Suspense>
```

### 課題4: ファイルアップロードのサイズ制限

**問題:**
大きなファイルをアップロードすると、ブラウザがクラッシュする問題が発生しました。

**解決策:**
ファイルサイズ制限を16MBに設定し、超過した場合はエラーメッセージを表示しました。

```typescript
const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB

if (file.size > MAX_FILE_SIZE) {
  toast.error(t('errors.fileTooLarge'));
  return;
}
```

## パフォーマンス最適化

### 1. tRPCのキャッシュ戦略

tRPCのuseQueryフックを使用して、サーバーからのレスポンスをキャッシュし、不要なリクエストを削減しました。

```typescript
const { data, isLoading } = trpc.resume.getHistory.useQuery(undefined, {
  staleTime: 60000, // 1分間キャッシュ
});
```

### 2. React.memoによるコンポーネントの最適化

頻繁に再レンダリングされるコンポーネントを`React.memo`でラップし、不要な再レンダリングを防止しました。

```typescript
const FileDropZone = React.memo(({ onFileUpload }) => {
  // ...
});
```

### 3. useMemoによる計算結果のキャッシュ

重い計算処理を`useMemo`でキャッシュし、パフォーマンスを向上させました。

```typescript
const standardItems = useMemo(() => [
  { key: 'summary', label: t('standardItems.summary') },
  { key: 'career_history', label: t('standardItems.careerHistory') },
  // ...
], [t]);
```

## セキュリティ対策

### 1. APIキーの暗号化

ユーザーが設定したGemini APIキーは、データベースに保存する前に暗号化されます。

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key';
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}
```

### 2. XSS対策

ユーザー入力をサニタイズし、XSS攻撃を防止しています。

```typescript
import DOMPurify from 'dompurify';

const sanitizedInput = DOMPurify.sanitize(userInput);
```

### 3. CSRF対策

Manus OAuthを使用した認証により、CSRF攻撃を防止しています。

## iOS化の検討

React Nativeを使用したiOSアプリ化を検討中です。以下の点を考慮しています：

### メリット
- モバイルファーストの設計により、スマートフォンでも快適に利用可能
- ネイティブアプリとしてApp Storeで配信可能
- プッシュ通知などのネイティブ機能を活用可能

### 課題
- React Nativeへの移植コスト
- iOSとWebの両方のメンテナンスコスト
- App Storeの審査プロセス

### 実装方針
- Expo を使用してReact Nativeアプリを構築
- tRPC APIをそのまま使用
- UIコンポーネントをReact Native用に再実装

## 学んだこととやりとりのログ

### 学んだこと

1. **tRPCの強力さ** - エンドツーエンドの型安全性により、フロントエンドとバックエンド間の型共有が容易になり、開発効率が大幅に向上しました。

2. **Drizzle ORMの使いやすさ** - TypeScript-firstのORMとして、型安全なデータベース操作が可能になり、バグの早期発見につながりました。

3. **Manus LLM APIの高品質** - Manus LLM APIを使用することで、高品質なAI生成が可能になり、ユーザー体験が向上しました。

4. **多言語対応の重要性** - i18nextを使用した多言語対応により、グローバルなユーザーベースを獲得できる可能性が広がりました。

5. **テストの重要性** - Vitestを使用したテスト実装により、リファクタリング時の安心感が得られ、品質が向上しました。

### 問題解決のログ

#### 問題1: tRPCのレスポンス構造変更によるテスト失敗

**発生日:** 2025年11月27日

**問題:**
AI評価機能の統合時に、`generateMultiple` procedureのレスポンス構造が変更されたため、テストが失敗しました。

**解決策:**
テストファイル（server/resume.generateMultiple.test.ts）を修正して、新しいレスポンス構造に対応しました。

**学び:**
レスポンス構造を変更する際は、テストも同時に更新する必要があることを学びました。

#### 問題2: 翻訳機能の初期化問題

**発生日:** 2025年11月27日

**問題:**
i18nextの初期化が完了する前にコンポーネントがレンダリングされ、翻訳が表示されない問題が発生しました。

**解決策:**
i18nextの初期化を`main.tsx`で行い、`Suspense`コンポーネントでラップしてローディング状態を表示しました。

**学び:**
非同期初期化処理は、アプリケーションの起動時に完了させる必要があることを学びました。

#### 問題3: OCR処理のパフォーマンス問題

**発生日:** 2025年11月中旬

**問題:**
ブラウザでのOCR処理が遅く、ユーザー体験が悪化していました。

**解決策:**
Tesseract.jsのWorkerを使用して非同期処理を実装し、処理中はローディング表示を追加しました。

**学び:**
重い処理は非同期処理にし、ユーザーにフィードバックを提供することが重要であることを学びました。

## 今後の改善点

1. **複数パターンの並列生成** - 現在は順次生成ですが、並列生成に変更してパフォーマンスを向上させる
2. **AI評価の精度向上** - 評価基準をさらに細分化し、より正確な評価を実現する
3. **テンプレートの充実** - 業界別・職種別テンプレートを追加し、より多様なニーズに対応する
4. **iOS化** - React Nativeを使用したiOSアプリ化を実現する
5. **AI面接対策機能** - 求人情報と職務経歴書からAIが想定質問と回答例を自動生成する機能を追加
6. **LinkedIn人材検索機能** - LinkedIn APIを使用して企業情報や人材情報を取得し、関連企業を提案する機能を追加
7. **バッチ一括応募機能** - 複数企業への応募を一括で行える機能を追加

## まとめ

このプロジェクトは、Manusプラットフォームを活用して、転職活動を効率化するWebアプリケーションを開発しました。tRPC、Drizzle ORM、Manus LLM APIなどの最新技術を使用し、高品質なアプリケーションを実現しました。今後も機能追加や改善を続け、より多くのユーザーに価値を提供していきます。

---

**開発者:** [@kojima920](https://github.com/kojima920)  
**最終更新:** 2025年11月27日
