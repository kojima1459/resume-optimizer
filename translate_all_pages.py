#!/usr/bin/env python3
"""
全ページの翻訳キーを生成するスクリプト
"""

import json

# Favorites.tsx の翻訳キー
favorites_ja = {
    "favorites.title": "お気に入りパターン",
    "favorites.loginRequired": "ログインが必要です",
    "favorites.loginDescription": "ご利用にはManusアカウントでのログインが必要です",
    "favorites.loginButton": "ログインして開始",
    "favorites.compareMode": "比較モード",
    "favorites.compareModeEnd": "比較モード終了",
    "favorites.selectedCount": "{{count}}件選択中",
    "favorites.evaluationScore": "評価スコア: {{score}}点",
    "favorites.compareTitle": "パターン比較 ({{count}}件)",
    "favorites.differenceRate": "差異率: {{rate}}%",
    "favorites.patternDetails": "パターン詳細",
    "favorites.selectPattern": "左側からパターンを選択してください",
    "favorites.name": "名前",
    "favorites.notes": "メモ",
    "favorites.generatedContent": "生成内容",
    "favorites.edit": "編集",
    "favorites.delete": "削除",
    "favorites.copy": "コピー",
    "favorites.editDialog.title": "お気に入りパターンを編集",
    "favorites.editDialog.name": "名前",
    "favorites.editDialog.notes": "メモ",
    "favorites.editDialog.save": "保存",
    "favorites.editDialog.cancel": "キャンセル",
    "favorites.toast.deleted": "お気に入りパターンを削除しました",
    "favorites.toast.updated": "お気に入りパターンを更新しました",
    "favorites.toast.copied": "コピーしました",
    "favorites.toast.deleteFailed": "削除に失敗しました",
    "favorites.toast.updateFailed": "更新に失敗しました",
    "favorites.confirm.delete": "このお気に入りパターンを削除しますか？",
    "favorites.noFavorites": "お気に入りパターンがありません",
    "favorites.noFavoritesDescription": "生成結果画面でお気に入りに追加してください",
}

favorites_en = {
    "favorites.title": "Favorite Patterns",
    "favorites.loginRequired": "Login Required",
    "favorites.loginDescription": "You need to log in with your Manus account to use this feature",
    "favorites.loginButton": "Login to Start",
    "favorites.compareMode": "Compare Mode",
    "favorites.compareModeEnd": "End Compare Mode",
    "favorites.selectedCount": "{{count}} selected",
    "favorites.evaluationScore": "Score: {{score}}",
    "favorites.compareTitle": "Pattern Comparison ({{count}})",
    "favorites.differenceRate": "Difference: {{rate}}%",
    "favorites.patternDetails": "Pattern Details",
    "favorites.selectPattern": "Select a pattern from the left",
    "favorites.name": "Name",
    "favorites.notes": "Notes",
    "favorites.generatedContent": "Generated Content",
    "favorites.edit": "Edit",
    "favorites.delete": "Delete",
    "favorites.copy": "Copy",
    "favorites.editDialog.title": "Edit Favorite Pattern",
    "favorites.editDialog.name": "Name",
    "favorites.editDialog.notes": "Notes",
    "favorites.editDialog.save": "Save",
    "favorites.editDialog.cancel": "Cancel",
    "favorites.toast.deleted": "Favorite pattern deleted",
    "favorites.toast.updated": "Favorite pattern updated",
    "favorites.toast.copied": "Copied",
    "favorites.toast.deleteFailed": "Failed to delete",
    "favorites.toast.updateFailed": "Failed to update",
    "favorites.confirm.delete": "Are you sure you want to delete this favorite pattern?",
    "favorites.noFavorites": "No favorite patterns",
    "favorites.noFavoritesDescription": "Add favorites from the generation results screen",
}

# ApiSettings.tsx の翻訳キー
api_settings_ja = {
    "apiSettings.title": "API設定",
    "apiSettings.description": "OpenAI、Gemini、またはClaudeのAPIキーを設定してください。",
    "apiSettings.provider": "メインプロバイダー",
    "apiSettings.selectProvider": "プロバイダーを選択...",
    "apiSettings.openai": "OpenAI",
    "apiSettings.gemini": "Gemini",
    "apiSettings.claude": "Claude",
    "apiSettings.openaiKey": "OpenAI APIキー",
    "apiSettings.geminiKey": "Gemini APIキー",
    "apiSettings.claudeKey": "Claude APIキー (Coming Soon)",
    "apiSettings.keyPlaceholder": "APIキーを入力...",
    "apiSettings.save": "保存",
    "apiSettings.howToGet": "APIキーの取得方法",
    "apiSettings.openaiLink": "OpenAI APIキーを取得",
    "apiSettings.geminiLink": "Gemini APIキーを取得",
    "apiSettings.claudeLink": "Claude APIキーを取得",
    "apiSettings.toast.saved": "API設定を保存しました",
    "apiSettings.toast.saveFailed": "保存に失敗しました",
    "apiSettings.loginRequired": "ログインが必要です",
    "apiSettings.loginDescription": "ご利用にはManusアカウントでのログインが必要です",
    "apiSettings.loginButton": "ログインして開始",
}

api_settings_en = {
    "apiSettings.title": "API Settings",
    "apiSettings.description": "Set your API key for OpenAI, Gemini, or Claude.",
    "apiSettings.provider": "Main Provider",
    "apiSettings.selectProvider": "Select provider...",
    "apiSettings.openai": "OpenAI",
    "apiSettings.gemini": "Gemini",
    "apiSettings.claude": "Claude",
    "apiSettings.openaiKey": "OpenAI API Key",
    "apiSettings.geminiKey": "Gemini API Key",
    "apiSettings.claudeKey": "Claude API Key (Coming Soon)",
    "apiSettings.keyPlaceholder": "Enter API key...",
    "apiSettings.save": "Save",
    "apiSettings.howToGet": "How to Get API Keys",
    "apiSettings.openaiLink": "Get OpenAI API Key",
    "apiSettings.geminiLink": "Get Gemini API Key",
    "apiSettings.claudeLink": "Get Claude API Key",
    "apiSettings.toast.saved": "API settings saved",
    "apiSettings.toast.saveFailed": "Failed to save",
    "apiSettings.loginRequired": "Login Required",
    "apiSettings.loginDescription": "You need to log in with your Manus account to use this feature",
    "apiSettings.loginButton": "Login to Start",
}

# 全ての翻訳キーを統合
all_ja = {}
all_ja.update(favorites_ja)
all_ja.update(api_settings_ja)

all_en = {}
all_en.update(favorites_en)
all_en.update(api_settings_en)

# JSONファイルに保存
with open('/home/ubuntu/resume_optimizer/pages_ja.json', 'w', encoding='utf-8') as f:
    json.dump(all_ja, f, ensure_ascii=False, indent=2)

with open('/home/ubuntu/resume_optimizer/pages_en.json', 'w', encoding='utf-8') as f:
    json.dump(all_en, f, ensure_ascii=False, indent=2)

print("翻訳キーをpages_ja.jsonとpages_en.jsonに保存しました。")
print(f"日本語キー数: {len(all_ja)}")
print(f"英語キー数: {len(all_en)}")
