import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

interface EnglishConversionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: Record<string, string>;
}

export function EnglishConversionDialog({
  open,
  onOpenChange,
  content,
}: EnglishConversionDialogProps) {
  const [targetWordCount, setTargetWordCount] = useState("");
  const [englishContent, setEnglishContent] = useState<Record<string, string> | null>(null);

  const convertMutation = trpc.resume.convertToEnglish.useMutation({
    onSuccess: (data) => {
      setEnglishContent(data.englishContent);
      toast.success("英語に変換しました");
    },
    onError: (error) => {
      toast.error(error.message || "英語変換に失敗しました");
    },
  });

  const handleConvert = () => {
    const wordCount = targetWordCount ? parseInt(targetWordCount, 10) : undefined;
    convertMutation.mutate({
      content,
      targetWordCount: wordCount,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("コピーしました");
  };

  const handleCopyAll = () => {
    const allText = Object.entries(englishContent || {})
      .map(([key, value]) => `${key}:\n${value}`)
      .join("\n\n");
    navigator.clipboard.writeText(allText);
    toast.success("全てコピーしました");
  };

  const handleDownload = () => {
    const allText = Object.entries(englishContent || {})
      .map(([key, value]) => `${key}:\n${value}`)
      .join("\n\n");
    const blob = new Blob([allText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_english.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("ダウンロードしました");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>スマート英語変換</DialogTitle>
          <DialogDescription>
            生成された職務経歴書を英語に変換します。文字数を指定することもできます。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!englishContent ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="wordCount">目標単語数（オプション）</Label>
                <Input
                  id="wordCount"
                  type="number"
                  placeholder="例: 300"
                  value={targetWordCount}
                  onChange={(e) => setTargetWordCount(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  指定しない場合は、原文の長さに応じて自動調整されます。
                </p>
              </div>

              <Button
                onClick={handleConvert}
                disabled={convertMutation.isPending}
                className="w-full"
              >
                {convertMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    変換中...
                  </>
                ) : (
                  "英語に変換"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <Button onClick={handleCopyAll} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  全てコピー
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  ダウンロード
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">日本語（原文）</h3>
                  <div className="space-y-4">
                    {Object.entries(content).map(([key, value]) => (
                      <div key={key} className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm mb-2">{key}</h4>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                          <Streamdown>{value}</Streamdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">English (Converted)</h3>
                  <div className="space-y-4">
                    {Object.entries(englishContent).map(([key, value]) => (
                      <div key={key} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{key}</h4>
                          <Button
                            onClick={() => handleCopy(value)}
                            variant="ghost"
                            size="sm"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                          <Streamdown>{value}</Streamdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setEnglishContent(null);
                  setTargetWordCount("");
                }}
                variant="outline"
                className="w-full"
              >
                再変換
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
