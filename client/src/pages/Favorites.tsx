import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Star, Trash2, Edit, FileText, ArrowLeft, Copy } from "lucide-react";
import { DiffHighlight } from "@/components/DiffHighlight";
import { calculateDifferenceRate } from "@/lib/diffUtils";
import { getLoginUrl } from "@/const";

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);

  const favoritesQuery = trpc.favoritePattern.list.useQuery(undefined, {
    enabled: !!user,
  });

  const patternQuery = trpc.favoritePattern.get.useQuery(
    { id: selectedPattern! },
    { enabled: !!selectedPattern }
  );

  const deleteMutation = trpc.favoritePattern.delete.useMutation({
    onSuccess: () => {
      toast.success("お気に入りパターンを削除しました");
      favoritesQuery.refetch();
      setSelectedPattern(null);
    },
    onError: (error) => {
      toast.error(error.message || "削除に失敗しました");
    },
  });

  const updateMutation = trpc.favoritePattern.update.useMutation({
    onSuccess: () => {
      toast.success("お気に入りパターンを更新しました");
      favoritesQuery.refetch();
      patternQuery.refetch();
      setShowEditDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || "更新に失敗しました");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("このお気に入りパターンを削除しますか？")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleEdit = () => {
    if (!patternQuery.data) return;
    setEditName(patternQuery.data.name);
    setEditNotes(patternQuery.data.notes || "");
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedPattern) return;
    updateMutation.mutate({
      id: selectedPattern,
      name: editName,
      notes: editNotes,
    });
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("コピーしました");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="container max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>ログインが必要です</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                ご利用にはManusアカウントでのログインが必要です
              </p>
              <Button asChild className="w-full">
                <a href={getLoginUrl()}>ログインして開始</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 md:py-8 px-4">
      <div className="container max-w-7xl">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Button variant="ghost" size="icon" asChild>
            <a href="/">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <div className="flex items-center gap-2">
            <Star className="h-8 w-8 md:h-10 md:w-10 text-yellow-500" />
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">お気に入りパターン</h1>
          </div>
        </div>

        {favoritesQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : favoritesQuery.data && favoritesQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左側: パターン一覧 */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant={compareMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCompareMode(!compareMode);
                    setSelectedForCompare([]);
                  }}
                >
                  {compareMode ? "比較モード終了" : "比較モード"}
                </Button>
                {compareMode && selectedForCompare.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {selectedForCompare.length}件選択中
                  </span>
                )}
              </div>
              {favoritesQuery.data.map((pattern) => (
                <Card
                  key={pattern.id}
                  className={`cursor-pointer transition-all ${
                    compareMode && selectedForCompare.includes(pattern.id)
                      ? "border-green-500 border-2 bg-green-50"
                      : selectedPattern === pattern.id
                      ? "border-blue-500 border-2 bg-blue-50"
                      : "hover:border-gray-400"
                  }`}
                  onClick={() => {
                    if (compareMode) {
                      if (selectedForCompare.includes(pattern.id)) {
                        setSelectedForCompare(selectedForCompare.filter(id => id !== pattern.id));
                      } else {
                        setSelectedForCompare([...selectedForCompare, pattern.id]);
                      }
                    } else {
                      setSelectedPattern(pattern.id);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{pattern.name}</h3>
                        {pattern.evaluationScore && (
                          <div className="text-sm text-blue-600 font-semibold">
                            評価スコア: {pattern.evaluationScore}点
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(pattern.createdAt).toLocaleString("ja-JP")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(pattern.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 右側: パターン詳細 */}
            <div className="lg:col-span-2">
              {compareMode && selectedForCompare.length > 0 ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>パターン比較 ({selectedForCompare.length}件)</CardTitle>
                    </CardHeader>
                  </Card>
                  <div className="space-y-6">
                    {/* 各項目ごとに比較 */}
                    {selectedForCompare.length > 0 && (() => {
                      const patterns = selectedForCompare
                        .map(id => favoritesQuery.data?.find(p => p.id === id))
                        .filter(Boolean);
                      
                      if (patterns.length === 0) return null;
                      
                      // 全パターンから共通の項目を取得
                      const allKeys = new Set<string>();
                      patterns.forEach(pattern => {
                        if (pattern?.generatedContent) {
                          Object.keys(pattern.generatedContent).forEach(key => allKeys.add(key));
                        }
                      });
                      
                      return Array.from(allKeys).map(key => {
                        const contents = patterns.map(p => p?.generatedContent?.[key] || '');
                        const hasContent = contents.some(c => c);
                        
                        if (!hasContent) return null;
                        
                        return (
                          <Card key={key}>
                            <CardHeader>
                              <CardTitle className="text-lg">{key}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {patterns.map((pattern, index) => {
                                  if (!pattern) return null;
                                  const content = pattern.generatedContent?.[key] || '';
                                  const otherContents = contents.filter((_, i) => i !== index);
                                  const avgDiffRate = otherContents.length > 0
                                    ? Math.round(
                                        otherContents.reduce((sum, other) => 
                                          sum + calculateDifferenceRate(content, other), 0
                                        ) / otherContents.length
                                      )
                                    : 0;
                                  
                                  return (
                                    <div key={pattern.id} className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm">{pattern.name}</h4>
                                        {avgDiffRate > 0 && (
                                          <span className="text-xs text-muted-foreground">
                                            差異率: {avgDiffRate}%
                                          </span>
                                        )}
                                      </div>
                                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border text-sm">
                                        {otherContents.length > 0 ? (
                                          <DiffHighlight
                                            text1={content}
                                            text2={otherContents[0]}
                                            index={0}
                                          />
                                        ) : (
                                          <div className="whitespace-pre-wrap">{content}</div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : selectedPattern && patternQuery.data ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{patternQuery.data.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleEdit}>
                          <Edit className="h-4 w-4 mr-2" />
                          編集
                        </Button>
                      </div>
                    </div>
                    {patternQuery.data.evaluationScore && (
                      <div className="mt-2 flex items-center gap-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {patternQuery.data.evaluationScore}点
                        </div>
                        {patternQuery.data.evaluationDetails && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>関連性: {patternQuery.data.evaluationDetails.relevance}点</div>
                            <div>明確性: {patternQuery.data.evaluationDetails.clarity}点</div>
                            <div>インパクト: {patternQuery.data.evaluationDetails.impact}点</div>
                            <div>完全性: {patternQuery.data.evaluationDetails.completeness}点</div>
                          </div>
                        )}
                      </div>
                    )}
                    {patternQuery.data.notes && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-semibold mb-1">メモ:</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{patternQuery.data.notes}</p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(patternQuery.data.generatedContent).map(([key, value]) => (
                      <div key={key} className="p-4 bg-white border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{key}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyContent(value as string)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{value as string}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-muted-foreground">
                      左側からパターンを選択してください
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Star className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-muted-foreground mb-4">
                お気に入りパターンがまだありません
              </p>
              <Button asChild>
                <a href="/">パターンを生成する</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 編集ダイアログ */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>お気に入りパターンを編集</DialogTitle>
              <DialogDescription>パターン名とメモを編集できます</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">パターン名</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="パターン名を入力"
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">メモ</Label>
                <Textarea
                  id="edit-notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="メモを入力"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  保存
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
