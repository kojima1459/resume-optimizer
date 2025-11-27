import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Copy, RefreshCw, Plus, X, History, Download, Upload, Languages, Settings as SettingsIcon, Moon, Sun, Star, Share2, Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { extractTextFromFile } from "@/lib/fileUtils";
import { extractTextFromImage, isImageFile } from "@/lib/ocrUtils";
import { useTheme } from "@/contexts/ThemeContext";
import { exportToWord, exportToPDF, exportToText, exportToMarkdown, downloadBlob } from "@/lib/exportUtils";
import { shareToLinkedIn, ShareStats, generateLinkedInShareText } from "@/lib/linkedinShare";
import { LinkedInShareDialog } from "@/components/LinkedInShareDialog";
import { HistoryDetailDialog } from "@/components/HistoryDetailDialog";
import { useKeyboardShortcuts, getShortcutLabel, KeyboardShortcut } from "@/hooks/useKeyboardShortcuts";
import { useAutoSave } from "@/hooks/useAutoSave";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TemplateSelector } from "@/components/TemplateSelector";
import { FileDropZone } from "@/components/FileDropZone";
import Footer from "@/components/Footer";
import { AnnouncementDialog } from "@/components/AnnouncementDialog";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { EnglishConversionDialog } from "@/components/EnglishConversionDialog";

type OutputItem = {
  key: string;
  label: string;
  charLimit: number;
};

