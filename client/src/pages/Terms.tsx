import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { FileText, AlertCircle, Ban, Shield } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

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
              <Button variant="ghost">{t('terms.nav.home')}</Button>
            </Link>
            <Link href="/guide">
              <Button variant="ghost">{t('terms.nav.guide')}</Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/my-templates">
                  <Button variant="ghost">{t('terms.nav.myTemplates')}</Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="ghost">{t('terms.nav.favorites')}</Button>
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
              {t('terms.title')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t('terms.lastUpdated')}
          </p>
        </div>

        {/* コンテンツ */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 第1条 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('terms.article1.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('terms.article1.content1', { APP_TITLE })}
              </p>
              <p>
                {t('terms.article1.content2')}
              </p>
            </CardContent>
          </Card>

          {/* 第2条 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('terms.article2.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('terms.article2.content1')}
              </p>
              <p>
                {t('terms.article2.content2')}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                {(t('terms.article2.features', { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 第3条 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('terms.article3.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('terms.article3.section1.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article3.section1.content')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('terms.article3.section2.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article3.section2.content')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('terms.article3.section3.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article3.section3.content')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 第4条 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                {t('terms.article4.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('terms.article4.content')}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                {(t('terms.article4.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 第5条 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('terms.article5.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('terms.article5.section1.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article5.section1.content')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('terms.article5.section2.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article5.section2.content')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('terms.article5.section3.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article5.section3.content')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 第6条 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {t('terms.article6.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('terms.article6.section1.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article6.section1.content')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('terms.article6.section2.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article6.section2.content')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('terms.article6.section3.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article6.section3.content')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('terms.article6.section4.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article6.section4.content')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('terms.article6.section5.title')}</h3>
                <p className="text-muted-foreground">
                  {t('terms.article6.section5.content')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 第7条 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('terms.article7.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('terms.article7.content1')}
              </p>
              <p className="text-muted-foreground">
                {t('terms.article7.content2')}
              </p>
            </CardContent>
          </Card>

          {/* 第8条 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('terms.article8.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('terms.article8.content1')}
              </p>
              <p className="text-muted-foreground">
                {t('terms.article8.content2')}
              </p>
            </CardContent>
          </Card>

          {/* 第9条 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('terms.article9.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('terms.article9.content1')}
              </p>
              <p className="text-muted-foreground">
                {t('terms.article9.content2')}
              </p>
            </CardContent>
          </Card>

          {/* 最終更新日 */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p>{t('terms.footer.lastUpdated')}</p>
            <p className="mt-2">{t('terms.footer.copyright', { APP_TITLE })}</p>
          </div>
        </div>

        {/* 戻るボタン */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline" size="lg">
              {t('terms.footer.backToHome')}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
