#!/usr/bin/env python3
"""
Home.tsxの残りの翻訳キーを生成するスクリプト
"""

import json

# Home.tsx の残りの翻訳キー
home_remaining_ja = {
    "home.toast.patternSelected": "パターン{{index}}を選択しました",
    "home.toast.templateSelected": "テンプレートを選択しました",
    "home.toast.patternNotFound": "パターンが見つかりません",
    "home.toast.myTemplateSelected": "マイテンプレートを選択しました",
    "home.confirm.deleteHistory": "この履歴を削除してもよろしいですか？",
    "home.toast.favoriteAdded": "お気に入りに登録しました",
    "home.toast.favoriteRemoved": "お気に入りを解除しました",
    "home.fileName.word": "職務経歴書.docx",
    "home.fileName.pdf": "職務経歴書.pdf",
    "home.fileName.text": "職務経歴書.txt",
    "home.fileName.markdown": "職務経歴書.md",
    "home.shortcut.generate": "生成開始",
    "home.shortcut.copyAll": "全項目をコピー",
    "home.shortcut.showHelp": "ショートカットヘルプを表示",
    "home.confirm.restoreData": "前回の入力内容が見つかりました。\n最終保存: {{timestamp}}\n\n復元しますか？",
    "home.confirm.clearData": "保存されたデータをクリアしますか？",
    "home.label.characters": "文字",
    "home.label.score": "点",
    "home.label.relevance": "関連性",
    "home.label.clarity": "明確さ",
    "home.label.impact": "インパクト",
    "home.label.completeness": "完成度",
}

home_remaining_en = {
    "home.toast.patternSelected": "Pattern {{index}} selected",
    "home.toast.templateSelected": "Template selected",
    "home.toast.patternNotFound": "Pattern not found",
    "home.toast.myTemplateSelected": "My template selected",
    "home.confirm.deleteHistory": "Are you sure you want to delete this history?",
    "home.toast.favoriteAdded": "Added to favorites",
    "home.toast.favoriteRemoved": "Removed from favorites",
    "home.fileName.word": "resume.docx",
    "home.fileName.pdf": "resume.pdf",
    "home.fileName.text": "resume.txt",
    "home.fileName.markdown": "resume.md",
    "home.shortcut.generate": "Generate",
    "home.shortcut.copyAll": "Copy All",
    "home.shortcut.showHelp": "Show Shortcut Help",
    "home.confirm.restoreData": "Previous input found.\nLast saved: {{timestamp}}\n\nRestore?",
    "home.confirm.clearData": "Clear saved data?",
    "home.label.characters": "chars",
    "home.label.score": "pts",
    "home.label.relevance": "Relevance",
    "home.label.clarity": "Clarity",
    "home.label.impact": "Impact",
    "home.label.completeness": "Completeness",
}

# JSONファイルに保存
with open('/home/ubuntu/resume_optimizer/home_remaining_ja.json', 'w', encoding='utf-8') as f:
    json.dump(home_remaining_ja, f, ensure_ascii=False, indent=2)

with open('/home/ubuntu/resume_optimizer/home_remaining_en.json', 'w', encoding='utf-8') as f:
    json.dump(home_remaining_en, f, ensure_ascii=False, indent=2)

print("残りの翻訳キーをhome_remaining_ja.jsonとhome_remaining_en.jsonに保存しました。")
print(f"日本語キー数: {len(home_remaining_ja)}")
print(f"英語キー数: {len(home_remaining_en)}")
