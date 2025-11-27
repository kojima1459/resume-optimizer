import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismissForever?: () => void;
}

export function AnnouncementDialog({ open, onOpenChange, onDismissForever }: AnnouncementDialogProps) {
  const { t } = useTranslation();

  const COMING_SOON_FEATURES = [
    {
      title: t('announcement.feature1.title'),
      description: t('announcement.feature1.description'),
      icon: "📝",
      priority: "high",
      status: "implemented",
    },
    {
      title: t('announcement.feature2.title'),
      description: t('announcement.feature2.description'),
      icon: "💬",
      priority: "high",
      status: "planned",
    },
    {
      title: t('announcement.feature3.title'),
      description: t('announcement.feature3.description'),
      icon: "🔗",
      priority: "medium",
      status: "planned",
    },
    {
      title: t('announcement.feature4.title'),
      description: t('announcement.feature4.description'),
      icon: "🚀",
      priority: "high",
      status: "planned",
    },
    {
      title: t('announcement.feature5.title'),
      description: t('announcement.feature5.description'),
      icon: "🔄",
      priority: "medium",
      status: undefined,
    },
    {
      title: t('announcement.feature6.title'),
      description: t('announcement.feature6.description'),
      icon: "📚",
      priority: "medium",
      status: undefined,
    },
    {
      title: t('announcement.feature7.title'),
      description: t('announcement.feature7.description'),
      icon: "📱",
      priority: "low",
      status: undefined,
    },
    {
      title: t('announcement.feature8.title'),
      description: t('announcement.feature8.description'),
      icon: "👑",
      priority: "medium",
      status: undefined,
    },
  ];

  const handleDismissForever = () => {
    if (onDismissForever) {
      onDismissForever();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            {t('announcement.title')}
          </DialogTitle>
          <DialogDescription>
            {t('announcement.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {COMING_SOON_FEATURES.map((feature, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{feature.title}</span>
                      {feature.priority === "high" && (
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full">
                          {t('announcement.priority.high')}
                        </span>
                      )}
                      {feature.status === "implemented" && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {t('announcement.status.implemented')}
                        </span>
                      )}
                      {feature.status === "inProgress" && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t('announcement.status.inProgress')}
                        </span>
                      )}
                      {feature.status === "planned" && (
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
                          {t('announcement.status.planned')}
                        </span>
                      )}
                      {feature.priority === "medium" && (
                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                          {t('announcement.priority.medium')}
                        </span>
                      )}
                      {feature.priority === "low" && (
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
                          {t('announcement.priority.low')}
                        </span>
                      )}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {t('announcement.schedule.title')}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {t('announcement.schedule.description')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-3 mt-6">
          {onDismissForever && (
            <Button variant="ghost" onClick={handleDismissForever} className="text-muted-foreground">
              {t('announcement.dismissForever')}
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('announcement.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
