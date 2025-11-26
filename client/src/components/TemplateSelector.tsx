import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Template = {
  id: number;
  category: string;
  jobType: string;
  name: string;
  description: string;
};

type TemplateSelectorProps = {
  onSelectTemplate: (templateId: number | null) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  IT: "IT業界",
  finance: "金融業界",
  manufacturing: "製造業",
  sales: "営業",
  marketing: "マーケティング",
};

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const templatesQuery = trpc.template.list.useQuery();
  const templateDetailQuery = trpc.template.getById.useQuery(
    { id: previewTemplate?.id || 0 },
    { enabled: !!previewTemplate && showPreview }
  );

  const categories = templatesQuery.data
    ? Array.from(new Set(templatesQuery.data.map((t) => t.category)))
    : [];

  const filteredTemplates = templatesQuery.data
    ? selectedCategory
      ? templatesQuery.data.filter((t) => t.category === selectedCategory)
      : templatesQuery.data
    : [];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedTemplateId(null);
    onSelectTemplate(null);
  };

  const handleTemplateSelect = (templateId: string) => {
    const id = parseInt(templateId);
    setSelectedTemplateId(id);
    onSelectTemplate(id);
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setSelectedTemplateId(null);
    onSelectTemplate(null);
  };

  if (templatesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">業界・カテゴリ</label>
          <Select value={selectedCategory || ""} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="業界を選択..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {CATEGORY_LABELS[category] || category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">テンプレート</label>
          <Select
            value={selectedTemplateId?.toString() || ""}
            onValueChange={handleTemplateSelect}
            disabled={!selectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="テンプレートを選択..." />
            </SelectTrigger>
            <SelectContent>
              {filteredTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id.toString()}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedTemplateId && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {filteredTemplates.find((t) => t.id === selectedTemplateId)?.name}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                {filteredTemplates.find((t) => t.id === selectedTemplateId)?.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handlePreview(filteredTemplates.find((t) => t.id === selectedTemplateId)!)
                    }
                  >
                    <Info className="h-4 w-4 mr-1" />
                    詳細
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>テンプレート詳細</DialogTitle>
                    <DialogDescription>
                      {previewTemplate?.name}
                    </DialogDescription>
                  </DialogHeader>
                  {templateDetailQuery.isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : templateDetailQuery.data ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">説明</h4>
                        <p className="text-sm text-muted-foreground">
                          {templateDetailQuery.data.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">サンプル出力</h4>
                        <div className="bg-muted p-4 rounded-lg space-y-3">
                          {JSON.parse(templateDetailQuery.data.sampleContent) &&
                            Object.entries(
                              JSON.parse(templateDetailQuery.data.sampleContent)
                            ).map(([key, value]) => (
                              <div key={key}>
                                <p className="font-medium text-sm mb-1">
                                  {key === "summary"
                                    ? "職務要約"
                                    : key === "motivation"
                                    ? "志望動機"
                                    : key === "self_pr"
                                    ? "自己PR"
                                    : key}
                                </p>
                                <p className="text-sm text-muted-foreground">{value as string}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="ghost" onClick={handleClearSelection}>
                クリア
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
