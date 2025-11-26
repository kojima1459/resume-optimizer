import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { Shield, Lock, Database, Eye, UserCheck, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
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
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              プライバシーポリシー
            </h1>
          </div>
          <p className="text-muted-foreground">
            最終更新日: 2025年1月26日
          </p>
        </div>

        {/* コンテンツ */}
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                はじめに
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {APP_TITLE}（以下「本サービス」といいます）は、ユーザーの皆様のプライバシーを尊重し、個人情報の保護に努めています。
                本プライバシーポリシーは、本サービスがどのような情報を収集し、どのように使用・保護するかを説明するものです。
              </p>
              <p>
                本サービスを利用することにより、本プライバシーポリシーに同意したものとみなされます。
                本プライバシーポリシーに同意できない場合は、本サービスの利用をお控えください。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                収集する情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. アカウント情報</h3>
                <p className="text-muted-foreground">
                  本サービスでは、Manus OAuth認証を使用してログインします。
                  ログイン時に、Manusアカウントから以下の情報を取得します。
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>ユーザーID（OpenID）</li>
                  <li>ユーザー名</li>
                  <li>メールアドレス</li>
                  <li>ログイン方法</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. 入力データ</h3>
                <p className="text-muted-foreground">
                  本サービスの機能を使用する際に、以下の情報を入力していただきます。
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>職務経歴書の内容</li>
                  <li>求人情報</li>
                  <li>カスタム項目の内容</li>
                  <li>アップロードされたファイル（PDF、Word、画像）</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. 生成データ</h3>
                <p className="text-muted-foreground">
                  AIによって生成された以下のデータを保存します。
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>職務要約、志望動機、自己PRなどの生成された文書</li>
                  <li>生成履歴</li>
                  <li>お気に入りに保存されたパターン</li>
                  <li>カスタムテンプレート</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. APIキー</h3>
                <p className="text-muted-foreground">
                  本サービスでは、OpenAIまたはGeminiのAPIキーを設定していただきます。
                  APIキーは暗号化してデータベースに保存され、AI機能の実行時にのみ使用されます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5. 利用状況データ</h3>
                <p className="text-muted-foreground">
                  本サービスの改善のため、以下の利用状況データを収集する場合があります。
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>アクセス日時</li>
                  <li>使用した機能</li>
                  <li>エラーログ</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                情報の使用目的
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                収集した情報は、以下の目的で使用します。
              </p>

              <div>
                <h3 className="font-semibold mb-2">1. サービスの提供</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>AI機能による文書生成</li>
                  <li>生成履歴の保存・管理</li>
                  <li>テンプレートの保存・管理</li>
                  <li>お気に入りパターンの保存・管理</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. サービスの改善</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>利用状況の分析</li>
                  <li>エラーの検出と修正</li>
                  <li>新機能の開発</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. ユーザーサポート</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>問い合わせへの対応</li>
                  <li>技術的なサポート</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                情報の保護
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本サービスは、ユーザーの個人情報を保護するため、以下の対策を講じています。
              </p>

              <div>
                <h3 className="font-semibold mb-2">1. データの暗号化</h3>
                <p className="text-muted-foreground">
                  APIキーなどの機密情報は暗号化してデータベースに保存します。
                  通信はHTTPSで暗号化されます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. アクセス制限</h3>
                <p className="text-muted-foreground">
                  ユーザーの個人情報には、本人のみがアクセスできます。
                  他のユーザーや第三者がアクセスすることはできません。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. セキュリティ対策</h3>
                <p className="text-muted-foreground">
                  不正アクセス、改ざん、漏洩を防ぐため、適切なセキュリティ対策を実施しています。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                第三者への情報提供
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。
              </p>

              <div>
                <h3 className="font-semibold mb-2">1. AI APIプロバイダー</h3>
                <p className="text-muted-foreground">
                  本サービスでは、OpenAIまたはGeminiのAI APIを使用して文書を生成します。
                  入力された職務経歴書や求人情報は、AI APIプロバイダーに送信されます。
                </p>
                <p className="text-muted-foreground mt-2">
                  各プロバイダーのプライバシーポリシーをご確認ください。
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>OpenAI: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openai.com/privacy</a></li>
                  <li>Google (Gemini): <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/privacy</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. 法的要請</h3>
                <p className="text-muted-foreground">
                  法令に基づく開示要請があった場合、または裁判所の命令がある場合は、個人情報を開示することがあります。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. ユーザーの同意</h3>
                <p className="text-muted-foreground">
                  ユーザーの同意がある場合は、個人情報を第三者に提供することがあります。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                データの保存期間
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本サービスは、以下の期間、ユーザーのデータを保存します。
              </p>

              <div>
                <h3 className="font-semibold mb-2">1. アカウント情報</h3>
                <p className="text-muted-foreground">
                  アカウントが削除されるまで保存します。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. 生成データ</h3>
                <p className="text-muted-foreground">
                  ユーザーが削除するまで保存します。
                  アカウント削除時に、すべての生成データも削除されます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. APIキー</h3>
                <p className="text-muted-foreground">
                  ユーザーが削除するまで保存します。
                  アカウント削除時に、APIキーも削除されます。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                ユーザーの権利
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ユーザーは、自分の個人情報に関して以下の権利を有します。
              </p>

              <div>
                <h3 className="font-semibold mb-2">1. アクセス権</h3>
                <p className="text-muted-foreground">
                  自分の個人情報にアクセスし、確認する権利。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. 訂正権</h3>
                <p className="text-muted-foreground">
                  自分の個人情報が不正確または不完全な場合、訂正を求める権利。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. 削除権</h3>
                <p className="text-muted-foreground">
                  自分の個人情報の削除を求める権利。
                  生成データ、テンプレート、お気に入りパターンは、ユーザー自身で削除できます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. データポータビリティ権</h3>
                <p className="text-muted-foreground">
                  自分の個人情報を機械可読形式で受け取る権利。
                  エクスポート機能を使用して、生成データをダウンロードできます。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cookieの使用
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本サービスでは、ログイン状態を維持するためにCookieを使用します。
                Cookieには、セッションIDが含まれており、ユーザーを識別するために使用されます。
              </p>
              <p className="text-muted-foreground">
                Cookieを無効にすると、本サービスの一部機能が正常に動作しない場合があります。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Google AdSenseについて
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本サービスでは、広告配信のためにGoogle AdSenseを使用しています。
                Google AdSenseは、Cookieを使用してユーザーの興味・関心に基づいた広告を表示します。
              </p>

              <div>
                <h3 className="font-semibold mb-2">収集される情報</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>サイト訪問履歴</li>
                  <li>広告のクリック履歴</li>
                  <li>IPアドレス</li>
                  <li>デバイス情報</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">広告のパーソナライズを無効にする方法</h3>
                <p className="text-muted-foreground">
                  Google AdSenseによる広告配信を無効にする場合は、
                  <a
                    href="https://support.google.com/ads/answer/2662856"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Googleの広告設定ページ
                  </a>
                  で設定できます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Googleのプライバシーポリシー</h3>
                <p className="text-muted-foreground">
                  Google AdSenseのプライバシーポリシーについては、
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Googleプライバシーポリシー
                  </a>
                  をご確認ください。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                プライバシーポリシーの変更
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
                変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じるものとします。
              </p>
              <p className="text-muted-foreground">
                重要な変更がある場合は、本サービス内で通知します。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                お問い合わせ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本プライバシーポリシーに関するご質問やご不明な点がございましたら、以下の方法でお問い合わせください。
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold mb-2">{APP_TITLE} サポート</p>
                <p className="text-sm text-muted-foreground">
                  お問い合わせは、本サービス内のサポート機能をご利用ください。
                </p>
              </div>
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
