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

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismissForever?: () => void;
}

const COMING_SOON_FEATURES = [
  {
    title: "AIによる職務経歴書の添削・スコアリング機能",
    description: "現在の職務経歴書を分析して、改善点を具体的に指摘。「読みやすさ」「具体性」「インパクト」などの項目別スコアを表示します。",
    icon: "📝",
    priority: "高",
    status: "実装済み",
  },

  {
    title: "AI面接対策機能（無料！）",
    description: "求人情報と職務経歴書からAIが想定質問を自動生成し、あなたの経歴に基づいた回答例を提示します。面接前の準備が効率的に行えます。",
    icon: "💬",
    priority: "高",
    status: "予定",
  },
  {
    title: "LinkedIn人材検索機能",
    description: "LinkedIn APIを使用して企業情報や人材情報を取得し、あなたの職務経歴書に基づいて関連企業を提案します。転職先の発見がスムーズになります。",
    icon: "🔗",
    priority: "中",
    status: "予定",
  },
  {
    title: "バッチ一括応募機能",
    description: "複数企業への応募を一括で行える機能。求人情報を選択し、最適化された職務経歴書を自動で送信します。比較を3社以上に同時応募でき、転職活動を大幅に効率化します。",
    icon: "🚀",
    priority: "高",
    status: "予定",
  },
  {
    title: "職務経歴書のビフォー・アフター比較機能",
    description: "最適化前と最適化後の職務経歴書を並べて比較表示。どこが改善されたかが一目瞭然です。",
    icon: "🔄",
    priority: "中",
  },
  {
    title: "業界別テンプレート集",
    description: "IT、営業、事務、クリエイティブなど、業界別に最適化されたテンプレートを提供します。",
    icon: "📚",
    priority: "中",
  },
  {
    title: "SNSシェア機能",
    description: "生成した職務経歴書の一部をTwitter/LinkedInでシェアして、フィードバックを受け取れます。",
    icon: "📱",
    priority: "低",
  },
  {
    title: "プレミアムプラン（サブスクリプション）",
    description: "月額課金で、無制限の生成回数、優先サポート、独自テンプレート作成などの特典を提供します。",
    icon: "👑",
    priority: "中",
  },
];

export function AnnouncementDialog({ open, onOpenChange, onDismissForever }: AnnouncementDialogProps) {
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
            今後の機能追加予定
          </DialogTitle>
          <DialogDescription>
            より便利で使いやすいサービスを目指して、以下の機能を実装予定です。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {COMING_SOON_FEATURES.map((feature, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{feature.title}</span>
                      {feature.priority === "高" && (
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full">
                          優先度: 高
                        </span>
                      )}
                      {feature.status === "実装済み" && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          実装済み
                        </span>
                      )}
                      {feature.status === "開発中" && (
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          開発中
                        </span>
                      )}
                      {feature.status === "予定" && (
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
                          予定
                        </span>
                      )}
                      {feature.priority === "中" && (
                        <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
                          優先度: 中
                        </span>
                      )}
                      {feature.priority === "低" && (
                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
                          優先度: 低
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
                実装スケジュール
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                優先度の高い機能から順次実装していきます。実装完了次第、お知らせいたします。
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-3 mt-6">
          {onDismissForever && (
            <Button variant="ghost" onClick={handleDismissForever} className="text-muted-foreground">
              今後表示しない
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              閉じる
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
