import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ExternalLink, Save, Eye, EyeOff } from "lucide-react";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";

type ApiProvider = "openai" | "gemini" | "claude";

export default function ApiSettings() {
  const { t } = useTranslation();
  const [provider, setProvider] = useState<ApiProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    // localStorageから設定を読み込み
    const savedProvider = localStorage.getItem("apiProvider") as ApiProvider;
    const savedApiKey = localStorage.getItem("apiKey");
    
    if (savedProvider) setProvider(savedProvider);
    if (savedApiKey) setApiKey(savedApiKey);
  }, []);

  const saveApiKeyMutation = trpc.apiKey.save.useMutation();

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error(t('apiSettings.toastEnterApiKey'));
      return;
    }

    try {
      const input: Record<string, string> = {
        primaryProvider: provider,
      };

      if (provider === "openai") {
        input.openAIKey = apiKey;
      } else if (provider === "gemini") {
        input.geminiKey = apiKey;
      }

      await saveApiKeyMutation.mutateAsync(input);

      localStorage.setItem("apiProvider", provider);
      localStorage.setItem("apiKey", apiKey);
      
      toast.success(t('apiSettings.toast.saved'));
    } catch (error) {
      console.error("Failed to save API key:", error);
      toast.error("Failed to save API key");
    }
  };

  const getApiKeyLink = (provider: ApiProvider) => {
    const links = {
      openai: "https://platform.openai.com/api-keys",
      gemini: "https://aistudio.google.com/app/apikey",
      claude: "https://console.anthropic.com/settings/keys"
    };
    return links[provider];
  };

  const getProviderName = (provider: ApiProvider) => {
    const names = {
      openai: "OpenAI",
      gemini: "Google Gemini",
      claude: "Anthropic Claude"
    };
    return names[provider];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {t('apiSettings.header.title')}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/">{t('apiSettings.header.backHome')}</a>
            </Button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{t('apiSettings.title')}</CardTitle>
            <CardDescription>
              {t('apiSettings.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* プロバイダー選択 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('apiSettings.selectProviderLabel')}</Label>
              <RadioGroup value={provider} onValueChange={(value) => setProvider(value as ApiProvider)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="openai" id="openai" />
                  <Label htmlFor="openai" className="flex-1 cursor-pointer">
                    <div className="font-semibold">{t('apiSettings.openai')}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('apiSettings.openaiDescription')}</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="gemini" id="gemini" />
                  <Label htmlFor="gemini" className="flex-1 cursor-pointer">
                    <div className="font-semibold">{t('apiSettings.gemini')}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('apiSettings.geminiDescription')}</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="claude" id="claude" />
                  <Label htmlFor="claude" className="flex-1 cursor-pointer">
                    <div className="font-semibold">{t('apiSettings.claude')}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('apiSettings.claudeDescription')}</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* APIキー入力 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiKey" className="text-base font-semibold">
                  {t('apiSettings.apiKeyLabel', { provider: getProviderName(provider) })}
                </Label>
                <Button
                  variant="link"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400"
                  asChild
                >
                  <a href={getApiKeyLink(provider)} target="_blank" rel="noopener noreferrer">
                    {t('apiSettings.getApiKey')} <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={t('apiSettings.apiKeyPlaceholderFull', { provider: getProviderName(provider) })}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('apiSettings.apiKeyStorage')}
              </p>
            </div>

            {/* 保存ボタン */}
            <div className="flex justify-end">
              <Button onClick={handleSave} size="lg" className="gap-2">
                <Save className="h-4 w-4" />
                {t('apiSettings.save')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ヘルプカード */}
        <Card>
          <CardHeader>
            <CardTitle>{t('apiSettings.howToGetTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{t('apiSettings.openai')}</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    OpenAI Platform
                  </a>
                  {t('apiSettings.openaiSteps.step1')}
                </li>
                <li>{t('apiSettings.openaiSteps.step2')}</li>
                <li>{t('apiSettings.openaiSteps.step3')}</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">{t('apiSettings.gemini')}</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Google AI Studio
                  </a>
                  {t('apiSettings.geminiSteps.step1')}
                </li>
                <li>{t('apiSettings.geminiSteps.step2')}</li>
                <li>{t('apiSettings.geminiSteps.step3')}</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">{t('apiSettings.claude')}</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Anthropic Console
                  </a>
                  {t('apiSettings.claudeSteps.step1')}
                </li>
                <li>{t('apiSettings.claudeSteps.step2')}</li>
                <li>{t('apiSettings.claudeSteps.step3')}</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>{t('apiSettings.warning').split(':')[0]}:</strong> {t('apiSettings.warning').split(':')[1]}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
