import json

# MyTemplates.tsxの完全な翻訳キーのマッピング
mytemplates_ja = {
    "title": "マイテンプレート",
    "newButton": "新規作成",
    "description": "独自のテンプレートを作成・管理して、効率的に職務経歴書を最適化できます",
    "noTemplates": "まだテンプレートがありません",
    "createFirst": "最初のテンプレートを作成",
    "createdAt": "作成日: {date}",
    "loginRequired": {
        "title": "ログインが必要です",
        "description": "ご利用にはManusアカウントでのログインが必要です",
        "button": "ログインして開始"
    },
    "createDialog": {
        "title": "新しいテンプレートを作成",
        "description": "独自のプロンプトテンプレートを作成して、繰り返し使用できます",
        "nameLabel": "テンプレート名",
        "namePlaceholder": "例: 外資系IT企業向けテンプレート",
        "descriptionLabel": "説明",
        "descriptionPlaceholder": "このテンプレートの用途や特徴を説明してください",
        "promptLabel": "プロンプトテンプレート",
        "promptPlaceholder": "あなたは職務経歴書最適化の専門家です。以下の点を重視して作成してください：\\n\\n1. ...\\n2. ...\\n\\n職務経歴書: {{resumeText}}\\n求人情報: {{jobDescription}}",
        "promptNote": "※ {{resumeText}} と {{jobDescription}} を使用すると、入力内容が自動的に埋め込まれます",
        "cancel": "キャンセル",
        "create": "作成"
    },
    "editDialog": {
        "title": "テンプレートを編集",
        "description": "テンプレートの内容を更新できます",
        "nameLabel": "テンプレート名",
        "descriptionLabel": "説明",
        "promptLabel": "プロンプトテンプレート",
        "promptNote": "※ {{resumeText}} と {{jobDescription}} を使用すると、入力内容が自動的に埋め込まれます",
        "cancel": "キャンセル",
        "update": "更新"
    },
    "validation": {
        "allFieldsRequired": "全ての項目を入力してください"
    },
    "confirm": {
        "delete": "このテンプレートを削除してもよろしいですか？"
    }
}

mytemplates_en = {
    "title": "My Templates",
    "newButton": "New Template",
    "description": "Create and manage custom templates to efficiently optimize your resume",
    "noTemplates": "No templates yet",
    "createFirst": "Create your first template",
    "createdAt": "Created: {date}",
    "loginRequired": {
        "title": "Login Required",
        "description": "You need to log in with your Manus account to use this feature",
        "button": "Log in to get started"
    },
    "createDialog": {
        "title": "Create New Template",
        "description": "Create a custom prompt template that you can reuse",
        "nameLabel": "Template Name",
        "namePlaceholder": "e.g., Template for Foreign IT Companies",
        "descriptionLabel": "Description",
        "descriptionPlaceholder": "Describe the purpose and features of this template",
        "promptLabel": "Prompt Template",
        "promptPlaceholder": "You are an expert in resume optimization. Please create with emphasis on the following points:\\n\\n1. ...\\n2. ...\\n\\nResume: {{resumeText}}\\nJob Posting: {{jobDescription}}",
        "promptNote": "※ Use {{resumeText}} and {{jobDescription}} to automatically embed input content",
        "cancel": "Cancel",
        "create": "Create"
    },
    "editDialog": {
        "title": "Edit Template",
        "description": "Update the template content",
        "nameLabel": "Template Name",
        "descriptionLabel": "Description",
        "promptLabel": "Prompt Template",
        "promptNote": "※ Use {{resumeText}} and {{jobDescription}} to automatically embed input content",
        "cancel": "Cancel",
        "update": "Update"
    },
    "validation": {
        "allFieldsRequired": "Please fill in all fields"
    },
    "confirm": {
        "delete": "Are you sure you want to delete this template?"
    }
}

# 保存
with open('mytemplates_complete_ja.json', 'w', encoding='utf-8') as f:
    json.dump(mytemplates_ja, f, ensure_ascii=False, indent=2)

with open('mytemplates_complete_en.json', 'w', encoding='utf-8') as f:
    json.dump(mytemplates_en, f, ensure_ascii=False, indent=2)

print("MyTemplates.tsxの完全な翻訳キーを生成しました。")
print("- mytemplates_complete_ja.json")
print("- mytemplates_complete_en.json")
