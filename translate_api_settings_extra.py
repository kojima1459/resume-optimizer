#!/usr/bin/env python3
"""
ApiSettings.tsxの追加翻訳キーを生成するスクリプト
"""

import json

# ApiSettings.tsx の追加翻訳キー
api_settings_extra_ja = {
    "apiSettings.header.title": "職務経歴書最適化ツール",
    "apiSettings.header.backHome": "ホームに戻る",
    "apiSettings.selectProvider": "AIプロバイダーを選択",
    "apiSettings.openai.description": "GPT-4, GPT-3.5など",
    "apiSettings.gemini.description": "Gemini Pro, Gemini Ultraなど",
    "apiSettings.claude.description": "Claude 3 Opus, Claude 3 Sonnetなど",
    "apiSettings.apiKeyLabel": "{{provider}} APIキー",
    "apiSettings.getApiKey": "APIキーを取得",
    "apiSettings.apiKeyPlaceholderFull": "{{provider}} APIキーを入力してください",
    "apiSettings.apiKeyStorage": "APIキーはブラウザのlocalStorageに安全に保存されます",
    "apiSettings.save": "保存",
    "apiSettings.howToGetTitle": "APIキーの取得方法",
    "apiSettings.openai.step1": "にアクセス",
    "apiSettings.openai.step2": "「Create new secret key」をクリック",
    "apiSettings.openai.step3": "生成されたAPIキーをコピーして上記に貼り付け",
    "apiSettings.gemini.step1": "にアクセス",
    "apiSettings.gemini.step2": "「Get API key」をクリック",
    "apiSettings.gemini.step3": "生成されたAPIキーをコピーして上記に貼り付け",
    "apiSettings.claude.step1": "にアクセス",
    "apiSettings.claude.step2": "「Create Key」をクリック",
    "apiSettings.claude.step3": "生成されたAPIキーをコピーして上記に貼り付け",
    "apiSettings.warning": "注意: APIキーは第三者に共有しないでください。APIキーを使用すると、プロバイダーから料金が発生する場合があります。",
    "apiSettings.toast.enterApiKey": "APIキーを入力してください",
}

api_settings_extra_en = {
    "apiSettings.header.title": "AI Resume Optimizer Maker",
    "apiSettings.header.backHome": "Back to Home",
    "apiSettings.selectProvider": "Select AI Provider",
    "apiSettings.openai.description": "GPT-4, GPT-3.5, etc.",
    "apiSettings.gemini.description": "Gemini Pro, Gemini Ultra, etc.",
    "apiSettings.claude.description": "Claude 3 Opus, Claude 3 Sonnet, etc.",
    "apiSettings.apiKeyLabel": "{{provider}} API Key",
    "apiSettings.getApiKey": "Get API Key",
    "apiSettings.apiKeyPlaceholderFull": "Enter {{provider}} API key",
    "apiSettings.apiKeyStorage": "API key is securely stored in browser localStorage",
    "apiSettings.save": "Save",
    "apiSettings.howToGetTitle": "How to Get API Keys",
    "apiSettings.openai.step1": "Visit",
    "apiSettings.openai.step2": "Click 'Create new secret key'",
    "apiSettings.openai.step3": "Copy the generated API key and paste it above",
    "apiSettings.gemini.step1": "Visit",
    "apiSettings.gemini.step2": "Click 'Get API key'",
    "apiSettings.gemini.step3": "Copy the generated API key and paste it above",
    "apiSettings.claude.step1": "Visit",
    "apiSettings.claude.step2": "Click 'Create Key'",
    "apiSettings.claude.step3": "Copy the generated API key and paste it above",
    "apiSettings.warning": "Warning: Do not share your API key with others. Using API keys may incur charges from the provider.",
    "apiSettings.toast.enterApiKey": "Please enter an API key",
}

# JSONファイルに保存
with open('/home/ubuntu/resume_optimizer/api_settings_extra_ja.json', 'w', encoding='utf-8') as f:
    json.dump(api_settings_extra_ja, f, ensure_ascii=False, indent=2)

with open('/home/ubuntu/resume_optimizer/api_settings_extra_en.json', 'w', encoding='utf-8') as f:
    json.dump(api_settings_extra_en, f, ensure_ascii=False, indent=2)

print("追加翻訳キーをapi_settings_extra_ja.jsonとapi_settings_extra_en.jsonに保存しました。")
print(f"日本語キー数: {len(api_settings_extra_ja)}")
print(f"英語キー数: {len(api_settings_extra_en)}")
