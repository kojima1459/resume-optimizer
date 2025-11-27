#!/usr/bin/env python3
"""
残りのページの翻訳キーを生成するスクリプト
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
    "favorites.deleteConfirm": "このお気に入りパターンを削除しますか？",
    "favorites.toast.deleted": "お気に入りパターンを削除しました",
    "favorites.toast.deleteFailed": "削除に失敗しました",
    "favorites.toast.updated": "お気に入りパターンを更新しました",
    "favorites.toast.updateFailed": "更新に失敗しました",
    "favorites.toast.copied": "コピーしました",
    "favorites.edit": "編集",
    "favorites.delete": "削除",
    "favorites.copy": "コピー",
    "favorites.editDialog.title": "お気に入りパターンを編集",
    "favorites.editDialog.name": "パターン名",
    "favorites.editDialog.notes": "メモ",
    "favorites.editDialog.save": "保存",
    "favorites.editDialog.cancel": "キャンセル",
    "favorites.noFavorites": "お気に入りパターンがありません",
    "favorites.noFavoritesDescription": "ホーム画面で生成したパターンをお気に入りに登録すると、ここに表示されます。",
    "favorites.backToHome": "ホームに戻る",
    "favorites.patternDetails": "パターン詳細",
    "favorites.comparePatterns": "パターン比較",
    "favorites.selectToCompare": "比較するパターンを選択してください",
    "favorites.differenceRate": "差異率: {{rate}}%",
}

favorites_en = {
    "favorites.title": "Favorite Patterns",
    "favorites.loginRequired": "Login Required",
    "favorites.loginDescription": "You need to log in with a Manus account to use this feature",
    "favorites.loginButton": "Login to Start",
    "favorites.compareMode": "Compare Mode",
    "favorites.compareModeEnd": "End Compare Mode",
    "favorites.selectedCount": "{{count}} selected",
    "favorites.evaluationScore": "Score: {{score}} pts",
    "favorites.deleteConfirm": "Are you sure you want to delete this favorite pattern?",
    "favorites.toast.deleted": "Favorite pattern deleted",
    "favorites.toast.deleteFailed": "Failed to delete",
    "favorites.toast.updated": "Favorite pattern updated",
    "favorites.toast.updateFailed": "Failed to update",
    "favorites.toast.copied": "Copied",
    "favorites.edit": "Edit",
    "favorites.delete": "Delete",
    "favorites.copy": "Copy",
    "favorites.editDialog.title": "Edit Favorite Pattern",
    "favorites.editDialog.name": "Pattern Name",
    "favorites.editDialog.notes": "Notes",
    "favorites.editDialog.save": "Save",
    "favorites.editDialog.cancel": "Cancel",
    "favorites.noFavorites": "No favorite patterns",
    "favorites.noFavoritesDescription": "Patterns you save as favorites from the home screen will appear here.",
    "favorites.backToHome": "Back to Home",
    "favorites.patternDetails": "Pattern Details",
    "favorites.comparePatterns": "Compare Patterns",
    "favorites.selectToCompare": "Select patterns to compare",
    "favorites.differenceRate": "Difference: {{rate}}%",
}

# Privacy.tsx の翻訳キー
privacy_ja = {
    "privacy.title": "プライバシーポリシー",
    "privacy.lastUpdated": "最終更新日: {{date}}",
}

privacy_en = {
    "privacy.title": "Privacy Policy",
    "privacy.lastUpdated": "Last updated: {{date}}",
}

# Terms.tsx の翻訳キー
terms_ja = {
    "terms.title": "利用規約",
    "terms.lastUpdated": "最終更新日: {{date}}",
}

terms_en = {
    "terms.title": "Terms of Service",
    "terms.lastUpdated": "Last updated: {{date}}",
}

# MyTemplates.tsx の翻訳キー
myTemplates_ja = {
    "myTemplates.title": "マイテンプレート",
    "myTemplates.create": "新規作成",
    "myTemplates.edit": "編集",
    "myTemplates.delete": "削除",
    "myTemplates.noTemplates": "テンプレートがありません",
    "myTemplates.noTemplatesDescription": "新しいテンプレートを作成して、効率的に職務経歴書を生成しましょう。",
    "myTemplates.createDialog.title": "テンプレートを作成",
    "myTemplates.editDialog.title": "テンプレートを編集",
    "myTemplates.name": "テンプレート名",
    "myTemplates.description": "説明",
    "myTemplates.save": "保存",
    "myTemplates.cancel": "キャンセル",
    "myTemplates.toast.created": "テンプレートを作成しました",
    "myTemplates.toast.updated": "テンプレートを更新しました",
    "myTemplates.toast.deleted": "テンプレートを削除しました",
    "myTemplates.toast.failed": "操作に失敗しました",
}

myTemplates_en = {
    "myTemplates.title": "My Templates",
    "myTemplates.create": "Create New",
    "myTemplates.edit": "Edit",
    "myTemplates.delete": "Delete",
    "myTemplates.noTemplates": "No templates",
    "myTemplates.noTemplatesDescription": "Create a new template to efficiently generate resumes.",
    "myTemplates.createDialog.title": "Create Template",
    "myTemplates.editDialog.title": "Edit Template",
    "myTemplates.name": "Template Name",
    "myTemplates.description": "Description",
    "myTemplates.save": "Save",
    "myTemplates.cancel": "Cancel",
    "myTemplates.toast.created": "Template created",
    "myTemplates.toast.updated": "Template updated",
    "myTemplates.toast.deleted": "Template deleted",
    "myTemplates.toast.failed": "Operation failed",
}

# 全ての翻訳キーを統合
all_ja = {}
all_ja.update(favorites_ja)
all_ja.update(privacy_ja)
all_ja.update(terms_ja)
all_ja.update(myTemplates_ja)

all_en = {}
all_en.update(favorites_en)
all_en.update(privacy_en)
all_en.update(terms_en)
all_en.update(myTemplates_en)

# JSONファイルに保存
with open('/home/ubuntu/resume_optimizer/remaining_pages_ja.json', 'w', encoding='utf-8') as f:
    json.dump(all_ja, f, ensure_ascii=False, indent=2)

with open('/home/ubuntu/resume_optimizer/remaining_pages_en.json', 'w', encoding='utf-8') as f:
    json.dump(all_en, f, ensure_ascii=False, indent=2)

print("残りのページの翻訳キーをremaining_pages_ja.jsonとremaining_pages_en.jsonに保存しました。")
print(f"日本語キー数: {len(all_ja)}")
print(f"英語キー数: {len(all_en)}")
