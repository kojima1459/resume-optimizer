import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { DollarSign, CheckCircle, AlertCircle, ExternalLink, FileText } from "lucide-react";
import { Link } from "wouter";

export default function AdSenseGuide() {
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
            <Link href="/guide">
              <Button variant="ghost">ガイド</Button>
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Google AdSense 申請ガイド
            </h1>
          </div>
          <p className="text-muted-foreground">
            本サービスでGoogle AdSenseを利用するための完全ガイド
          </p>
        </div>

        {/* コンテンツ */}
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Google AdSenseとは？
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Google AdSenseは、Googleが提供する広告配信サービスです。
                Webサイトに広告を掲載することで、広告収入を得ることができます。
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>💡 ポイント:</strong> AdSenseは完全無料で利用でき、Googleが自動的に最適な広告を選んで表示してくれます。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                申請の流れ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  AdSenseアカウントの作成
                </h3>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                  <li>
                    <a
                      href="https://www.google.com/adsense/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Google AdSense公式サイト
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    にアクセス
                  </li>
                  <li>「ご利用開始」ボタンをクリック</li>
                  <li>Googleアカウントでログイン（持っていない場合は作成）</li>
                  <li>サイトのURL（本サービスのURL）を入力</li>
                  <li>メールアドレスを入力</li>
                  <li>利用規約に同意して「アカウントを作成」</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  お支払い情報の入力
                </h3>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                  <li>AdSenseアカウントにログイン</li>
                  <li>「お支払い」→「お支払い情報」をクリック</li>
                  <li>住所、電話番号などの情報を入力</li>
                  <li>銀行口座情報を入力（収益の振込先）</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  サイトの審査
                </h3>
                <p className="text-muted-foreground mb-2">
                  Googleがあなたのサイトを審査します。審査には通常1〜2週間かかります。
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-3">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>⚠️ 注意:</strong> 審査中は広告が表示されません。審査に通過するまで待ちましょう。
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                  広告コードの取得
                </h3>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                  <li>審査に通過したら、AdSenseアカウントにログイン</li>
                  <li>「広告」→「サマリー」→「広告ユニットごと」をクリック</li>
                  <li>「ディスプレイ広告」を選択</li>
                  <li>広告ユニット名を入力（例: 「メインコンテンツ下部」）</li>
                  <li>広告サイズを選択（「レスポンシブ」推奨）</li>
                  <li>「作成」をクリック</li>
                  <li>表示された広告コードをコピー</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                  広告コードの設定
                </h3>
                <p className="text-muted-foreground mb-2">
                  取得した広告コードから、以下の2つの情報を抽出します：
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                  <p className="text-muted-foreground mb-2">広告コード例:</p>
                  <code className="text-xs">
                    {`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"></script>
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="YYYYYYYYYY"
     data-ad-format="auto"></ins>`}
                  </code>
                </div>
                <p className="text-muted-foreground mt-3">
                  この中から以下を抽出：
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mt-2">
                  <li><strong>クライアントID</strong>: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">ca-pub-XXXXXXXXXX</code></li>
                  <li><strong>スロットID</strong>: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">YYYYYYYYYY</code></li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  これらの情報を、本サービスの管理者（あなた）に連絡してください。
                  管理者が環境変数に設定すると、広告が表示されるようになります。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                審査に通過するためのポイント
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Google AdSenseの審査に通過するには、以下のポイントを押さえましょう。
              </p>

              <div>
                <h3 className="font-semibold mb-2">1. オリジナルコンテンツ</h3>
                <p className="text-muted-foreground">
                  他のサイトからコピーしたコンテンツではなく、オリジナルのコンテンツが必要です。
                  本サービスは、ユーザーが入力した情報を基にAIが生成するため、オリジナルコンテンツとみなされます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. 十分なコンテンツ量</h3>
                <p className="text-muted-foreground">
                  サイトに十分なコンテンツがあることが重要です。
                  少なくとも10〜15ページ程度のコンテンツがあることが望ましいです。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. プライバシーポリシー</h3>
                <p className="text-muted-foreground">
                  プライバシーポリシーページが必須です。本サービスには既にプライバシーポリシーページがあります。
                </p>
                <Link href="/privacy">
                  <Button variant="outline" size="sm" className="mt-2">
                    <FileText className="h-4 w-4 mr-2" />
                    プライバシーポリシーを確認
                  </Button>
                </Link>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. 利用規約</h3>
                <p className="text-muted-foreground">
                  利用規約ページも推奨されます。本サービスには既に利用規約ページがあります。
                </p>
                <Link href="/terms">
                  <Button variant="outline" size="sm" className="mt-2">
                    <FileText className="h-4 w-4 mr-2" />
                    利用規約を確認
                  </Button>
                </Link>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5. ナビゲーション</h3>
                <p className="text-muted-foreground">
                  サイト内を簡単に移動できるナビゲーションが必要です。
                  本サービスには、ヘッダーとフッターにナビゲーションリンクがあります。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">6. モバイル対応</h3>
                <p className="text-muted-foreground">
                  スマートフォンでも正常に表示されることが重要です。
                  本サービスは完全にレスポンシブ対応しています。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">7. 一定のアクセス数</h3>
                <p className="text-muted-foreground">
                  明確な基準はありませんが、一定のアクセス数があることが望ましいです。
                  SNSでシェアしたり、SEO対策を行ってアクセス数を増やしましょう。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                よくある質問
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Q1. AdSenseの審査にはどのくらい時間がかかりますか？</h3>
                <p className="text-muted-foreground">
                  通常1〜2週間程度です。場合によっては数日で通過することもあれば、1ヶ月以上かかることもあります。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Q2. 審査に落ちた場合はどうすればいいですか？</h3>
                <p className="text-muted-foreground">
                  Googleから送られてくるメールに、不承認の理由が記載されています。
                  その理由を確認し、サイトを改善してから再申請しましょう。
                  再申請は何度でも可能です。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Q3. どのくらいの収益が見込めますか？</h3>
                <p className="text-muted-foreground">
                  収益は、サイトのアクセス数、広告のクリック率、広告単価によって大きく異なります。
                  一般的に、1,000PV（ページビュー）あたり100〜500円程度が目安です。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Q4. 広告の配置場所は自由に決められますか？</h3>
                <p className="text-muted-foreground">
                  はい、広告コードを取得後、管理者に希望の配置場所を伝えることができます。
                  ただし、Googleのポリシーに違反しない範囲で配置する必要があります。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Q5. AdSense以外の広告サービスも使えますか？</h3>
                <p className="text-muted-foreground">
                  はい、AdSenseと併用できる広告サービスもあります。
                  ただし、Googleのポリシーに違反しないよう注意が必要です。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                参考リンク
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="https://www.google.com/adsense/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Google AdSense 公式サイト
              </a>
              <a
                href="https://support.google.com/adsense/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                AdSense ヘルプセンター
              </a>
              <a
                href="https://support.google.com/adsense/answer/9724"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                AdSense プログラムポリシー
              </a>
            </CardContent>
          </Card>

          {/* 最終更新日 */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>最終更新日: 2025年1月26日</p>
            <p className="mt-2">© 2025 {APP_TITLE}. All rights reserved.</p>
          </div>
        </div>

        {/* 戻るボタン */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" size="lg">
              ホームに戻る
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
