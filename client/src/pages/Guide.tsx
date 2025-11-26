import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_TITLE } from "@/const";
import { 
  BookOpen, 
  CheckCircle2, 
  FileText, 
  Lightbulb, 
  Settings, 
  Star, 
  TrendingUp, 
  Users,
  AlertCircle,
  Zap,
  Target,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

export default function Guide() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* ヘッダー */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-lg font-semibold">
              {APP_TITLE}
            </Button>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">ホーム</Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/my-templates">
                  <Button variant="ghost">マイテンプレート</Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="ghost">お気に入り</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container py-12">
        {/* タイトルセクション */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            ガイド・チュートリアル
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {APP_TITLE}の使い方、機能、注意点を詳しく解説します。
          </p>
        </div>

        {/* タブコンテンツ */}
        <Tabs defaultValue="overview" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="features">機能</TabsTrigger>
            <TabsTrigger value="tutorial">使い方</TabsTrigger>
            <TabsTrigger value="tips">注意点・Tips</TabsTrigger>
          </TabsList>

          {/* 概要タブ */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {APP_TITLE}とは
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {APP_TITLE}は、AI技術を活用して職務経歴書を求人情報に最適化するWebアプリケーションです。
                  あなたの職務経歴書と応募したい求人情報を入力するだけで、AIが求人に最適化された職務要約、志望動機、自己PRなどを自動生成します。
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 border rounded-lg">
                    <Zap className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-semibold mb-2">高速生成</h3>
                    <p className="text-sm text-muted-foreground">
                      AIが数秒で最適化された文書を生成します。
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Target className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-semibold mb-2">求人に最適化</h3>
                    <p className="text-sm text-muted-foreground">
                      求人情報を分析し、求められるスキルや経験を強調します。
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Sparkles className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-semibold mb-2">複数パターン生成</h3>
                    <p className="text-sm text-muted-foreground">
                      異なる表現パターンを比較して最適なものを選択できます。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  こんな方におすすめ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>複数の求人に応募する際、それぞれに合わせた職務経歴書を作成したい方</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>職務要約や志望動機の書き方に悩んでいる方</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>自己PRの表現を改善したい方</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>転職活動の効率を上げたい方</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 機能タブ */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  基本機能
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    AI文書生成
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    職務経歴書と求人情報を入力すると、AIが職務要約、志望動機、自己PR、「なぜ御社か」などの項目を自動生成します。
                    各項目の文字数を指定することも可能です。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    複数パターン生成
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    同じ入力から2〜5個の異なる表現パターンを生成し、比較して最適なものを選択できます。
                    各パターンにはAIによる自動評価スコアが表示されます。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    ファイルアップロード対応
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    PDF、Word、画像（PNG/JPEG）ファイルをアップロードして、自動的にテキストを抽出できます。
                    画像ファイルの場合はOCR技術を使用してテキストを認識します。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                    エクスポート機能
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    生成された文書をPDF、Word、テキスト、Markdown形式でダウンロードできます。
                    個別項目のコピーや再生成も可能です。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  高度な機能
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    業界別・職種別テンプレート
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    IT、金融、製造、営業、マーケティングなどの業界・職種別テンプレートを使用して、より専門的な文書を生成できます。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    ユーザー独自テンプレート
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    自分だけのカスタムテンプレートを作成・保存・管理できます。
                    よく使う表現やフォーマットをテンプレート化することで、生成の効率が向上します。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    お気に入りパターン保存
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    気に入ったパターンをお気に入りに保存し、後で見返したり比較したりできます。
                    複数のお気に入りパターンを並べて比較し、差異をハイライト表示する機能もあります。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                    AI自動評価
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    生成されたパターンを求人情報と照らし合わせて自動評価し、スコアを表示します。
                    スコアが高いパターンほど求人に適合していると判断されます。
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                    英語翻訳
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    生成された日本語の文書を英語に翻訳できます。
                    外資系企業への応募にも対応できます。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  APIキー設定
                </CardTitle>
                <CardDescription>
                  OpenAI、Gemini、ClaudeのいずれかのAPIキーを設定することで、AI機能を使用できます。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">APIキーの設定方法</h3>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                      <span>ヘッダーの「API設定」ボタンをクリックして設定画面を開きます</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                      <span>使用したいAIプロバイダー（OpenAI / Gemini / Claude）を選択します</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                      <span>選択したプロバイダーのAPIキーを入力して「保存」ボタンをクリックします</span>
                    </li>
                  </ol>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">各プロバイダーのAPIキー取得方法</h3>
                  
                  {/* OpenAI */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-green-500 text-white rounded px-2 py-1 text-xs font-semibold">OpenAI</div>
                      <a 
                        href="https://platform.openai.com/api-keys" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline text-sm"
                      >
                        platform.openai.com/api-keys →
                      </a>
                    </div>
                    <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">①</span>
                        <span>OpenAIアカウントにログインします（未登録の場合は新規登録）</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">②</span>
                        <span>「API keys」ページで「+ Create new secret key」をクリックします</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">③</span>
                        <span>キーの名前を入力（例: Resume Optimizer）して「Create secret key」をクリックします</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">④</span>
                        <span>表示されたAPIキー（sk-で始まる文字列）をコピーして保存します</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">⚠️</span>
                        <span className="text-amber-600 dark:text-amber-400">APIキーは一度しか表示されないため、必ず安全な場所に保存してください</span>
                      </li>
                    </ol>
                  </div>

                  {/* Gemini */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-blue-500 text-white rounded px-2 py-1 text-xs font-semibold">Gemini</div>
                      <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline text-sm"
                      >
                        aistudio.google.com/app/apikey →
                      </a>
                    </div>
                    <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">①</span>
                        <span>Googleアカウントでログインします</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">②</span>
                        <span>「Get API key」または「Create API key」ボタンをクリックします</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">③</span>
                        <span>新しいプロジェクトを作成するか、既存のプロジェクトを選択します</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">④</span>
                        <span>生成されたAPIキーをコピーして保存します</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">💡</span>
                        <span className="text-blue-600 dark:text-blue-400">Gemini APIは無料枠が充実しているため、お試しに最適です</span>
                      </li>
                    </ol>
                  </div>

                  {/* Claude */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-purple-500 text-white rounded px-2 py-1 text-xs font-semibold">Claude</div>
                      <a 
                        href="https://console.anthropic.com/settings/keys" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline text-sm"
                      >
                        console.anthropic.com/settings/keys →
                      </a>
                    </div>
                    <ol className="space-y-2 text-sm text-muted-foreground ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">①</span>
                        <span>Anthropicアカウントにログインします（未登録の場合は新規登録）</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">②</span>
                        <span>「API Keys」ページで「Create Key」をクリックします</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">③</span>
                        <span>キーの名前を入力（例: Resume Optimizer）して作成します</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">④</span>
                        <span>表示されたAPIキーをコピーして保存します</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">⚠️</span>
                        <span className="text-amber-600 dark:text-amber-400">APIキーは一度しか表示されないため、必ず安全な場所に保存してください</span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-amber-900 dark:text-amber-100">重要な注意事項</p>
                      <ul className="space-y-1 text-amber-800 dark:text-amber-200">
                        <li>• APIキーは第三者に共有しないでください</li>
                        <li>• 本アプリケーションではAPIキーを暗号化して安全に保存しています</li>
                        <li>• API使用料金は各プロバイダーの料金体系に従って課金されます</li>
                        <li>• 無料枠を超えた場合は、各プロバイダーのアカウントで料金が発生します</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使い方タブ */}
          <TabsContent value="tutorial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  基本的な使い方
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">1</span>
                    ログイン
                  </h3>
                  <p className="text-muted-foreground ml-10">
                    Manusアカウントでログインします。ログインすることで、生成履歴の保存、テンプレート管理、お気に入り機能が使用できます。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">2</span>
                    APIキーの設定
                  </h3>
                  <p className="text-muted-foreground ml-10 mb-2">
                    ヘッダーの「API設定」ボタンからOpenAI、Gemini、ClaudeのいずれかのAPIキーを入力します。
                  </p>
                  <ul className="text-sm text-muted-foreground ml-10 space-y-1">
                    <li>• 3つのAIプロバイダー（OpenAI / Gemini / Claude）から選択できます</li>
                    <li>• APIキーは暗号化してデータベースに安全に保存されます</li>
                    <li>• 詳しい取得方法は「機能」タブの「APIキー設定」セクションをご覧ください</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">3</span>
                    職務経歴書の入力
                  </h3>
                  <p className="text-muted-foreground ml-10 mb-2">
                    「職務経歴書」欄に、あなたの職務経歴書の内容を入力します。
                  </p>
                  <ul className="text-sm text-muted-foreground ml-10 space-y-1">
                    <li>• テキスト入力、またはPDF/Word/画像ファイルをアップロード</li>
                    <li>• 画像ファイルの場合、OCRで自動的にテキストを抽出</li>
                    <li>• できるだけ詳しく記載すると、より良い結果が得られます</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">4</span>
                    求人情報の入力
                  </h3>
                  <p className="text-muted-foreground ml-10 mb-2">
                    「求人情報」欄に、応募したい求人の情報を入力します。
                  </p>
                  <ul className="text-sm text-muted-foreground ml-10 space-y-1">
                    <li>• テキスト入力、またはPDF/Word/画像ファイルをアップロード</li>
                    <li>• 求められるスキル、経験、資格などを含めると効果的</li>
                    <li>• 企業の特徴や文化についても記載すると、より適切な志望動機が生成されます</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">5</span>
                    出力項目の選択
                  </h3>
                  <p className="text-muted-foreground ml-10 mb-2">
                    生成したい項目を選択します。
                  </p>
                  <ul className="text-sm text-muted-foreground ml-10 space-y-1">
                    <li>• 職務要約: 職務経歴の要約</li>
                    <li>• 志望動機: なぜこの求人に応募するのか</li>
                    <li>• 自己PR: 自分の強みやスキルのアピール</li>
                    <li>• なぜ御社か: なぜこの企業を選んだのか</li>
                    <li>• カスタム項目: 独自の項目を追加可能</li>
                  </ul>
                  <p className="text-muted-foreground ml-10 mt-2">
                    各項目の文字数を指定することもできます（例: 300文字、500文字など）。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">6</span>
                    テンプレートの選択（オプション）
                  </h3>
                  <p className="text-muted-foreground ml-10">
                    業界別・職種別テンプレートや、自分で作成したカスタムテンプレートを選択できます。
                    テンプレートを使用すると、より専門的で適切な表現が生成されます。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">7</span>
                    生成方法の選択
                  </h3>
                  <p className="text-muted-foreground ml-10 mb-2">
                    生成ボタンの横にある「複数パターン生成」ボタンを使用すると、複数の異なる表現パターンを生成できます。
                  </p>
                  <ul className="text-sm text-muted-foreground ml-10 space-y-1">
                    <li>• 通常生成: 1つのパターンを生成</li>
                    <li>• 複数パターン生成: 2〜5個のパターンを生成し、比較して選択</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">8</span>
                    結果の確認と編集
                  </h3>
                  <p className="text-muted-foreground ml-10 mb-2">
                    生成された文書を確認し、必要に応じて編集します。
                  </p>
                  <ul className="text-sm text-muted-foreground ml-10 space-y-1">
                    <li>• 各項目を個別にコピー</li>
                    <li>• 気に入らない項目を再生成</li>
                    <li>• 項目を編集</li>
                    <li>• お気に入りに保存</li>
                    <li>• PDF/Word/テキスト/Markdown形式でダウンロード</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  高度な使い方
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">複数パターン生成と比較</h3>
                  <p className="text-muted-foreground mb-2">
                    「複数パターン生成」ボタンをクリックすると、2〜5個の異なる表現パターンを生成できます。
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside ml-4">
                    <li>生成するパターン数を選択（2〜5個）</li>
                    <li>各パターンにはAI自動評価スコアが表示されます</li>
                    <li>スコアが高いパターンほど求人に適合しています</li>
                    <li>気に入ったパターンを選択して使用</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">お気に入りパターンの比較</h3>
                  <p className="text-muted-foreground mb-2">
                    お気に入りページで複数のパターンを比較できます。
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside ml-4">
                    <li>お気に入りページで「比較モード」を有効化</li>
                    <li>比較したいパターンを選択（2〜4個）</li>
                    <li>「選択したパターンを比較」ボタンをクリック</li>
                    <li>差異がハイライト表示されます</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">カスタムテンプレートの作成</h3>
                  <p className="text-muted-foreground mb-2">
                    マイテンプレートページで独自のテンプレートを作成できます。
                  </p>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside ml-4">
                    <li>マイテンプレートページで「新規テンプレート作成」をクリック</li>
                    <li>テンプレート名、説明、プロンプトテンプレート、サンプル出力を入力</li>
                    <li>プロンプトテンプレートには、生成時に使用する指示を記載</li>
                    <li>保存したテンプレートは、生成時に選択して使用できます</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 注意点・Tipsタブ */}
          <TabsContent value="tips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  注意点
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    APIキーの管理
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• APIキーは第三者に共有しないでください</li>
                    <li>• APIキーの使用には料金が発生する場合があります</li>
                    <li>• OpenAIまたはGeminiの利用規約を確認してください</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    生成内容の確認
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• AIが生成した内容は必ず確認してください</li>
                    <li>• 事実と異なる内容が含まれている場合は修正してください</li>
                    <li>• 生成された文書はあくまで参考として使用してください</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    個人情報の取り扱い
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 入力した職務経歴書や求人情報は、AI生成のために使用されます</li>
                    <li>• 詳しくは<Link href="/privacy" className="text-primary hover:underline">プライバシーポリシー</Link>をご確認ください</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    ファイルアップロード
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 対応形式: PDF、Word（.docx）、画像（PNG/JPEG）</li>
                    <li>• ファイルサイズ制限: 16MB</li>
                    <li>• 画像ファイルのOCRは精度に限界があります</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  効果的な使い方のTips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">詳細な職務経歴書を入力する</h3>
                  <p className="text-sm text-muted-foreground">
                    職務経歴書には、具体的な業務内容、使用した技術、達成した成果などを詳しく記載しましょう。
                    情報が多いほど、AIはより適切な文書を生成できます。
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">求人情報を丁寧に入力する</h3>
                  <p className="text-sm text-muted-foreground">
                    求人情報には、求められるスキル、経験、資格だけでなく、企業の特徴や文化、ミッション、ビジョンなども含めると、
                    より説得力のある志望動機が生成されます。
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">複数パターンを生成して比較する</h3>
                  <p className="text-sm text-muted-foreground">
                    複数パターン生成機能を使用して、異なる表現を比較しましょう。
                    AI自動評価スコアを参考にしつつ、自分の言葉で表現したいニュアンスに合ったパターンを選択してください。
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">テンプレートを活用する</h3>
                  <p className="text-sm text-muted-foreground">
                    業界別・職種別テンプレートを使用すると、その分野に特化した表現が生成されます。
                    また、よく使う表現をカスタムテンプレートとして保存しておくと、生成の効率が向上します。
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">生成後に必ず編集する</h3>
                  <p className="text-sm text-muted-foreground">
                    AIが生成した文書は、あくまでベースとして使用し、自分の言葉で編集しましょう。
                    具体的なエピソードや数値を追加すると、より説得力が増します。
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">お気に入り機能を活用する</h3>
                  <p className="text-sm text-muted-foreground">
                    気に入ったパターンはお気に入りに保存しておきましょう。
                    後で見返したり、複数のパターンを比較したりする際に便利です。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  よくある質問
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Q. APIキーは必須ですか？</h3>
                  <p className="text-sm text-muted-foreground">
                    A. はい、AI機能を使用するにはOpenAIまたはGeminiのAPIキーが必要です。
                    どちらか一方のAPIキーがあれば使用できます。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Q. 生成された文書はどこに保存されますか？</h3>
                  <p className="text-sm text-muted-foreground">
                    A. 生成履歴はデータベースに保存されます。お気に入りに保存したパターンは、お気に入りページから確認できます。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Q. 複数の求人に同時に応募できますか？</h3>
                  <p className="text-sm text-muted-foreground">
                    A. 現在は1つの求人に対して最適化する機能のみ提供しています。
                    複数の求人に応募する場合は、それぞれの求人情報を入力して個別に生成してください。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Q. 生成に時間がかかる場合はどうすればいいですか？</h3>
                  <p className="text-sm text-muted-foreground">
                    A. AI生成には通常10〜30秒程度かかります。複数パターン生成の場合はさらに時間がかかることがあります。
                    ネットワーク環境やAI APIの状況によっても変動しますので、しばらくお待ちください。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Q. 生成された文書をそのまま使用しても大丈夫ですか？</h3>
                  <p className="text-sm text-muted-foreground">
                    A. AIが生成した文書は参考として使用し、必ず内容を確認・編集してください。
                    事実と異なる内容が含まれている場合や、自分の言葉で表現したい部分は修正してください。
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* CTAセクション */}
        <div className="text-center mt-12 p-8 bg-primary/5 rounded-lg border">
          <h2 className="text-2xl font-bold mb-4">さあ、始めましょう！</h2>
          <p className="text-muted-foreground mb-6">
            {APP_TITLE}を使って、あなたの転職活動を効率化しましょう。
          </p>
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              ツールを使う
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
