#!/usr/bin/env python3
"""
コンポーネントの翻訳キーを生成するスクリプト
"""

import json

# AnnouncementDialog.tsx の翻訳キー
announcement_ja = {
    "announcement.title": "今後の機能追加予定",
    "announcement.description": "より便利で使いやすいサービスを目指して、以下の機能を実装予定です。",
    "announcement.feature1.title": "AIによる職務経歴書の添削・スコアリング機能",
    "announcement.feature1.description": "現在の職務経歴書を分析して、改善点を具体的に指摘。「読みやすさ」「具体性」「インパクト」などの項目別スコアを表示します。",
    "announcement.feature2.title": "AI面接対策機能（無料！）",
    "announcement.feature2.description": "求人情報と職務経歴書からAIが想定質問を自動生成し、あなたの経歴に基づいた回答例を提示します。面接前の準備が効率的に行えます。",
    "announcement.feature3.title": "LinkedIn人材検索機能",
    "announcement.feature3.description": "LinkedIn APIを使用して企業情報や人材情報を取得し、あなたの職務経歴書に基づいて関連企業を提案します。転職先の発見がスムーズになります。",
    "announcement.feature4.title": "バッチ一括応募機能",
    "announcement.feature4.description": "複数企業への応募を一括で行える機能。求人情報を選択し、最適化された職務経歴書を自動で送信します。比較を3社以上に同時応募でき、転職活動を大幅に効率化します。",
    "announcement.feature5.title": "職務経歴書のビフォー・アフター比較機能",
    "announcement.feature5.description": "最適化前と最適化後の職務経歴書を並べて比較表示。どこが改善されたかが一目瞭然です。",
    "announcement.feature6.title": "業界別テンプレート集",
    "announcement.feature6.description": "IT、営業、事務、クリエイティブなど、業界別に最適化されたテンプレートを提供します。",
    "announcement.feature7.title": "SNSシェア機能",
    "announcement.feature7.description": "生成した職務経歴書の一部をTwitter/LinkedInでシェアして、フィードバックを受け取れます。",
    "announcement.feature8.title": "プレミアムプラン（サブスクリプション）",
    "announcement.feature8.description": "月額課金で、無制限の生成回数、優先サポート、独自テンプレート作成などの特典を提供します。",
    "announcement.priority.high": "優先度: 高",
    "announcement.priority.medium": "優先度: 中",
    "announcement.priority.low": "優先度: 低",
    "announcement.status.implemented": "実装済み",
    "announcement.status.inProgress": "開発中",
    "announcement.status.planned": "予定",
    "announcement.schedule.title": "実装スケジュール",
    "announcement.schedule.description": "優先度の高い機能から順次実装していきます。実装完了次第、お知らせいたします。",
    "announcement.dismissForever": "今後表示しない",
    "announcement.close": "閉じる",
}

announcement_en = {
    "announcement.title": "Upcoming Features",
    "announcement.description": "We are planning to implement the following features to make our service more convenient and user-friendly.",
    "announcement.feature1.title": "AI Resume Review & Scoring",
    "announcement.feature1.description": "Analyze your current resume and provide specific improvement suggestions. Display scores for categories like 'readability,' 'specificity,' and 'impact.'",
    "announcement.feature2.title": "AI Interview Preparation (Free!)",
    "announcement.feature2.description": "Automatically generate expected interview questions from job postings and resumes, and provide sample answers based on your experience. Prepare efficiently for interviews.",
    "announcement.feature3.title": "LinkedIn Talent Search",
    "announcement.feature3.description": "Use LinkedIn API to retrieve company and talent information, and suggest relevant companies based on your resume. Discover job opportunities smoothly.",
    "announcement.feature4.title": "Batch Application Feature",
    "announcement.feature4.description": "Apply to multiple companies at once. Select job postings and automatically send optimized resumes. Apply to 3+ companies simultaneously for comparison, significantly improving job search efficiency.",
    "announcement.feature5.title": "Before & After Resume Comparison",
    "announcement.feature5.description": "Display optimized and original resumes side by side. See improvements at a glance.",
    "announcement.feature6.title": "Industry-Specific Template Collection",
    "announcement.feature6.description": "Provide templates optimized for industries like IT, sales, administration, and creative fields.",
    "announcement.feature7.title": "Social Media Sharing",
    "announcement.feature7.description": "Share parts of your generated resume on Twitter/LinkedIn to receive feedback.",
    "announcement.feature8.title": "Premium Plan (Subscription)",
    "announcement.feature8.description": "Monthly subscription offering unlimited generations, priority support, custom template creation, and more.",
    "announcement.priority.high": "Priority: High",
    "announcement.priority.medium": "Priority: Medium",
    "announcement.priority.low": "Priority: Low",
    "announcement.status.implemented": "Implemented",
    "announcement.status.inProgress": "In Progress",
    "announcement.status.planned": "Planned",
    "announcement.schedule.title": "Implementation Schedule",
    "announcement.schedule.description": "We will implement features in order of priority. We will notify you when each feature is completed.",
    "announcement.dismissForever": "Don't show again",
    "announcement.close": "Close",
}

# 全ての翻訳キーを統合
all_ja = {}
all_ja.update(announcement_ja)

all_en = {}
all_en.update(announcement_en)

# JSONファイルに保存
with open('/home/ubuntu/resume_optimizer/components_ja.json', 'w', encoding='utf-8') as f:
    json.dump(all_ja, f, ensure_ascii=False, indent=2)

with open('/home/ubuntu/resume_optimizer/components_en.json', 'w', encoding='utf-8') as f:
    json.dump(all_en, f, ensure_ascii=False, indent=2)

print("翻訳キーをcomponents_ja.jsonとcomponents_en.jsonに保存しました。")
print(f"日本語キー数: {len(all_ja)}")
print(f"英語キー数: {len(all_en)}")