export default function Home() {
  const { t } = useTranslation();
  
  // STANDARD_ITEMSを翻訳対応で動的に生成
  const STANDARD_ITEMS: OutputItem[] = [
    { key: "summary", label: t('home.items.summary'), charLimit: 350 },
    { key: "career_history", label: t('home.items.career_history'), charLimit: 800 },
    { key: "motivation", label: t('home.items.motivation'), charLimit: 400 },
    { key: "self_pr", label: t('home.items.self_pr'), charLimit: 600 },
    { key: "why_company", label: t('home.items.why_company'), charLimit: 400 },
    { key: "what_to_achieve", label: t('home.items.what_to_achieve'), charLimit: 400 },
  ];
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(false);
  const [showApiKeyErrorDialog, setShowApiKeyErrorDialog] = useState(false);

  // APIキー設定状態を確認
  const apiKeyQuery = trpc.apiKey.get.useQuery(undefined, {
    enabled: !!user,
  });
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
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedUserTemplateId, setSelectedUserTemplateId] = useState<number | null>(null);
  const [patternEvaluations, setPatternEvaluations] = useState<Record<number, { score: number; details: any }>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [sortByScore, setSortByScore] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareDialogText, setShareDialogText] = useState("");
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  const [showHistoryDetail, setShowHistoryDetail] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any | null>(null);
  const [historySearchKeyword, setHistorySearchKeyword] = useState("");
  const [historyDateFilter, setHistoryDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showEnglishConversion, setShowEnglishConversion] = useState(false);
  const { scheduleSave, loadData, clearData, lastSaved, isSaving } = useAutoSave();

  const evaluateMutation = trpc.resume.evaluate.useMutation();

  const generateMultipleMutation = trpc.resume.generateMultiple.useMutation({
    onSuccess: async (data) => {
      // サーバー側で評価済みのデータを受け取る
      const patterns = data.patterns.map((item: any) => item.pattern);
      setGeneratedPatterns(patterns);
      setShowPatternDialog(true);
      toast.success(t('toast.generatedSuccess'));
      
      // 評価結果を設定
      const evaluations: Record<number, { score: number; details: any }> = {};
      data.patterns.forEach((item: any, index: number) => {
        if (item.evaluation) {
          evaluations[index] = item.evaluation;
        }
      });
      setPatternEvaluations(evaluations);
      setIsEvaluating(false);
    },
    onError: (error) => {
      toast.error(error.message || t('toast.generatedError'));
    },
  });

  const generateMutation = trpc.resume.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data);
      setEditedContent(data);
      toast.success(t('toast.generatedSuccess'));
    },
    onError: (error) => {
      toast.error(error.message || t('toast.generatedError'));
    },
  });

  const saveFavoriteMutation = trpc.favoritePattern.create.useMutation({
    onSuccess: () => {
      toast.success(t('toast.savedContent'));
    },
    onError: (error) => {
      toast.error(error.message || t('toast.generatedError'));
    },
  });

  const generateWithTemplateMutation = trpc.template.generateWithTemplate.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data);
      setEditedContent(data);
      toast.success(t('toast.generatedSuccess'));
    },
    onError: (error) => {
      toast.error(error.message || t('toast.generatedError'));
    },
  });

  const generateWithUserTemplateMutation = trpc.userTemplate.generateWithUserTemplate.useMutation({
    onSuccess: (data) => {
      setGeneratedContent(data);
      setEditedContent(data);
      toast.success(t('toast.generatedSuccess'));
    },
    onError: (error) => {
      toast.error(error.message || t('toast.generatedError'));
    },
  });

  const regenerateMutation = trpc.resume.regenerate.useMutation({
    onSuccess: (data, variables) => {
      setGeneratedContent((prev) => ({ ...prev, [variables.item]: data.content }));
      setEditedContent((prev) => ({ ...prev, [variables.item]: data.content }));
      toast.success(t('toast.regenerateSuccess'));
    },
    onError: (error) => {
      toast.error(error.message || t('toast.regenerateError'));
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
      toast.success(t('toast.savedAutoSave'));
    } catch (error: any) {
      toast.error(error.message || t('toast.fileUploadError'));
    }
  };

  const deleteHistoryMutation = trpc.resume.history.delete.useMutation({
    onSuccess: () => {
      historyQuery.refetch();
      toast.success(t('common.success'));
    },
    onError: (error) => {
      toast.error(error.message || t('common.error'));
    },
  });

  const translateMutation = trpc.resume.translate.useMutation({
    onSuccess: (data, variables) => {
      setEditedContent((prev) => ({ ...prev, [`${variables.text.substring(0, 10)}_en`]: data.translation }));
      toast.success(t('toast.translateSuccess'));
      setTranslatingItem(null);
    },
    onError: (error) => {
      toast.error(error.message || t('toast.translateError'));
      setTranslatingItem(null);
    },
  });

  const allItems = [...STANDARD_ITEMS, ...customItems];

  const handleGenerate = () => {
    if (!user) {
      toast.error(t('toast.apiKeyRequired'));
      window.location.href = getLoginUrl();
      return;
    }

    // APIキーの確認
    if (!apiKeyQuery.data?.hasOpenAIKey && !apiKeyQuery.data?.hasGeminiKey) {
      setShowApiKeyErrorDialog(true);
      return;
    }

    if (selectedTemplateId) {
      // システムテンプレートを使用して生成
      generateWithTemplateMutation.mutate({
        templateId: selectedTemplateId,
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
    } else if (selectedUserTemplateId) {
      // ユーザーテンプレートを使用して生成
      generateWithUserTemplateMutation.mutate({
        templateId: selectedUserTemplateId,
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
    } else {
      // 通常の生成
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
    }
  };

  const handleGenerateMultiple = () => {
    if (!user) {
      toast.error(t('toast.apiKeyRequired'));
      window.location.href = getLoginUrl();
      return;
    }

    // APIキーの確認
    if (!apiKeyQuery.data?.hasOpenAIKey && !apiKeyQuery.data?.hasGeminiKey) {
      setShowApiKeyErrorDialog(true);
      return;
    }

    setIsEvaluating(true);
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

  const handleSelectTemplate = (templateId: number | null) => {
    setSelectedTemplateId(templateId);
    if (templateId) {
      toast.success("テンプレートを選択しました");
    }
  };

  const handleSaveToFavorites = (patternIndex: number) => {
    const pattern = generatedPatterns[patternIndex];
    const evaluation = patternEvaluations[patternIndex];
    
    if (!pattern) {
      toast.error("パターンが見つかりません");
      return;
    }

    const patternName = prompt("お気に入りパターンの名前を入力してください", `パターン${patternIndex + 1}`);
    
    if (!patternName) {
      return;
    }

    saveFavoriteMutation.mutate({
      name: patternName,
      resumeText,
      jobDescription,
      generatedContent: pattern,
      customItems: customItems.length > 0 ? customItems.map(item => ({
        key: item.key,
        label: item.label,
        charLimit: item.charLimit,
      })) : undefined,
      evaluationScore: evaluation?.score,
      evaluationDetails: evaluation?.details,
    });
  };

  const handleSelectUserTemplate = (templateId: number | null) => {
    setSelectedUserTemplateId(templateId);
    if (templateId) {
      toast.success("マイテンプレートを選択しました");
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
    toast.success(t('toast.copiedItem'));
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
    toast.success(t('toast.copiedAll'));
  };

  const handleAddCustomItem = () => {
    if (!newCustomLabel.trim()) {
      toast.error(t('toast.inputRequired'));
      return;
    }

    const key = `custom_${Date.now()}`;
    const charLimit = parseInt(newCustomCharLimit) || 400;

    setCustomItems([...customItems, { key, label: newCustomLabel, charLimit }]);
    setCharLimits((prev) => ({ ...prev, [key]: charLimit }));
    setSelectedItems((prev) => [...prev, key]);
    setNewCustomLabel("");
    setNewCustomCharLimit("400");
    toast.success(t('toast.customItemAdded'));
  };

  const handleRemoveCustomItem = (key: string) => {
    setCustomItems(customItems.filter((item) => item.key !== key));
    setSelectedItems(selectedItems.filter((k) => k !== key));
    const newCharLimits = { ...charLimits };
    delete newCharLimits[key];
    setCharLimits(newCharLimits);
    toast.success(t('toast.customItemRemoved'));
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

  const toggleFavoriteMutation = trpc.resume.history.toggleFavorite.useMutation({
    onSuccess: (data) => {
      historyQuery.refetch();
      toast.success(data.isFavorite ? "お気に入りに登録しました" : "お気に入りを解除しました");
    },
    onError: (error) => {
      toast.error(error.message || t('common.error'));
    },
  });

  const handleToggleFavorite = (id: number, isFavorite: boolean) => {
    toggleFavoriteMutation.mutate({ id, isFavorite });
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
      toast.success(t('toast.fileUploaded'));
    } catch (error: any) {
      toast.error(error.message || t('toast.fileUploadError'));
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
        toast.success(t('toast.ocrSuccess'));
      } catch (error: any) {
        toast.error(error.message || t('toast.ocrError'));
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
      toast.success(t('toast.fileUploaded'));
    } catch (error: any) {
      toast.error(error.message || t('toast.fileUploadError'));
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
      toast.error(t('toast.noContentToCopy'));
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
      toast.success(t('toast.downloadedWord'));
    } catch (error: any) {
      toast.error(error.message || t('toast.downloadError'));
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
      toast.success(t('toast.downloadedPdf'));
    } catch (error: any) {
      toast.error(error.message || t('toast.downloadError'));
    }
  };

  const handleDownloadText = () => {
    try {
      const itemsToExport = selectedItems
        .map((key) => {
          const item = allItems.find((i) => i.key === key);
          return item ? { key, label: item.label } : null;
        })
        .filter((item): item is { key: string; label: string } => item !== null);

      const blob = exportToText(editedContent, itemsToExport);
      downloadBlob(blob, "職務経歴書.txt");
      toast.success(t('toast.downloadedText'));
    } catch (error: any) {
      toast.error(error.message || t('toast.downloadError'));
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      const itemsToExport = selectedItems
        .map((key) => {
          const item = allItems.find((i) => i.key === key);
          return item ? { key, label: item.label } : null;
        })
        .filter((item): item is { key: string; label: string } => item !== null);

      const blob = exportToMarkdown(editedContent, itemsToExport);
      downloadBlob(blob, "職務経歴書.md");
      toast.success(t('toast.downloadedMarkdown'));
    } catch (error: any) {
      toast.error(error.message || t('toast.downloadError'));
    }
  };

  const handleShareToLinkedIn = () => {
    try {
      const itemsToExport = selectedItems
        .map((key) => {
          const item = allItems.find((i) => i.key === key);
          return item ? item.label : null;
        })
        .filter((label): label is string => label !== null);

      const totalCharCount = selectedItems.reduce((sum, key) => {
        const content = editedContent[key] || generatedContent[key] || '';
        return sum + content.length;
      }, 0);

      const stats: ShareStats = {
        itemCount: selectedItems.length,
        totalCharCount,
        items: itemsToExport,
      };

      const text = generateLinkedInShareText(stats);
      setShareDialogText(text);
      setShowShareDialog(true);
    } catch (error: any) {
      toast.error(error.message || t('toast.shareError'));
    }
  };

  const handleConfirmShare = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        toast.success(t('toast.sharedLinkedIn'));
      }).catch((err) => {
        console.error('Failed to copy text:', err);
      });
    }
    
    // LinkedInを開く
    window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
  };

  // キーボードショートカットの定義
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Enter',
      ctrl: true,
      callback: () => {
        if (!resumeText.trim() || !jobDescription.trim() || selectedItems.length === 0 || generateMutation.isPending) {
          toast.error(t('toast.inputRequired'));
          return;
        }
        handleGenerate();
        toast.success(t('toast.shortcutGenerate'));
      },
      description: '生成開始',
    },
    {
      key: 'C',
      ctrl: true,
      shift: true,
      callback: () => {
        if (Object.keys(generatedContent).length === 0) {
          toast.error(t('toast.noContentToCopy'));
          return;
        }
        handleCopyAll();
        toast.success(t('toast.shortcutCopyAll'));
      },
      description: '全項目をコピー',
    },
    {
      key: '?',
      shift: true,
      callback: () => {
        setShowShortcutHelp(true);
      },
      description: 'ショートカットヘルプを表示',
    },
  ];

  useKeyboardShortcuts(shortcuts);

  // ページ読み込み時に保存データを復元
  useEffect(() => {
    const savedData = loadData();
    if (savedData) {
      const shouldRestore = window.confirm(
        `前回の入力内容が見つかりました。\n最終保存: ${new Date(savedData.timestamp).toLocaleString('ja-JP')}\n\n復元しますか？`
      );
      
      if (shouldRestore) {
        setResumeText(savedData.resumeText);
        setJobDescription(savedData.jobDescription);
        setSelectedItems(savedData.selectedItems);
        setCharLimits(savedData.charLimits);
        setCustomItems(savedData.customItems);
        toast.success(t('toast.savedAutoSave'));
      } else {
        clearData();
      }
    }
  }, []);

  // 入力内容が変更されたら自動保存
  useEffect(() => {
    if (resumeText || jobDescription || selectedItems.length > 0) {
      scheduleSave({
        resumeText,
        jobDescription,
        selectedItems,
        charLimits,
        customItems,
      });
    }
  }, [resumeText, jobDescription, selectedItems, charLimits, customItems]);

  // APIキー未設定時のバナー表示
  useEffect(() => {
    if (user && apiKeyQuery.data && !apiKeyQuery.data.hasOpenAIKey && !apiKeyQuery.data.hasGeminiKey) {
      // localStorageでバナーを一度閉じたかどうかを確認
      const dismissed = localStorage.getItem('apiKeyBannerDismissed');
      if (!dismissed) {
        setShowApiKeyBanner(true);
      }
    }
  }, [user, apiKeyQuery.data]);

  // 初回訪問時のお知らせ表示
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    const announcementDismissed = localStorage.getItem('announcementDismissedForever');
    
    if (!hasVisited && !announcementDismissed) {
      // 初回訪問でお知らせを表示
      setTimeout(() => {
        setShowAnnouncement(true);
      }, 1000); // 1秒後に表示
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

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
            <CardTitle className="text-2xl">{t('home.title')}</CardTitle>
            <p className="text-muted-foreground mt-2">
              {t('home.subtitle')}
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              {t('home.loginRequired')}
            </p>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>{t('home.loginButton')}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6">
        {/* APIキー未設定時のバナー */}
        {showApiKeyBanner && (
          <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <SettingsIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  {t('home.apiKeyNotSet')}
                </h3>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                  {t('home.apiKeyDescription')}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    asChild
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <a href="/api-settings">{t('home.goToApiSettings')}</a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href="/guide">{t('home.viewGuide')}</a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowApiKeyBanner(false);
                      localStorage.setItem('apiKeyBannerDismissed', 'true');
                    }}
                  >
                    {t('home.close')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <FileText className="h-8 w-8 md:h-10 md:w-10 text-primary" />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('home.title')}</h1>
              {lastSaved && (
                <p className="text-xs text-muted-foreground mt-1">
                  {isSaving ? t('header.saving') : t('header.lastSaved', { time: lastSaved.toLocaleTimeString() })}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAnnouncement(true)}
              className="flex-none relative"
              title={t('header.announcements')}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">7</span>
            </Button>
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="flex-none"
              title={t('header.theme')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowShortcutHelp(true)}
              className="flex-none"
              title={t('header.shortcuts')}
            >
              <span className="text-lg font-bold">?</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-none"
            >
              <a href="/guide">
                <FileText className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('header.guide')}</span>
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-none"
            >
              <a href="/favorites">
                <Star className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('header.favorites')}</span>
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/api-settings">
                <SettingsIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('header.apiSettings')}</span>
              </a>
            </Button>
            {lastSaved && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm('保存されたデータをクリアしますか？')) {
                    clearData();
                  }
                }}
                className="flex-none"
                title={t('header.clear')}
              >
                <X className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('header.clear')}</span>
              </Button>
            )}
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <History className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{t('header.history')}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('history.title')}</DialogTitle>
                <DialogDescription>{t('history.description')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 mb-4">
                <Input
                  placeholder={t('history.searchPlaceholder')}
                  value={historySearchKeyword}
                  onChange={(e) => setHistorySearchKeyword(e.target.value)}
                />
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={historyDateFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryDateFilter("all")}
                  >
                    {t('history.all')}
                  </Button>
                  <Button
                    variant={historyDateFilter === "today" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryDateFilter("today")}
                  >
                    {t('history.today')}
                  </Button>
                  <Button
                    variant={historyDateFilter === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryDateFilter("week")}
                  >
                    {t('history.week')}
                  </Button>
                  <Button
                    variant={historyDateFilter === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHistoryDateFilter("month")}
                  >
                    {t('history.month')}
                  </Button>
                  <div className="w-px h-6 bg-border" />
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    {t('history.favoritesOnly')}
                  </Button>
                </div>
              </div>
              {historyQuery.isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : historyQuery.data && historyQuery.data.length > 0 ? (
                <div className="space-y-2">
                  {historyQuery.data
                    .filter((item) => {
                      // 日付フィルター
                      const now = new Date();
                      const itemDate = new Date(item.createdAt);
                      if (historyDateFilter === "today") {
                        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        if (itemDate < today) return false;
                      } else if (historyDateFilter === "week") {
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        if (itemDate < weekAgo) return false;
                      } else if (historyDateFilter === "month") {
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        if (itemDate < monthAgo) return false;
                      }
                      
                      // お気に入りフィルター
                      if (showFavoritesOnly && !(item as any).isFavorite) {
                        return false;
                      }
                      
                      // キーワード検索
                      if (historySearchKeyword) {
                        const keyword = historySearchKeyword.toLowerCase();
                        const resumeMatch = item.resumeTextPreview.toLowerCase().includes(keyword);
                        const jobMatch = item.jobDescriptionPreview.toLowerCase().includes(keyword);
                        if (!resumeMatch && !jobMatch) return false;
                      }
                      
                      return true;
                    })
                    .map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-1">
                            {new Date(item.createdAt).toLocaleString("ja-JP")}
                          </p>
                          <p className="text-sm mb-1">
                            <strong>{t('history.resume')}:</strong> {item.resumeTextPreview}
                          </p>
                          <p className="text-sm">
                            <strong>{t('history.jobInfo')}:</strong> {item.jobDescriptionPreview}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleFavorite(item.id, !(item as any).isFavorite)}
                            title={t('history.favorite')}
                          >
                            <Star className={`h-4 w-4 ${(item as any).isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              const data = await getHistoryMutation.mutateAsync({ id: item.id });
                              setSelectedHistoryItem(data);
                              setShowHistoryDetail(true);
                            }}
                          >
                            {t('history.detail')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoadHistory(item.id)}
                          >
                            {t('history.load')}
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
                <p className="text-center text-muted-foreground py-8">{t('history.noHistory')}</p>
              )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <p className="text-center text-2xl md:text-3xl font-bold text-blue-900 mb-8 px-4">
          求人情報に合わせて、あなたの職務経歴書をAIが最適化するチート便利ツールです！
        </p>

        {/* 機能説明セクション */}
        <Card className="mb-4 md:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {t('home.description')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">
              {t('home.descriptionText')}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-blue-900">📝 {t('home.basicFeatures')}</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>{t('home.features.input')}</li>
                  <li>{t('home.features.selectOutput')}</li>
                  <li>{t('home.features.setCharacters')}</li>
                  <li>{t('home.features.export')}</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-blue-900">✨ {t('home.advancedFeatures')}</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li><strong>{t('home.features.multiplePatterns')}</strong></li>
                  <li><strong>{t('home.features.aiEvaluation')}</strong></li>
                  <li><strong>{t('home.features.favoritePatterns')}</strong></li>
                  <li><strong>{t('home.features.templates')}</strong></li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h4 className="font-semibold text-sm text-blue-900 mb-2">🚀 {t('home.newFeature')}</h4>
              <p className="text-sm text-gray-600">
                {t('home.newFeatureDescription')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4 md:mb-6">
          <CardHeader>
            <CardTitle>{t('home.inputInfo')}</CardTitle>
          </CardHeader>          <CardContent className="space-y-4 md:space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="resume" className="text-base font-semibold">
                  {t('home.resume')}
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
                    {t('home.fileUpload')}
                  </Button>
                </div>
              </div>
              <FileDropZone
                onFileDrop={async (file) => {
                  setIsUploadingResume(true);
                  try {
                    const text = await extractTextFromFile(file);
                    setResumeText(text);
                    toast.success(t('toast.fileDropped'));
                  } catch (error: any) {
                    toast.error(error.message || t('toast.fileUploadError'));
                  } finally {
                    setIsUploadingResume(false);
                  }
                }}
                accept={['.pdf', '.docx', '.txt']}
              >
                <Textarea
                  id="resume"
                  placeholder={t('home.resumePlaceholder')}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[200px]"
                />
              </FileDropZone>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="job" className="text-base font-semibold">
                  {t('home.jobInfo')}
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
                    {t('home.fileUpload')}
                  </Button>
                </div>
              </div>
              {isProcessingOcr && (
                <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700 font-medium">
                      {t('toast.ocrProcessing')}
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
              <FileDropZone
                onFileDrop={async (file) => {
                  if (isImageFile(file)) {
                    setIsProcessingOcr(true);
                    setOcrProgress(0);
                    try {
                      const text = await extractTextFromImage(file, (progress) => {
                        setOcrProgress(progress);
                      });
                      setJobDescription(text);
                      toast.success(t('toast.ocrSuccess'));
                    } catch (error: any) {
                      toast.error(error.message || t('toast.ocrError'));
                    } finally {
                      setIsProcessingOcr(false);
                      setOcrProgress(0);
                    }
                  } else {
                    setIsUploadingJob(true);
                    try {
                      const text = await extractTextFromFile(file);
                      setJobDescription(text);
                      toast.success(t('toast.fileDropped'));
                    } catch (error: any) {
                      toast.error(error.message || t('toast.fileUploadError'));
                    } finally {
                      setIsUploadingJob(false);
                    }
                  }
                }}
                accept={['.pdf', '.docx', '.txt', '.png', '.jpg', '.jpeg']}
              >
                <Textarea
                  id="job"
                  placeholder={t('home.jobInfoPlaceholder')}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px]"
                  disabled={isProcessingOcr}
                />
              </FileDropZone>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">{t('home.templateSection')}</Label>
              <TemplateSelector onSelectTemplate={handleSelectTemplate} onSelectUserTemplate={handleSelectUserTemplate} />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">{t('home.outputSection')}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allItems.map((item) => (
                  <div key={item.key} className="flex items-center space-x-2 p-2.5 border rounded-lg">
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

              <div className="mt-3 p-3 border rounded-lg bg-muted/50">
                <Label className="text-sm font-semibold mb-2 block">{t('home.customItemSection')}</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder={t('home.customItemPlaceholder')}
                    value={newCustomLabel}
                    onChange={(e) => setNewCustomLabel(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder={t('home.characters')}
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
              <Label className="text-base font-semibold mb-3 block">{t('home.characterSettings')}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {allItems
                  .filter((item) => selectedItems.includes(item.key))
                  .map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
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
                className="w-full h-11 text-base"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('home.loading')}
                  </>
                ) : (
                  t('home.generate')
                )}
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Label htmlFor="pattern-count" className="text-sm whitespace-nowrap">
                    {t('home.patternCount')}
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
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('home.loading')}
                    </>
                  ) : (
                    t('home.enableEvaluation')
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.keys(generatedContent).length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle>{t('home.result')}</CardTitle>
                <div className="flex flex-wrap gap-1.5">
                  <Button onClick={handleCopyAll} variant="outline" size="sm" className="text-xs">
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    {t('home.copyAll')}
                  </Button>
                  <Button onClick={handleDownloadWord} variant="outline" size="sm" className="text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    {t('home.downloadWord')}
                  </Button>
                  <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    {t('home.downloadPdf')}
                  </Button>
                  <Button onClick={handleDownloadText} variant="outline" size="sm" className="text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    {t('home.downloadText')}
                  </Button>
                  <Button onClick={handleDownloadMarkdown} variant="outline" size="sm" className="text-xs">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    {t('home.downloadMarkdown')}
                  </Button>
                  <Button onClick={handleShareToLinkedIn} variant="outline" size="sm" className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 text-xs">
                    <Share2 className="h-3.5 w-3.5 mr-1.5" />
                    {t('home.shareLinkedIn')}
                  </Button>
                  <Button onClick={() => setShowEnglishConversion(true)} variant="outline" size="sm" className="bg-green-600 text-white hover:bg-green-700 text-xs">
                    <Languages className="h-3.5 w-3.5 mr-1.5" />
                    {t('home.convertToEnglish')}
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
                          {t('home.copy')}
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
                          {t('home.translate')}
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
                          {t('home.regenerate')}
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
            <DialogTitle>{t('patterns.title')}</DialogTitle>
            <DialogDescription>
              {t('patterns.description', { count: generatedPatterns.length })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="sort-by-score"
                checked={sortByScore}
                onCheckedChange={(checked) => setSortByScore(checked as boolean)}
              />
              <Label htmlFor="sort-by-score" className="cursor-pointer">
                {t('patterns.sortByScore')}
              </Label>
            </div>
            {isEvaluating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('patterns.evaluating')}
              </div>
            )}
          </div>
          <div className="space-y-4 mt-4">
            {(sortByScore
              ? generatedPatterns
                  .map((pattern, index) => ({ pattern, index }))
                  .sort((a, b) => {
                    const scoreA = patternEvaluations[a.index]?.score || 0;
                    const scoreB = patternEvaluations[b.index]?.score || 0;
                    return scoreB - scoreA;
                  })
              : generatedPatterns.map((pattern, index) => ({ pattern, index }))
            ).map(({ pattern, index }) => (
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {t('patterns.pattern', { number: index + 1 })}
                      {selectedPatternIndex === index && (
                        <span className="ml-2 text-sm text-blue-600 font-normal">
                          ({t('patterns.selected')})
                        </span>
                      )}
                    </CardTitle>
                    {patternEvaluations[index] && (
                      <div className="flex flex-col items-end">
                        <div className="text-2xl font-bold text-blue-600">
                          {patternEvaluations[index].score}点
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t('patterns.aiScore')}
                        </div>
                      </div>
                    )}
                  </div>
                  {patternEvaluations[index]?.details && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('patterns.relevance')}:</span>
                        <span className="font-semibold">{patternEvaluations[index].details.relevance}点</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('patterns.clarity')}:</span>
                        <span className="font-semibold">{patternEvaluations[index].details.clarity}点</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('patterns.impact')}:</span>
                        <span className="font-semibold">{patternEvaluations[index].details.impact}点</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('patterns.completeness')}:</span>
                        <span className="font-semibold">{patternEvaluations[index].details.completeness}点</span>
                      </div>
                    </div>
                  )}
                  {patternEvaluations[index]?.details?.feedback && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{t('patterns.feedback')}:</p>
                      <p className="text-sm text-gray-700">{patternEvaluations[index].details.feedback}</p>
                    </div>
                  )}
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
                <div className="px-6 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveToFavorites(index);
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {t('patterns.saveToFavorites')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <LinkedInShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        defaultText={shareDialogText}
        onShare={handleConfirmShare}
      />
      <HistoryDetailDialog
        open={showHistoryDetail}
        onOpenChange={setShowHistoryDetail}
        historyItem={selectedHistoryItem}
        onUseContent={(content) => {
          setGeneratedContent(content);
          setEditedContent(content);
        }}
        onRegenerate={(resumeText, jobDescription, selectedItems) => {
          setResumeText(resumeText);
          setJobDescription(jobDescription);
          setSelectedItems(selectedItems);
          handleGenerate();
        }}
        allItems={allItems}
      />
      
      {/* ショートカットヘルプダイアログ */}
      <Dialog open={showShortcutHelp} onOpenChange={setShowShortcutHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('shortcuts.title')}</DialogTitle>
            <DialogDescription>
              {t('shortcuts.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{shortcut.description}</span>
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                  {getShortcutLabel(shortcut)}
                </kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* APIキー未入力エラーダイアログ */}
      <Dialog open={showApiKeyErrorDialog} onOpenChange={setShowApiKeyErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <SettingsIcon className="h-5 w-5" />
              {t('apiKeyError.title')}
            </DialogTitle>
            <DialogDescription>
              {t('apiKeyError.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100 mb-3">
                {t('apiKeyError.message')}
              </p>
              <ol className="text-sm text-amber-800 dark:text-amber-200 space-y-2 list-decimal list-inside">
                <li>{t('apiKeyError.step1')}</li>
                <li>{t('apiKeyError.step2')}</li>
                <li>{t('apiKeyError.step3')}</li>
              </ol>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                <strong>{t('apiKeyError.helpTitle')}</strong>
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('apiKeyError.helpMessage')}
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowApiKeyErrorDialog(false)}
              >
                {t('home.cancel')}
              </Button>
              <Button
                variant="outline"
                asChild
              >
                <a href="/guide" target="_blank">{t('home.viewGuide')}</a>
              </Button>
              <Button
                asChild
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <a href="/api-settings">{t('home.goToApiSettings')}</a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* お知らせダイアログ */}
      <AnnouncementDialog
        open={showAnnouncement}
        onOpenChange={setShowAnnouncement}
        onDismissForever={() => {
          localStorage.setItem('announcementDismissedForever', 'true');
        }}
      />

      {/* 英語変換ダイアログ */}
      <EnglishConversionDialog
        open={showEnglishConversion}
        onOpenChange={setShowEnglishConversion}
        content={editedContent}
      />
      
      <Footer />
    </div>
  );
}
