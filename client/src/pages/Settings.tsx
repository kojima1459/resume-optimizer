import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Loader2, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const [openAIKey, setOpenAIKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [primaryProvider, setPrimaryProvider] = useState("gemini");

  // APIキー取得
  const { data: apiKeyData, isLoading: apiKeyLoading, refetch: refetchApiKey } = trpc.apiKey.get.useQuery();

  // APIキー保存
  const saveApiKeyMutation = trpc.apiKey.save.useMutation({
    onSuccess: () => {
      toast.success("APIキーを保存しました");
      setOpenAIKey("");
      setGeminiKey("");
      refetchApiKey();
    },
    onError: (error) => {
      toast.error(`APIキーの保存に失敗しました: ${error.message}`);
    },
  });

  // APIキー削除
  const deleteApiKeyMutation = trpc.apiKey.delete.useMutation({
    onSuccess: () => {
      toast.success("APIキーを削除しました");
      refetchApiKey();
    },
    onError: (error) => {
      toast.error(`APIキーの削除に失敗しました: ${error.message}`);
    },
  });

  const handleSaveApiKey = () => {
    if (!openAIKey && !geminiKey) {
      toast.error("少なくとも1つのAPIキーを入力してください");
      return;
    }

    saveApiKeyMutation.mutate({
      openAIKey: openAIKey || undefined,
      geminiKey: geminiKey || undefined,
      primaryProvider,
    });
  };

  const handleDeleteApiKey = () => {
    if (confirm("本当にAPIキーを削除しますか？")) {
      deleteApiKeyMutation.mutate();
    }
  };

  if (authLoading || apiKeyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>ログインが必要です</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost">← ホームに戻る</Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">設定</h1>
          <div className="w-24"></div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>APIキー設定</CardTitle>
            <CardDescription>
              OpenAI APIキーまたはGemini APIキーを設定してください。
              APIキーは暗号化してデータベースに保存されます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(apiKeyData?.hasOpenAIKey || apiKeyData?.hasGeminiKey) && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-900">APIキーが設定されています</p>
                    {apiKeyData.hasOpenAIKey && (
                      <p className="text-sm text-green-700 mt-1">
                        OpenAI: {apiKeyData.maskedOpenAIKey}
                      </p>
                    )}
                    {apiKeyData.hasGeminiKey && (
                      <p className="text-sm text-green-700 mt-1">
                        Gemini: {apiKeyData.maskedGeminiKey}
                      </p>
                    )}
                    <p className="text-sm text-green-700">
                      メインプロバイダー: {apiKeyData.primaryProvider}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteApiKey}
                    disabled={deleteApiKeyMutation.isPending}
                  >
                    {deleteApiKeyMutation.isPending ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        削除
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="openai-key">OpenAI APIキー（オプション）</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  OpenAI APIキーは<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">こちら</a>から取得できます
                </p>
              </div>

              <div>
                <Label htmlFor="gemini-key">Gemini APIキー（オプション）</Label>
                <Input
                  id="gemini-key"
                  type="password"
                  placeholder="AI..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Gemini APIキーは<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">こちら</a>から取得できます
                </p>
              </div>

              <div>
                <Label htmlFor="primary-provider">メインプロバイダー</Label>
                <Select value={primaryProvider} onValueChange={setPrimaryProvider}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="メインプロバイダーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  職務経歴書生成に使用するメインのAIプロバイダーを選択してください
                </p>
              </div>

              <Button
                onClick={handleSaveApiKey}
                disabled={saveApiKeyMutation.isPending}
                className="w-full"
              >
                {saveApiKeyMutation.isPending ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                保存
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
