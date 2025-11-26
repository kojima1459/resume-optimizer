import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { ExternalLink, Save, Eye, EyeOff } from "lucide-react";
import Footer from "@/components/Footer";

type ApiProvider = "openai" | "gemini" | "claude";

export default function ApiSettings() {
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

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("APIキーを入力してください");
      return;
    }

    // localStorageに保存
    localStorage.setItem("apiProvider", provider);
    localStorage.setItem("apiKey", apiKey);
    
    toast.success("API設定を保存しました");
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
              職務経歴書最適化ツール
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/">ホームに戻る</a>
            </Button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">API設定</CardTitle>
            <CardDescription>
              使用するAIプロバイダーとAPIキーを設定してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* プロバイダー選択 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">AIプロバイダーを選択</Label>
              <RadioGroup value={provider} onValueChange={(value) => setProvider(value as ApiProvider)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="openai" id="openai" />
                  <Label htmlFor="openai" className="flex-1 cursor-pointer">
                    <div className="font-semibold">OpenAI</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">GPT-4, GPT-3.5など</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="gemini" id="gemini" />
                  <Label htmlFor="gemini" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Google Gemini</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Gemini Pro, Gemini Ultraなど</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <RadioGroupItem value="claude" id="claude" />
                  <Label htmlFor="claude" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Anthropic Claude</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Claude 3 Opus, Claude 3 Sonnetなど</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* APIキー入力 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="apiKey" className="text-base font-semibold">
                  {getProviderName(provider)} APIキー
                </Label>
                <Button
                  variant="link"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400"
                  asChild
                >
                  <a href={getApiKeyLink(provider)} target="_blank" rel="noopener noreferrer">
                    APIキーを取得 <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`${getProviderName(provider)} APIキーを入力してください`}
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
                APIキーはブラウザのlocalStorageに安全に保存されます
              </p>
            </div>

            {/* 保存ボタン */}
            <div className="flex justify-end">
              <Button onClick={handleSave} size="lg" className="gap-2">
                <Save className="h-4 w-4" />
                保存
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ヘルプカード */}
        <Card>
          <CardHeader>
            <CardTitle>APIキーの取得方法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">OpenAI</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    OpenAI Platform
                  </a>
                  にアクセス
                </li>
                <li>「Create new secret key」をクリック</li>
                <li>生成されたAPIキーをコピーして上記に貼り付け</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Google Gemini</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Google AI Studio
                  </a>
                  にアクセス
                </li>
                <li>「Get API key」をクリック</li>
                <li>生成されたAPIキーをコピーして上記に貼り付け</li>
              </ol>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Anthropic Claude</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Anthropic Console
                  </a>
                  にアクセス
                </li>
                <li>「Create Key」をクリック</li>
                <li>生成されたAPIキーをコピーして上記に貼り付け</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>注意:</strong> APIキーは第三者に共有しないでください。APIキーを使用すると、プロバイダーから料金が発生する場合があります。
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
