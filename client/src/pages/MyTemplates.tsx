import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit, Trash2, FileText, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function MyTemplates() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    promptTemplate: "",
  });

  const templatesQuery = trpc.userTemplate.list.useQuery(undefined, {
    enabled: !!user,
  });

  const createMutation = trpc.userTemplate.create.useMutation({
    onSuccess: () => {
      toast.success(t('myTemplates.toast.created'));
      setShowCreateDialog(false);
      setFormData({ name: "", description: "", promptTemplate: "" });
      templatesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || t('myTemplates.toast.error'));
    },
  });

  const updateMutation = trpc.userTemplate.update.useMutation({
    onSuccess: () => {
      toast.success(t('myTemplates.toast.updated'));
      setShowEditDialog(false);
      setEditingTemplate(null);
      setFormData({ name: "", description: "", promptTemplate: "" });
      templatesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || t('myTemplates.toast.error'));
    },
  });

  const deleteMutation = trpc.userTemplate.delete.useMutation({
    onSuccess: () => {
      toast.success(t('myTemplates.toast.deleted'));
      templatesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || t('myTemplates.toast.error'));
    },
  });

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.promptTemplate.trim()) {
      toast.error("全ての項目を入力してください");
      return;
    }

    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      promptTemplate: formData.promptTemplate,
    });
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      promptTemplate: template.promptTemplate,
    });
    setShowEditDialog(true);
  };

  const handleUpdate = () => {
    if (!editingTemplate) return;

    if (!formData.name.trim() || !formData.description.trim() || !formData.promptTemplate.trim()) {
      toast.error("全ての項目を入力してください");
      return;
    }

    updateMutation.mutate({
      id: editingTemplate.id,
      name: formData.name,
      description: formData.description,
      promptTemplate: formData.promptTemplate,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("このテンプレートを削除してもよろしいですか？")) {
      deleteMutation.mutate({ id });
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
          <CardHeader>
            <CardTitle>ログインが必要です</CardTitle>
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
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ArrowLeft className="h-5 w-5" />
              </a>
            </Button>
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">マイテンプレート</h1>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新規作成
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新しいテンプレートを作成</DialogTitle>
                <DialogDescription>
                  独自のプロンプトテンプレートを作成して、繰り返し使用できます
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="create-name">テンプレート名</Label>
                  <Input
                    id="create-name"
                    placeholder="例: 外資系IT企業向けテンプレート"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="create-description">説明</Label>
                  <Textarea
                    id="create-description"
                    placeholder="このテンプレートの用途や特徴を説明してください"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="create-prompt">プロンプトテンプレート</Label>
                  <Textarea
                    id="create-prompt"
                    placeholder={`あなたは職務経歴書最適化の専門家です。以下の点を重視して作成してください：\n\n1. ...\n2. ...\n\n職務経歴書: {{resumeText}}\n求人情報: {{jobDescription}}`}
                    value={formData.promptTemplate}
                    onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    ※ {"{{resumeText}}"} と {"{{jobDescription}}"}{" "}
                    を使用すると、入力内容が自動的に埋め込まれます
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={handleCreate} disabled={createMutation.isPending}>
                    {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    作成
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-center text-gray-600 mb-8">
          独自のテンプレートを作成・管理して、効率的に職務経歴書を最適化できます
        </p>

        {templatesQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : templatesQuery.data && templatesQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templatesQuery.data.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{template.name}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(template.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs font-mono text-muted-foreground line-clamp-3">
                      {template.promptTemplate}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    作成日: {new Date(template.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">まだテンプレートがありません</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                最初のテンプレートを作成
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>テンプレートを編集</DialogTitle>
              <DialogDescription>テンプレートの内容を更新できます</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">テンプレート名</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">説明</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="edit-prompt">プロンプトテンプレート</Label>
                <Textarea
                  id="edit-prompt"
                  value={formData.promptTemplate}
                  onChange={(e) => setFormData({ ...formData, promptTemplate: e.target.value })}
                  className="min-h-[300px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  ※ {"{{resumeText}}"} と {"{{jobDescription}}"}{" "}
                  を使用すると、入力内容が自動的に埋め込まれます
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  更新
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
