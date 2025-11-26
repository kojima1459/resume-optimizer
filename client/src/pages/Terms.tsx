import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { FileText, AlertCircle, Ban, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
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
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              利用規約
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
                <FileText className="h-5 w-5" />
                第1条（適用）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本利用規約（以下「本規約」といいます）は、{APP_TITLE}（以下「本サービス」といいます）の利用条件を定めるものです。
                本サービスを利用するすべてのユーザー（以下「ユーザー」といいます）は、本規約に同意したものとみなされます。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                第2条（サービスの内容）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本サービスは、AI技術を活用して職務経歴書の作成を支援するWebアプリケーションです。
                主な機能は以下の通りです。
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>職務経歴書の自動生成</li>
                <li>求人情報に基づく最適化</li>
                <li>複数パターンの生成</li>
                <li>生成履歴の保存・管理</li>
                <li>テンプレートの作成・管理</li>
                <li>お気に入りパターンの保存</li>
                <li>各種フォーマットでのエクスポート（Word、PDF、テキスト、Markdown）</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                第3条（アカウント）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. アカウント登録</h3>
                <p className="text-muted-foreground">
                  本サービスを利用するには、Manus OAuthを使用してログインする必要があります。
                  ログインすることで、アカウントが自動的に作成されます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. アカウント管理</h3>
                <p className="text-muted-foreground">
                  ユーザーは、自己の責任においてアカウント情報を管理するものとします。
                  アカウント情報の不正使用により生じた損害について、当サービスは一切の責任を負いません。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. APIキーの管理</h3>
                <p className="text-muted-foreground">
                  本サービスでは、OpenAI、Gemini、またはClaudeのAPIキーを設定する必要があります。
                  APIキーの管理はユーザーの責任において行うものとし、APIキーの不正使用により生じた損害について、当サービスは一切の責任を負いません。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                第4条（禁止事項）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>他のユーザーまたは第三者の権利を侵害する行為</li>
                <li>虚偽の情報を登録する行為</li>
                <li>本サービスのセキュリティを脅かす行為</li>
                <li>本サービスを商業目的で利用する行為（個人の転職活動を除く）</li>
                <li>本サービスのコンテンツを無断で複製、転載、配布する行為</li>
                <li>リバースエンジニアリング、逆コンパイル、逆アセンブルする行為</li>
                <li>その他、当サービスが不適切と判断する行為</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                第5条（知的財産権）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. サービスの知的財産権</h3>
                <p className="text-muted-foreground">
                  本サービスに関する知的財産権は、すべて当サービスまたは当サービスにライセンスを許諾している者に帰属します。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. 生成コンテンツの権利</h3>
                <p className="text-muted-foreground">
                  本サービスを使用して生成された職務経歴書などのコンテンツの権利は、ユーザーに帰属します。
                  ユーザーは、生成されたコンテンツを自由に使用、編集、配布することができます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. 入力データの使用</h3>
                <p className="text-muted-foreground">
                  ユーザーが入力したデータは、本サービスの提供および改善のために使用されます。
                  ただし、個人を特定できる情報を第三者に開示することはありません。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                第6条（免責事項）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. サービスの品質</h3>
                <p className="text-muted-foreground">
                  当サービスは、本サービスの品質、正確性、完全性、有用性について、いかなる保証も行いません。
                  AI技術を使用しているため、生成される内容が必ずしも正確であるとは限りません。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. 利用結果</h3>
                <p className="text-muted-foreground">
                  本サービスを使用して生成された職務経歴書を使用した結果について、当サービスは一切の責任を負いません。
                  ユーザーは、生成された内容を必ず確認し、必要に応じて修正してから使用してください。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. サービスの中断・停止</h3>
                <p className="text-muted-foreground">
                  当サービスは、事前の通知なく本サービスの全部または一部を変更、中断、停止することがあります。
                  これにより生じた損害について、当サービスは一切の責任を負いません。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. データの損失</h3>
                <p className="text-muted-foreground">
                  システム障害、メンテナンス、その他の理由により、ユーザーのデータが失われる可能性があります。
                  当サービスは、データの損失について一切の責任を負いません。
                  重要なデータは、必ずバックアップを取ってください。
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">5. 外部サービス</h3>
                <p className="text-muted-foreground">
                  本サービスは、OpenAI、Gemini、Claudeなどの外部AIサービスを使用しています。
                  これらの外部サービスの品質、可用性、セキュリティについて、当サービスは一切の責任を負いません。
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                第7条（サービスの変更・終了）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                当サービスは、ユーザーへの事前の通知なく、本サービスの内容を変更、追加、削除することができます。
                また、当サービスは、本サービスの提供を終了することができます。
              </p>
              <p className="text-muted-foreground">
                サービス終了の際は、可能な限り事前に通知するよう努めますが、緊急の場合はこの限りではありません。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                第8条（利用規約の変更）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                当サービスは、必要に応じて本規約を変更することができます。
                変更後の利用規約は、本ページに掲載した時点で効力を生じるものとします。
              </p>
              <p className="text-muted-foreground">
                重要な変更がある場合は、本サービス内で通知します。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                第9条（準拠法・管轄裁判所）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                本規約の解釈にあたっては、日本法を準拠法とします。
              </p>
              <p className="text-muted-foreground">
                本サービスに関して紛争が生じた場合には、当サービスの所在地を管轄する裁判所を専属的合意管轄とします。
              </p>
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
