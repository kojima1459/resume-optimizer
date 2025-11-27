import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_TITLE } from "@/const";
import Footer from "@/components/Footer";
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
import { useTranslation } from "react-i18next";

export default function Guide() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
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
              <Button variant="ghost">{t('guide.header.home')}</Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/my-templates">
                  <Button variant="ghost">{t('guide.header.myTemplates')}</Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="ghost">{t('guide.header.favorites')}</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container py-12 flex-1">
        {/* タイトルセクション */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('guide.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('guide.subtitle', { title: APP_TITLE })}
          </p>
        </div>

        {/* タブコンテンツ */}
        <Tabs defaultValue="overview" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">{t('guide.tabs.overview')}</TabsTrigger>
            <TabsTrigger value="features">{t('guide.tabs.features')}</TabsTrigger>
            <TabsTrigger value="tutorial">{t('guide.tabs.tutorial')}</TabsTrigger>
            <TabsTrigger value="tips">{t('guide.tabs.tips')}</TabsTrigger>
          </TabsList>

          {/* 概要タブ */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t('guide.overview.what.title', { title: APP_TITLE })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  {t('guide.overview.what.description', { title: APP_TITLE })}
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 border rounded-lg">
                    <Zap className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-semibold mb-2">{t('guide.overview.fast.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('guide.overview.fast.description')}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Target className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-semibold mb-2">{t('guide.overview.optimized.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('guide.overview.optimized.description')}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Sparkles className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-semibold mb-2">{t('guide.overview.multiple.title')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('guide.overview.multiple.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('guide.overview.recommended.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t('guide.overview.recommended.1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t('guide.overview.recommended.2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t('guide.overview.recommended.3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{t('guide.overview.recommended.4')}</span>
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
                  {t('guide.features.basic.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    {t('guide.features.basic.1.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.features.basic.1.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    {t('guide.features.basic.2.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.features.basic.2.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    {t('guide.features.basic.3.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.features.basic.3.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                    {t('guide.features.basic.4.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.features.basic.4.description')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {t('guide.features.advanced.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    {t('guide.features.advanced.1.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.features.advanced.1.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    {t('guide.features.advanced.2.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.features.advanced.2.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    {t('guide.features.advanced.3.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.features.advanced.3.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                    {t('guide.features.advanced.4.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.features.advanced.4.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                    {t('guide.features.advanced.5.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.features.advanced.5.description')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t('guide.features.api.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>{t('guide.features.api.description')}</p>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold mb-2">{t('guide.features.api.openai.title')}</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>{t('guide.features.api.openai.step1')}</li>
                      <li>{t('guide.features.api.openai.step2')}</li>
                      <li>{t('guide.features.api.openai.step3')}</li>
                      <li>{t('guide.features.api.openai.step4')}</li>
                    </ol>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      {t('guide.features.api.openai.note')}
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold mb-2">{t('guide.features.api.gemini.title')}</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>{t('guide.features.api.gemini.step1')}</li>
                      <li>{t('guide.features.api.gemini.step2')}</li>
                      <li>{t('guide.features.api.gemini.step3')}</li>
                      <li>{t('guide.features.api.gemini.step4')}</li>
                    </ol>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold mb-2">{t('guide.features.api.claude.title')}</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                      <li>{t('guide.features.api.claude.step1')}</li>
                      <li>{t('guide.features.api.claude.step2')}</li>
                      <li>{t('guide.features.api.claude.step3')}</li>
                      <li>{t('guide.features.api.claude.step4')}</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    {t('guide.features.api.important.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>{t('guide.features.api.important.1')}</li>
                    <li>{t('guide.features.api.important.2')}</li>
                    <li>{t('guide.features.api.important.3')}</li>
                    <li>{t('guide.features.api.important.4')}</li>
                  </ul>
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
                  {t('guide.tutorial.basic.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                    {t('guide.tutorial.basic.step1.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.tutorial.basic.step1.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    {t('guide.tutorial.basic.step2.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.tutorial.basic.step2.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                    {t('guide.tutorial.basic.step3.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.tutorial.basic.step3.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                    {t('guide.tutorial.basic.step4.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.tutorial.basic.step4.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                    {t('guide.tutorial.basic.step5.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.tutorial.basic.step5.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                    {t('guide.tutorial.basic.step6.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.tutorial.basic.step6.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
                    {t('guide.tutorial.basic.step7.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.tutorial.basic.step7.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">8</span>
                    {t('guide.tutorial.basic.step8.title')}
                  </h3>
                  <p className="text-muted-foreground ml-8">
                    {t('guide.tutorial.basic.step8.description')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {t('guide.tutorial.advanced.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tutorial.advanced.template.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tutorial.advanced.template.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tutorial.advanced.multiple.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tutorial.advanced.multiple.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tutorial.advanced.favorite.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tutorial.advanced.favorite.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tutorial.advanced.english.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tutorial.advanced.english.description')}
                  </p>
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
                  {t('guide.tips.notes.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.notes.1.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.notes.1.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.notes.2.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.notes.2.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.notes.3.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.notes.3.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.notes.4.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.notes.4.description')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  {t('guide.tips.effective.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.effective.1.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.effective.1.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.effective.2.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.effective.2.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.effective.3.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.effective.3.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.effective.4.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.effective.4.description')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.effective.5.title')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.effective.5.description')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t('guide.tips.faq.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.faq.1.question')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.faq.1.answer')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.faq.2.question')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.faq.2.answer')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.faq.3.question')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.faq.3.answer')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.faq.4.question')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.faq.4.answer')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('guide.tips.faq.5.question')}</h3>
                  <p className="text-muted-foreground">
                    {t('guide.tips.faq.5.answer')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
