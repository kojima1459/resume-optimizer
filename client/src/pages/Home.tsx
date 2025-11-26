import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Copy, RefreshCw, Plus, X, History, Download, Upload, Languages } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { extractTextFromFile } from "@/lib/fileUtils";
import { extractTextFromImage, isImageFile } from "@/lib/ocrUtils";
import { exportToWord, exportToPDF, downloadBlob } from "@/lib/exportUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type OutputItem = {
  key: string;
  label: string;
  charLimit: number;
};

const STANDARD_ITEMS: OutputItem[] = [
  { key: "summary", label: "職務要約", charLimit: 350 },
  { key: "career_history", label: "職務経歴", charLimit: 800 },
  { key: "motivation", label: "志望動機", charLimit: 400 },
  { key: "self_pr", label: "自己PR", charLimit: 600 },
  { key: "why_company", label: "なぜ御社か", charLimit: 400 },
  { key: "what_to_achieve", label: "企業で実現したいこと", charLimit: 400 },
];

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([
    "summary",
    "motivation",
    "self_pr",
    "why_company",
  ]);
  const [charLimits, setCharLimits] = useState<Record<string, number>>(
    Object.fromEntries(STANDARD_ITEMS.map((item) => [item.key, item.charLimit]))
  );
  const [customItems, setCustomItems] = useState<OutputItem[]>([]);
  const [newCustomLabel, setNewCustomLabel] = useState("");
  const [newCustomCharLimit, setNewCustomCharLimit] = useState("400");
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingJob, setIsUploadingJob] = useState(false);
  const [translatingItem, setTranslatingItem] = useState<string | null>(null);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [patternCount, setPatternCount] = useState(3);
  const [generatedPatterns, setGeneratedPatterns] = useState<Record<string, string>[]>([]);
  const [selectedPatternIndex, setSelectedPatternIndex] = useState<number | null>(null);
  const [showPatternDialog, setShowPatternDialog] = useState(false);

  const generateMultipleMutation = trpc.resume.generateMultiple.useMutation({
    onSuccess: (data) => {
      setGeneratedPatterns(data.patterns);
      setShowPatternDialog(true);
      toast.success(`${data.patternCount}個のパターンを生成しました`);
    },
    onError: (error) => {
      toast.error(error.message || "生成に失敗しました");
    },
  });

  const generateMutation = trpc.resume.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data);
      setEditedContent(data);
      toast.success("生成が完了しました");
    },
    onError: (error) => {
      toast.error(error.message || "生成に失敗しました");
    },
  });

  const regenerateMutation = trpc.resume.regenerate.useMutation({
    onSuccess: (data, variables) => {
      setGeneratedContent((prev) => ({ ...prev, [variables.item]: data.content }));
      setEditedContent((prev) => ({ ...prev, [variables.item]: data.content }));
      toast.success("再生成が完了しました");
    },
    onError: (error) => {
      toast.error(error.message || "再生成に失敗しました");
    },
  });

  const historyQuery = trpc.resume.history.list.useQuery(undefined, {
    enabled: !!user && showHistory,
  });

  const getHistoryMutation = trpc.resume.history.get.useMutation();

  const handleLoadHistoryInternal = async (id: number) => {
    try {
      const data = await getHistoryMutation.mutateAsync({ id });
      setResumeText(data.resumeText);
      setJobDescription(data.jobDescription);
      setGeneratedContent(data.generatedContent);
      setEditedContent(data.generatedContent);
      if (data.customItems) {
        setCustomItems(data.customItems);
      }
      setShowHistory(false);
      toast.success("履歴を読み込みました");
    } catch (error: any) {
      toast.error(error.message || "履歴の読み込みに失敗しました");
    }
  };

  const deleteHistoryMutation = trpc.resume.history.delete.useMutation({
    onSuccess: () => {
      historyQuery.refetch();
      toast.success("履歴を削除しました");
    },
    onError: (error) => {
      toast.error(error.message || "削除に失敗しました");
    },
  });

  const translateMutation = trpc.resume.translate.useMutation({
    onSuccess: (data, variables) => {
      setEditedContent((prev) => ({ ...prev, [`${variables.text.substring(0, 10)}_en`]: data.translation }));
      toast.success("翻訳が完了しました");
      setTranslatingItem(null);
    },
    onError: (error) => {
      toast.error(error.message || "翻訳に失敗しました");
      setTranslatingItem(null);
    },
  });

  const allItems = [...STANDARD_ITEMS, ...customItems];

  const handleGenerate = () => {
    if (!user) {
      toast.error("ログインが必要です");
      window.location.href = getLoginUrl();
      return;
    }

    generateMutation.mutate({
      resumeText,
      jobDescription,
      outputItems: selectedItems,
      charLimits,
      customItems: customItems.map((item) => ({
        key: item.key,
        label: item.label,
        charLimit: item.charLimit,
      })),
      saveHistory: true,
    });
  };

  const handleGenerateMultiple = () => {
    if (!user) {
      toast.error("ログインが必要です");
      window.location.href = getLoginUrl();
      return;
    }

    generateMultipleMutation.mutate({
      resumeText,
      jobDescription,
      outputItems: selectedItems,
      charLimits,
      customItems: customItems.map((item) => ({
        key: item.key,
        label: item.label,
        charLimit: item.charLimit,
      })),
      patternCount,
    });
  };

  const handleSelectPattern = (index: number) => {
    const selectedPattern = generatedPatterns[index];
    if (selectedPattern) {
      setGeneratedContent(selectedPattern);
      setEditedContent(selectedPattern);
      setSelectedPatternIndex(index);
      setShowPatternDialog(false);
      toast.success(`パターン${index + 1}を選択しました`);
    }
  };

  const handleRegenerate = (itemKey: string) => {
    const item = allItems.find((i) => i.key === itemKey);
    if (!item) return;

    regenerateMutation.mutate({
      item: itemKey,
      resumeText,
      jobDescription,
      charLimit: charLimits[itemKey],
      previousContent: generatedContent[itemKey],
      itemLabel: item.label,
    });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("コピーしました");
  };

  const handleCopyAll = () => {
    const allContent = selectedItems
      .map((key) => {
        const item = allItems.find((i) => i.key === key);
        const content = editedContent[key] || "";
        return `【${item?.label}】\n${content}`;
      })
      .join("\n\n");

    navigator.clipboard.writeText(allContent);
    toast.success("全項目をコピーしました");
  };

  const handleAddCustomItem = () => {
    if (!newCustomLabel.trim()) {
      toast.error("項目名を入力してください");
      return;
    }

    const key = `custom_${Date.now()}`;
    const charLimit = parseInt(newCustomCharLimit) || 400;

    setCustomItems([...customItems, { key, label: newCustomLabel, charLimit }]);
    setCharLimits((prev) => ({ ...prev, [key]: charLimit }));
    setSelectedItems((prev) => [...prev, key]);
    setNewCustomLabel("");
    setNewCustomCharLimit("400");
    toast.success("カスタム項目を追加しました");
  };

  const handleRemoveCustomItem = (key: string) => {
    setCustomItems(customItems.filter((item) => item.key !== key));
    setSelectedItems(selectedItems.filter((k) => k !== key));
    const newCharLimits = { ...charLimits };
    delete newCharLimits[key];
    setCharLimits(newCharLimits);
    toast.success("カスタム項目を削除しました");
  };

  const handleToggleItem = (key: string) => {
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleLoadHistory = (id: number) => {
    handleLoadHistoryInternal(id);
  };

  const handleDeleteHistory = (id: number) => {
    if (confirm("この履歴を削除してもよろしいですか？")) {
      deleteHistoryMutation.mutate({ id });
    }
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      toast.success("ファイルを読み込みました");
    } catch (error: any) {
      toast.error(error.message || "ファイルの読み込みに失敗しました");
    } finally {
      setIsUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleJobFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 画像ファイルの場合はOCR処理
    if (isImageFile(file)) {
      setIsProcessingOcr(true);
      setOcrProgress(0);
      try {
        const text = await extractTextFromImage(file, (progress) => {
          setOcrProgress(progress);
        });
        setJobDescription(text);
        toast.success("画像からテキストを抽出しました");
      } catch (error: any) {
        toast.error(error.message || "OCR処理に失敗しました");
      } finally {
        setIsProcessingOcr(false);
        setOcrProgress(0);
        e.target.value = "";
      }
      return;
    }

    // PDF/Wordファイルの場合
    setIsUploadingJob(true);
    try {
      const text = await extractTextFromFile(file);
      setJobDescription(text);
      toast.success("ファイルを読み込みました");
    } catch (error: any) {
      toast.error(error.message || "ファイルの読み込みに失敗しました");
    } finally {
      setIsUploadingJob(false);
      e.target.value = "";
    }
  };

  const handleTranslate = (itemKey: string) => {
    const item = allItems.find((i) => i.key === itemKey);
    if (!item) return;

    const text = editedContent[itemKey] || generatedContent[itemKey];
    if (!text) {
      toast.error("翻訳するテキストがありません");
      return;
    }

    setTranslatingItem(itemKey);
    translateMutation.mutate({
      text,
      itemLabel: item.label,
    });
  };

  const handleDownloadWord = async () => {
    try {
      const itemsToExport = selectedItems
        .map((key) => {
          const item = allItems.find((i) => i.key === key);
          return item ? { key, label: item.label } : null;
        })
        .filter((item): item is { key: string; label: string } => item !== null);

      const blob = await exportToWord(editedContent, itemsToExport);
      downloadBlob(blob, "職務経歴書.docx");
      toast.success("Wordファイルをダウンロードしました");
    } catch (error: any) {
      toast.error(error.message || "ダウンロードに失敗しました");
    }
  };

  const handleDownloadPDF = () => {
    try {
      const itemsToExport = selectedItems
        .map((key) => {
          const item = allItems.find((i) => i.key === key);
          return item ? { key, label: item.label } : null;
        })
        .filter((item): item is { key: string; label: string } => item !== null);

      const doc = exportToPDF(editedContent, itemsToExport);
      doc.save("職務経歴書.pdf");
      toast.success("PDFファイルをダウンロードしました");
    } catch (error: any) {
      toast.error(error.message || "ダウンロードに失敗しました");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl">職務経歴書最適化ツール</CardTitle>
            <p className="text-muted-foreground mt-2">
              求人情報に合わせて、あなたの職務経歴書を最適化します
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              ご利用にはManusアカウントでのログインが必要です
            </p>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>ログインして開始</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">職務経歴書最適化ツール</h1>
          </div>
          <Dialog open={showHistory} onOpenChange={setShowHistory}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <History className="h-4 w-4 mr-2" />
                履歴
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>生成履歴</DialogTitle>
                <DialogDescription>過去に生成した職務経歴書の履歴</DialogDescription>
              </DialogHeader>
              {historyQuery.isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : historyQuery.data && historyQuery.data.length > 0 ? (
                <div className="space-y-2">
                  {historyQuery.data.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">
                            {new Date(item.createdAt).toLocaleString("ja-JP")}
                          </p>
                          <p className="text-sm mb-1">
                            <strong>職務経歴書:</strong> {item.resumeTextPreview}
                          </p>
                          <p className="text-sm">
                            <strong>求人情報:</strong> {item.jobDescriptionPreview}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoadHistory(item.id)}
                          >
                            読込
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteHistory(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">履歴がありません</p>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-center text-gray-600 mb-8">
          求人情報に合わせて、あなたの職務経歴書を最適化します
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>入力情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="resume" className="text-base font-semibold">
                  1. 職務経歴書
                </Label>
                <div>
                  <input
                    type="file"
                    id="resume-file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleResumeFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("resume-file")?.click()}
                    disabled={isUploadingResume}
                  >
                    {isUploadingResume ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    ファイルアップロード
                  </Button>
                </div>
              </div>
              <Textarea
                id="resume"
                placeholder="あなたの職務経歴書をここに貼り付けてください。またはPDF/Wordファイルをアップロードできます..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="job" className="text-base font-semibold">
                  2. 求人情報
                </Label>
                <div>
                  <input
                    type="file"
                    id="job-file"
                    accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                    onChange={handleJobFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("job-file")?.click()}
                    disabled={isUploadingJob || isProcessingOcr}
                  >
                    {isUploadingJob || isProcessingOcr ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    ファイルアップロード
                  </Button>
                </div>
              </div>
              {isProcessingOcr && (
                <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700 font-medium">
                      画像からテキストを抽出中...
                    </span>
                    <span className="text-sm text-blue-700 font-medium">
                      {Math.round(ocrProgress * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <Textarea
                id="job"
                placeholder="応募する求人情報をここに貼り付けてください。またはPDF/Wordファイル、画像ファイルをアップロードできます..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
                disabled={isProcessingOcr}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">3. 出力項目を選択</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allItems.map((item) => (
                  <div key={item.key} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={item.key}
                      checked={selectedItems.includes(item.key)}
                      onCheckedChange={() => handleToggleItem(item.key)}
                    />
                    <Label htmlFor={item.key} className="flex-1 cursor-pointer">
                      {item.label}
                    </Label>
                    {customItems.some((ci) => ci.key === item.key) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveCustomItem(item.key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <Label className="text-sm font-semibold mb-2 block">カスタム項目を追加</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="項目名（例：なぜ今転職するのか）"
                    value={newCustomLabel}
                    onChange={(e) => setNewCustomLabel(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="文字数"
                    value={newCustomCharLimit}
                    onChange={(e) => setNewCustomCharLimit(e.target.value)}
                    className="w-24"
                  />
                  <Button onClick={handleAddCustomItem} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">4. 文字数設定</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allItems
                  .filter((item) => selectedItems.includes(item.key))
                  .map((item) => (
                    <div key={item.key} className="flex items-center gap-3">
                      <Label className="flex-1">{item.label}</Label>
                      <Input
                        type="number"
                        value={charLimits[item.key] || item.charLimit}
                        onChange={(e) =>
                          setCharLimits((prev) => ({
                            ...prev,
                            [item.key]: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">文字</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGenerate}
                disabled={
                  !resumeText.trim() ||
                  !jobDescription.trim() ||
                  selectedItems.length === 0 ||
                  generateMutation.isPending
                }
                className="w-full h-12 text-lg"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    生成中...
                  </>
                ) : (
                  "生成開始"
                )}
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Label htmlFor="pattern-count" className="text-sm whitespace-nowrap">
                    パターン数:
                  </Label>
                  <Input
                    id="pattern-count"
                    type="number"
                    min="2"
                    max="5"
                    value={patternCount}
                    onChange={(e) => setPatternCount(parseInt(e.target.value) || 3)}
                    className="w-20"
                  />
                </div>
                <Button
                  onClick={handleGenerateMultiple}
                  disabled={
                    !resumeText.trim() ||
                    !jobDescription.trim() ||
                    selectedItems.length === 0 ||
                    generateMultipleMutation.isPending
                  }
                  variant="outline"
                  className="flex-1"
                >
                  {generateMultipleMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      複数生成中...
                    </>
                  ) : (
                    "複数パターン生成"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.keys(generatedContent).length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>生成結果</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleCopyAll} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    全項目をコピー
                  </Button>
                  <Button onClick={handleDownloadWord} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Word
                  </Button>
                  <Button onClick={handleDownloadPDF} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedItems.map((key) => {
                const item = allItems.find((i) => i.key === key);
                if (!item || !generatedContent[key]) return null;

                return (
                  <div key={key} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.label}</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(editedContent[key] || generatedContent[key])}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          コピー
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTranslate(key)}
                          disabled={translatingItem === key}
                        >
                          <Languages
                            className={`h-4 w-4 mr-1 ${
                              translatingItem === key ? "animate-spin" : ""
                            }`}
                          />
                          英語
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRegenerate(key)}
                          disabled={regenerateMutation.isPending}
                        >
                          <RefreshCw
                            className={`h-4 w-4 mr-1 ${
                              regenerateMutation.isPending ? "animate-spin" : ""
                            }`}
                          />
                          再生成
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={editedContent[key] || generatedContent[key]}
                      onChange={(e) =>
                        setEditedContent((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="min-h-[150px] font-normal"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {(editedContent[key] || generatedContent[key]).length} / {charLimits[key]}{" "}
                      文字
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 複数パターン選択ダイアログ */}
      <Dialog open={showPatternDialog} onOpenChange={setShowPatternDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>生成されたパターンから選択してください</DialogTitle>
            <DialogDescription>
              {generatedPatterns.length}個の異なる表現パターンを生成しました。最適なものを選択してください。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {generatedPatterns.map((pattern, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  selectedPatternIndex === index
                    ? "border-blue-500 border-2 bg-blue-50"
                    : "hover:border-gray-400"
                }`}
                onClick={() => handleSelectPattern(index)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    パターン {index + 1}
                    {selectedPatternIndex === index && (
                      <span className="ml-2 text-sm text-blue-600 font-normal">
                        (選択中)
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedItems.map((key) => {
                    const item = allItems.find((i) => i.key === key);
                    if (!item || !pattern[key]) return null;

                    return (
                      <div key={key} className="p-3 bg-white border rounded">
                        <h4 className="font-semibold text-sm mb-2">{item.label}</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {pattern[key]}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
