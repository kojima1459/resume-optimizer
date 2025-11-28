import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { Shield, Lock, Database, Eye, UserCheck, Mail } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function Privacy() {
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
              <Button variant="ghost">{t('privacy.nav.home')}</Button>
            </Link>
            <Link href="/guide">
              <Button variant="ghost">{t('privacy.nav.guide')}</Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/my-templates">
                  <Button variant="ghost">{t('privacy.nav.myTemplates')}</Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="ghost">{t('privacy.nav.favorites')}</Button>
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
              {t('privacy.title')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t('privacy.lastUpdated')}
          </p>
        </div>

        {/* コンテンツ */}
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {t('privacy.intro.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {APP_TITLE}{t('privacy.intro.text1')}
              </p>
              <p>
                {t('privacy.intro.text2')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('privacy.collection.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{t('privacy.collection.account.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.collection.account.description')}
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  {(t('privacy.collection.account.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.collection.inputData.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.collection.inputData.description')}
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  {(t('privacy.collection.inputData.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.collection.generatedData.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.collection.generatedData.description')}
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  {(t('privacy.collection.generatedData.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.collection.apiKey.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.collection.apiKey.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.collection.usageData.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.collection.usageData.description')}
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  {(t('privacy.collection.usageData.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                {t('privacy.usage.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('privacy.usage.description')}
              </p>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.usage.service.title')}</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  {(t('privacy.usage.service.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.usage.improvement.title')}</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  {(t('privacy.usage.improvement.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.usage.support.title')}</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  {(t('privacy.usage.support.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t('privacy.protection.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('privacy.protection.description')}
              </p>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.protection.encryption.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.protection.encryption.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.protection.accessControl.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.protection.accessControl.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.protection.security.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.protection.security.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('privacy.thirdParty.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('privacy.thirdParty.description')}
              </p>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.thirdParty.aiProvider.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.thirdParty.aiProvider.description1')}
                </p>
                <p className="text-muted-foreground mt-2">
                  {t('privacy.thirdParty.aiProvider.description2')}
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>OpenAI: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openai.com/privacy</a></li>
                  <li>Google (Gemini): <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">policies.google.com/privacy</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.thirdParty.legal.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.thirdParty.legal.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.thirdParty.consent.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.thirdParty.consent.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('privacy.retention.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('privacy.retention.description')}
              </p>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.retention.account.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.retention.account.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.retention.generated.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.retention.generated.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.retention.apiKey.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.retention.apiKey.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                {t('privacy.rights.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('privacy.rights.description')}
              </p>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.rights.access.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.rights.access.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.rights.correction.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.rights.correction.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.rights.deletion.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.rights.deletion.description')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('privacy.rights.portability.title')}</h3>
                <p className="text-muted-foreground">
                  {t('privacy.rights.portability.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('privacy.cookies.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {t('privacy.cookies.description')}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                {(t('privacy.cookies.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('privacy.changes.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t('privacy.changes.description')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t('privacy.contact.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t('privacy.contact.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
