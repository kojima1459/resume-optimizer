import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
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
  onSelectUserTemplate: (templateId: number | null) => void;
};

const CATEGORY_LABELS: Record<string, string> = {
  IT: "IT業界",
  finance: "金融業界",
  manufacturing: "製造業",
  sales: "営業",
  marketing: "マーケティング",
};

export function TemplateSelector({ onSelectTemplate, onSelectUserTemplate }: TemplateSelectorProps) {
  const { t } = useTranslation();
  const [templateType, setTemplateType] = useState<"system" | "user">("system");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedUserTemplateId, setSelectedUserTemplateId] = useState<number | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const templatesQuery = trpc.template.list.useQuery();
  const userTemplatesQuery = trpc.userTemplate.list.useQuery();
  const templateDetailQuery = trpc.template.getById.useQuery(
    { id: previewTemplate?.id || 0 },
    { enabled: !!previewTemplate && showPreview && templateType === "system" }
  );
  const userTemplateDetailQuery = trpc.userTemplate.getById.useQuery(
    { id: previewTemplate?.id || 0 },
    { enabled: !!previewTemplate && showPreview && templateType === "user" }
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
    if (templateType === "system") {
      setSelectedTemplateId(id);
      setSelectedUserTemplateId(null);
      onSelectTemplate(id);
      onSelectUserTemplate(null);
    } else {
      setSelectedUserTemplateId(id);
      setSelectedTemplateId(null);
      onSelectUserTemplate(id);
      onSelectTemplate(null);
    }
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setSelectedTemplateId(null);
    setSelectedUserTemplateId(null);
    onSelectTemplate(null);
    onSelectUserTemplate(null);
  };

  if (templatesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentTemplates = templateType === "system" ? filteredTemplates : (userTemplatesQuery.data || []);
  const currentSelectedId = templateType === "system" ? selectedTemplateId : selectedUserTemplateId;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={templateType === "system" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setTemplateType("system");
            handleClearSelection();
          }}
        >
          {t('template.systemTemplate')}
        </Button>
        <Button
          variant={templateType === "user" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setTemplateType("user");
            handleClearSelection();
          }}
        >
          {t('template.myTemplate')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <a href="/my-templates" target="_blank" className="inline-flex items-center justify-center">
            {t('template.templateManagement')}
          </a>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templateType === "system" && (
          <div>
            <label className="text-sm font-medium mb-2 block">{t('template.industryCategory')}</label>
            <Select value={selectedCategory || ""} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('template.selectIndustry')} />
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
        )}

        <div>
          <label className="text-sm font-medium mb-2 block">{t('template.template')}</label>
          <Select
            value={currentSelectedId?.toString() || ""}
            onValueChange={handleTemplateSelect}
            disabled={templateType === "system" && !selectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('template.selectTemplate')} />
            </SelectTrigger>
            <SelectContent>
              {currentTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id.toString()}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentSelectedId && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {currentTemplates.find((t) => t.id === currentSelectedId)?.name}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                {currentTemplates.find((t) => t.id === currentSelectedId)?.description}
              </p>
            </div>
            <div className="flex gap-2">
              {templateType === "system" && (
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const template = currentTemplates.find((t) => t.id === currentSelectedId);
                      if (template && 'category' in template && 'jobType' in template) {
                        handlePreview(template as Template);
                      }
                    }}
                  >
                      <Info className="h-4 w-4 mr-1" />
                      {t('template.details')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('template.templateDetails')}</DialogTitle>
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
                          <h4 className="font-semibold mb-2">{t('template.description')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {templateDetailQuery.data.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{t('template.sampleOutput')}</h4>
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
              )}
              <Button size="sm" variant="ghost" onClick={handleClearSelection}>
                {t('template.clear')}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
