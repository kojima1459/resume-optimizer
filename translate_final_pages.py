import re
import json

# Privacy.tsx、Terms.tsx、MyTemplates.tsxから日本語テキストを抽出
files = [
    'client/src/pages/Privacy.tsx',
    'client/src/pages/Terms.tsx',
    'client/src/pages/MyTemplates.tsx'
]

# 翻訳キーを格納
privacy_ja = {}
privacy_en = {}
terms_ja = {}
terms_en = {}
mytemplates_ja = {}
mytemplates_en = {}

# Privacy.tsxの翻訳キー
privacy_ja = {
    "title": "プライバシーポリシー",
    "lastUpdated": "最終更新日: 2025年1月26日",
    "intro": {
        "title": "はじめに",
        "text1": "（以下「本サービス」といいます）は、ユーザーの皆様のプライバシーを尊重し、個人情報の保護に努めています。本プライバシーポリシーは、本サービスがどのような情報を収集し、どのように使用・保護するかを説明するものです。",
        "text2": "本サービスを利用することにより、本プライバシーポリシーに同意したものとみなされます。本プライバシーポリシーに同意できない場合は、本サービスの利用をお控えください。"
    },
    "collection": {
        "title": "収集する情報",
        "account": {
            "title": "1. アカウント情報",
            "description": "本サービスでは、Manus OAuth認証を使用してログインします。ログイン時に、Manusアカウントから以下の情報を取得します。",
            "items": ["ユーザーID（OpenID）", "ユーザー名", "メールアドレス", "ログイン方法"]
        },
        "inputData": {
            "title": "2. 入力データ",
            "description": "本サービスの機能を使用する際に、以下の情報を入力していただきます。",
            "items": ["職務経歴書の内容", "求人情報", "カスタム項目の内容", "アップロードされたファイル（PDF、Word、画像）"]
        },
        "generatedData": {
            "title": "3. 生成データ",
            "description": "AIによって生成された以下のデータを保存します。",
            "items": ["職務要約、志望動機、自己PRなどの生成された文書", "生成履歴", "お気に入りに保存されたパターン", "カスタムテンプレート"]
        },
        "apiKey": {
            "title": "4. APIキー",
            "description": "本サービスでは、OpenAIまたはGeminiのAPIキーを設定していただきます。APIキーは暗号化してデータベースに保存され、AI機能の実行時にのみ使用されます。"
        },
        "usageData": {
            "title": "5. 利用状況データ",
            "description": "本サービスの改善のため、以下の利用状況データを収集する場合があります。",
            "items": ["アクセス日時", "使用した機能", "エラーログ"]
        }
    },
    "usage": {
        "title": "情報の使用目的",
        "description": "収集した情報は、以下の目的で使用します。",
        "service": {
            "title": "1. サービスの提供",
            "items": ["AI機能による文書生成", "生成履歴の保存・管理", "テンプレートの保存・管理", "お気に入りパターンの保存・管理"]
        },
        "improvement": {
            "title": "2. サービスの改善",
            "items": ["利用状況の分析", "エラーの検出と修正", "新機能の開発"]
        },
        "support": {
            "title": "3. ユーザーサポート",
            "items": ["問い合わせへの対応", "技術的なサポート"]
        }
    },
    "protection": {
        "title": "情報の保護",
        "description": "本サービスは、ユーザーの個人情報を保護するため、以下の対策を講じています。",
        "encryption": {
            "title": "1. データの暗号化",
            "description": "APIキーなどの機密情報は暗号化してデータベースに保存します。通信はHTTPSで暗号化されます。"
        },
        "accessControl": {
            "title": "2. アクセス制限",
            "description": "ユーザーの個人情報には、本人のみがアクセスできます。他のユーザーや第三者がアクセスすることはできません。"
        },
        "security": {
            "title": "3. セキュリティ対策",
            "description": "不正アクセス、改ざん、漏洩を防ぐため、適切なセキュリティ対策を実施しています。"
        }
    },
    "thirdParty": {
        "title": "第三者への情報提供",
        "description": "本サービスは、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません。",
        "aiProvider": {
            "title": "1. AI APIプロバイダー",
            "description1": "本サービスでは、OpenAIまたはGeminiのAI APIを使用して文書を生成します。入力された職務経歴書や求人情報は、AI APIプロバイダーに送信されます。",
            "description2": "各プロバイダーのプライバシーポリシーをご確認ください。"
        },
        "legal": {
            "title": "2. 法的要請",
            "description": "法令に基づく開示要請があった場合、または裁判所の命令がある場合は、個人情報を開示することがあります。"
        },
        "consent": {
            "title": "3. ユーザーの同意",
            "description": "ユーザーの同意がある場合は、個人情報を第三者に提供することがあります。"
        }
    },
    "retention": {
        "title": "データの保存期間",
        "description": "本サービスは、以下の期間、ユーザーのデータを保存します。",
        "account": {
            "title": "1. アカウント情報",
            "description": "アカウントが削除されるまで保存されます。"
        },
        "generated": {
            "title": "2. 生成データ",
            "description": "ユーザーが削除するまで保存されます。"
        },
        "apiKey": {
            "title": "3. APIキー",
            "description": "ユーザーが削除するまで保存されます。"
        }
    },
    "rights": {
        "title": "ユーザーの権利",
        "description": "ユーザーは、以下の権利を有します。",
        "access": {
            "title": "1. アクセス権",
            "description": "自分の個人情報にアクセスし、確認する権利"
        },
        "correction": {
            "title": "2. 訂正権",
            "description": "個人情報の訂正を求める権利"
        },
        "deletion": {
            "title": "3. 削除権",
            "description": "個人情報の削除を求める権利"
        },
        "portability": {
            "title": "4. データポータビリティ権",
            "description": "個人情報を他のサービスに移行する権利"
        }
    },
    "cookies": {
        "title": "Cookieの使用",
        "description": "本サービスでは、以下の目的でCookieを使用します。",
        "items": ["ログイン状態の維持", "ユーザー設定の保存", "サービスの改善"]
    },
    "changes": {
        "title": "プライバシーポリシーの変更",
        "description": "本プライバシーポリシーは、法令の変更やサービスの改善に伴い、予告なく変更されることがあります。変更後のプライバシーポリシーは、本ページに掲載された時点で効力を生じます。"
    },
    "contact": {
        "title": "お問い合わせ",
        "description": "本プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いします。"
    },
    "nav": {
        "home": "ホーム",
        "guide": "ガイド",
        "myTemplates": "マイテンプレート",
        "favorites": "お気に入り"
    }
}

privacy_en = {
    "title": "Privacy Policy",
    "lastUpdated": "Last Updated: January 26, 2025",
    "intro": {
        "title": "Introduction",
        "text1": "(hereinafter referred to as \"the Service\") respects the privacy of our users and is committed to protecting personal information. This Privacy Policy explains what information the Service collects and how it is used and protected.",
        "text2": "By using the Service, you are deemed to have agreed to this Privacy Policy. If you do not agree with this Privacy Policy, please refrain from using the Service."
    },
    "collection": {
        "title": "Information We Collect",
        "account": {
            "title": "1. Account Information",
            "description": "The Service uses Manus OAuth authentication for login. Upon login, the following information is obtained from your Manus account.",
            "items": ["User ID (OpenID)", "Username", "Email address", "Login method"]
        },
        "inputData": {
            "title": "2. Input Data",
            "description": "When using the Service's features, you will input the following information.",
            "items": ["Resume content", "Job posting information", "Custom item content", "Uploaded files (PDF, Word, images)"]
        },
        "generatedData": {
            "title": "3. Generated Data",
            "description": "The following data generated by AI is saved.",
            "items": ["Generated documents such as career summaries, motivation letters, and self-PR", "Generation history", "Favorite saved patterns", "Custom templates"]
        },
        "apiKey": {
            "title": "4. API Keys",
            "description": "The Service requires you to set an API key for OpenAI or Gemini. API keys are encrypted and stored in the database, and are only used when executing AI functions."
        },
        "usageData": {
            "title": "5. Usage Data",
            "description": "To improve the Service, the following usage data may be collected.",
            "items": ["Access date and time", "Features used", "Error logs"]
        }
    },
    "usage": {
        "title": "Purpose of Information Use",
        "description": "Collected information is used for the following purposes.",
        "service": {
            "title": "1. Service Provision",
            "items": ["Document generation by AI features", "Saving and managing generation history", "Saving and managing templates", "Saving and managing favorite patterns"]
        },
        "improvement": {
            "title": "2. Service Improvement",
            "items": ["Usage analysis", "Error detection and correction", "New feature development"]
        },
        "support": {
            "title": "3. User Support",
            "items": ["Responding to inquiries", "Technical support"]
        }
    },
    "protection": {
        "title": "Information Protection",
        "description": "The Service takes the following measures to protect users' personal information.",
        "encryption": {
            "title": "1. Data Encryption",
            "description": "Sensitive information such as API keys is encrypted and stored in the database. Communications are encrypted with HTTPS."
        },
        "accessControl": {
            "title": "2. Access Control",
            "description": "Only the user can access their personal information. Other users or third parties cannot access it."
        },
        "security": {
            "title": "3. Security Measures",
            "description": "Appropriate security measures are implemented to prevent unauthorized access, tampering, and leakage."
        }
    },
    "thirdParty": {
        "title": "Disclosure to Third Parties",
        "description": "The Service does not provide users' personal information to third parties except in the following cases.",
        "aiProvider": {
            "title": "1. AI API Providers",
            "description1": "The Service uses OpenAI or Gemini AI APIs to generate documents. Entered resumes and job postings are sent to AI API providers.",
            "description2": "Please review each provider's privacy policy."
        },
        "legal": {
            "title": "2. Legal Requests",
            "description": "Personal information may be disclosed if there is a disclosure request based on laws or a court order."
        },
        "consent": {
            "title": "3. User Consent",
            "description": "Personal information may be provided to third parties with user consent."
        }
    },
    "retention": {
        "title": "Data Retention Period",
        "description": "The Service retains user data for the following periods.",
        "account": {
            "title": "1. Account Information",
            "description": "Retained until the account is deleted."
        },
        "generated": {
            "title": "2. Generated Data",
            "description": "Retained until deleted by the user."
        },
        "apiKey": {
            "title": "3. API Keys",
            "description": "Retained until deleted by the user."
        }
    },
    "rights": {
        "title": "User Rights",
        "description": "Users have the following rights.",
        "access": {
            "title": "1. Right to Access",
            "description": "Right to access and review your personal information"
        },
        "correction": {
            "title": "2. Right to Correction",
            "description": "Right to request correction of personal information"
        },
        "deletion": {
            "title": "3. Right to Deletion",
            "description": "Right to request deletion of personal information"
        },
        "portability": {
            "title": "4. Right to Data Portability",
            "description": "Right to transfer personal information to other services"
        }
    },
    "cookies": {
        "title": "Use of Cookies",
        "description": "The Service uses cookies for the following purposes.",
        "items": ["Maintaining login status", "Saving user settings", "Service improvement"]
    },
    "changes": {
        "title": "Changes to Privacy Policy",
        "description": "This Privacy Policy may be changed without notice due to changes in laws or service improvements. The revised Privacy Policy takes effect when posted on this page."
    },
    "contact": {
        "title": "Contact Us",
        "description": "For inquiries regarding this Privacy Policy, please contact us at the following address."
    },
    "nav": {
        "home": "Home",
        "guide": "Guide",
        "myTemplates": "My Templates",
        "favorites": "Favorites"
    }
}

# Terms.tsxの翻訳キー
terms_ja = {
    "title": "利用規約",
    "lastUpdated": "最終更新日: 2025年1月26日",
    "intro": {
        "title": "はじめに",
        "description": "この利用規約（以下「本規約」といいます）は、（以下「本サービス」といいます）の利用条件を定めるものです。本サービスを利用するすべてのユーザー（以下「ユーザー」といいます）は、本規約に同意したものとみなされます。"
    },
    "service": {
        "title": "サービスの内容",
        "description": "本サービスは、AI技術を活用して職務経歴書を求人情報に最適化するWebアプリケーションです。",
        "features": {
            "title": "主な機能",
            "items": [
                "職務経歴書と求人情報の入力",
                "AIによる最適化された文書の生成",
                "複数パターンの生成と比較",
                "生成履歴の保存と管理",
                "お気に入りパターンの保存",
                "カスタムテンプレートの作成"
            ]
        }
    },
    "registration": {
        "title": "アカウント登録",
        "description": "本サービスを利用するには、Manus OAuth認証を使用してログインする必要があります。",
        "requirements": {
            "title": "登録要件",
            "items": [
                "Manusアカウントを持っていること",
                "本規約に同意すること",
                "正確な情報を提供すること"
            ]
        },
        "responsibility": {
            "title": "アカウントの管理",
            "description": "ユーザーは、自身のアカウント情報を適切に管理する責任を負います。アカウント情報の不正使用により生じた損害について、本サービスは一切の責任を負いません。"
        }
    },
    "usage": {
        "title": "サービスの利用",
        "apiKey": {
            "title": "APIキーの設定",
            "description": "本サービスを利用するには、OpenAIまたはGeminiのAPIキーを設定する必要があります。APIキーの取得と管理は、ユーザーの責任で行ってください。"
        },
        "prohibited": {
            "title": "禁止事項",
            "description": "ユーザーは、以下の行為を行ってはなりません。",
            "items": [
                "法令または公序良俗に違反する行為",
                "犯罪行為に関連する行為",
                "本サービスの運営を妨害する行為",
                "他のユーザーや第三者の権利を侵害する行為",
                "虚偽の情報を登録する行為",
                "本サービスを商業目的で利用する行為（個人の転職活動を除く）",
                "本サービスのシステムに不正にアクセスする行為",
                "本サービスのコンテンツを無断で複製、転載、配布する行為"
            ]
        }
    },
    "intellectualProperty": {
        "title": "知的財産権",
        "service": {
            "title": "本サービスの知的財産権",
            "description": "本サービスに関する知的財産権は、本サービスの運営者に帰属します。"
        },
        "generated": {
            "title": "生成されたコンテンツ",
            "description": "AIによって生成されたコンテンツの知的財産権は、ユーザーに帰属します。ただし、生成されたコンテンツの利用により生じた問題について、本サービスは一切の責任を負いません。"
        }
    },
    "disclaimer": {
        "title": "免責事項",
        "items": [
            "本サービスは、AIによって生成されたコンテンツの正確性、完全性、有用性を保証しません。",
            "本サービスの利用により生じた損害について、本サービスは一切の責任を負いません。",
            "本サービスは、予告なく内容の変更や提供の中止を行うことがあります。",
            "本サービスは、外部APIプロバイダー（OpenAI、Gemini）のサービス停止や変更により、サービスを提供できなくなる場合があります。"
        ]
    },
    "termination": {
        "title": "サービスの終了",
        "description": "本サービスは、以下の場合にユーザーのアカウントを停止または削除することがあります。",
        "items": [
            "本規約に違反した場合",
            "長期間サービスを利用していない場合",
            "その他、本サービスの運営上必要と判断した場合"
        ]
    },
    "changes": {
        "title": "利用規約の変更",
        "description": "本規約は、法令の変更やサービスの改善に伴い、予告なく変更されることがあります。変更後の利用規約は、本ページに掲載された時点で効力を生じます。"
    },
    "governing": {
        "title": "準拠法と管轄裁判所",
        "law": "本規約は、日本法に準拠します。",
        "court": "本規約に関する紛争は、本サービスの運営者の所在地を管轄する裁判所を専属的合意管轄裁判所とします。"
    },
    "contact": {
        "title": "お問い合わせ",
        "description": "本規約に関するお問い合わせは、以下の連絡先までお願いします。"
    },
    "nav": {
        "home": "ホーム",
        "guide": "ガイド",
        "myTemplates": "マイテンプレート",
        "favorites": "お気に入り"
    }
}

terms_en = {
    "title": "Terms of Service",
    "lastUpdated": "Last Updated: January 26, 2025",
    "intro": {
        "title": "Introduction",
        "description": "These Terms of Service (hereinafter referred to as \"the Terms\") set forth the conditions for using (hereinafter referred to as \"the Service\"). All users (hereinafter referred to as \"Users\") who use the Service are deemed to have agreed to these Terms."
    },
    "service": {
        "title": "Service Content",
        "description": "The Service is a web application that optimizes resumes to job postings using AI technology.",
        "features": {
            "title": "Main Features",
            "items": [
                "Input resume and job posting information",
                "Generate optimized documents by AI",
                "Generate and compare multiple patterns",
                "Save and manage generation history",
                "Save favorite patterns",
                "Create custom templates"
            ]
        }
    },
    "registration": {
        "title": "Account Registration",
        "description": "To use the Service, you must log in using Manus OAuth authentication.",
        "requirements": {
            "title": "Registration Requirements",
            "items": [
                "Have a Manus account",
                "Agree to these Terms",
                "Provide accurate information"
            ]
        },
        "responsibility": {
            "title": "Account Management",
            "description": "Users are responsible for properly managing their account information. The Service assumes no responsibility for damages caused by unauthorized use of account information."
        }
    },
    "usage": {
        "title": "Service Usage",
        "apiKey": {
            "title": "API Key Setup",
            "description": "To use the Service, you must set an API key for OpenAI or Gemini. Obtaining and managing API keys is the user's responsibility."
        },
        "prohibited": {
            "title": "Prohibited Actions",
            "description": "Users must not engage in the following actions.",
            "items": [
                "Actions that violate laws or public order and morals",
                "Actions related to criminal activity",
                "Actions that interfere with the operation of the Service",
                "Actions that infringe on the rights of other users or third parties",
                "Registering false information",
                "Using the Service for commercial purposes (except for personal job search activities)",
                "Unauthorized access to the Service's systems",
                "Unauthorized reproduction, reposting, or distribution of the Service's content"
            ]
        }
    },
    "intellectualProperty": {
        "title": "Intellectual Property Rights",
        "service": {
            "title": "Intellectual Property Rights of the Service",
            "description": "Intellectual property rights related to the Service belong to the Service operator."
        },
        "generated": {
            "title": "Generated Content",
            "description": "Intellectual property rights of content generated by AI belong to the user. However, the Service assumes no responsibility for problems arising from the use of generated content."
        }
    },
    "disclaimer": {
        "title": "Disclaimer",
        "items": [
            "The Service does not guarantee the accuracy, completeness, or usefulness of content generated by AI.",
            "The Service assumes no responsibility for damages arising from the use of the Service.",
            "The Service may change content or discontinue provision without notice.",
            "The Service may be unable to provide services due to service suspension or changes by external API providers (OpenAI, Gemini)."
        ]
    },
    "termination": {
        "title": "Service Termination",
        "description": "The Service may suspend or delete a user's account in the following cases.",
        "items": [
            "Violation of these Terms",
            "Not using the Service for an extended period",
            "Other cases deemed necessary for the operation of the Service"
        ]
    },
    "changes": {
        "title": "Changes to Terms of Service",
        "description": "These Terms may be changed without notice due to changes in laws or service improvements. The revised Terms take effect when posted on this page."
    },
    "governing": {
        "title": "Governing Law and Jurisdiction",
        "law": "These Terms are governed by Japanese law.",
        "court": "Disputes regarding these Terms shall be subject to the exclusive jurisdiction of the court having jurisdiction over the location of the Service operator."
    },
    "contact": {
        "title": "Contact Us",
        "description": "For inquiries regarding these Terms, please contact us at the following address."
    },
    "nav": {
        "home": "Home",
        "guide": "Guide",
        "myTemplates": "My Templates",
        "favorites": "Favorites"
    }
}

# MyTemplates.tsxの翻訳キー
mytemplates_ja = {
    "title": "マイテンプレート",
    "description": "カスタムテンプレートを作成・管理できます。",
    "createButton": "新規テンプレート作成",
    "noTemplates": "テンプレートがありません",
    "noTemplatesDescription": "新規テンプレートを作成して、よく使う設定を保存しましょう。",
    "edit": "編集",
    "delete": "削除",
    "use": "使用",
    "confirmDelete": "このテンプレートを削除してもよろしいですか？",
    "create": {
        "title": "新規テンプレート作成",
        "nameLabel": "テンプレート名",
        "namePlaceholder": "例: IT業界向けテンプレート",
        "categoryLabel": "カテゴリ",
        "categoryPlaceholder": "例: IT・エンジニア",
        "descriptionLabel": "説明（任意）",
        "descriptionPlaceholder": "このテンプレートの用途を説明してください",
        "outputItemsLabel": "出力項目",
        "charLimitsLabel": "文字数設定",
        "chars": "文字",
        "saveButton": "保存",
        "cancelButton": "キャンセル"
    },
    "edit": {
        "title": "テンプレート編集"
    },
    "toast": {
        "created": "テンプレートを作成しました",
        "updated": "テンプレートを更新しました",
        "deleted": "テンプレートを削除しました",
        "applied": "テンプレートを適用しました"
    },
    "nav": {
        "home": "ホーム",
        "guide": "ガイド",
        "favorites": "お気に入り"
    }
}

mytemplates_en = {
    "title": "My Templates",
    "description": "Create and manage custom templates.",
    "createButton": "Create New Template",
    "noTemplates": "No templates",
    "noTemplatesDescription": "Create a new template to save frequently used settings.",
    "edit": "Edit",
    "delete": "Delete",
    "use": "Use",
    "confirmDelete": "Are you sure you want to delete this template?",
    "create": {
        "title": "Create New Template",
        "nameLabel": "Template Name",
        "namePlaceholder": "e.g., IT Industry Template",
        "categoryLabel": "Category",
        "categoryPlaceholder": "e.g., IT・Engineer",
        "descriptionLabel": "Description (Optional)",
        "descriptionPlaceholder": "Describe the purpose of this template",
        "outputItemsLabel": "Output Items",
        "charLimitsLabel": "Character Settings",
        "chars": "chars",
        "saveButton": "Save",
        "cancelButton": "Cancel"
    },
    "edit": {
        "title": "Edit Template"
    },
    "toast": {
        "created": "Template created",
        "updated": "Template updated",
        "deleted": "Template deleted",
        "applied": "Template applied"
    },
    "nav": {
        "home": "Home",
        "guide": "Guide",
        "favorites": "Favorites"
    }
}

# 保存
with open('privacy_ja.json', 'w', encoding='utf-8') as f:
    json.dump(privacy_ja, f, ensure_ascii=False, indent=2)

with open('privacy_en.json', 'w', encoding='utf-8') as f:
    json.dump(privacy_en, f, ensure_ascii=False, indent=2)

with open('terms_ja.json', 'w', encoding='utf-8') as f:
    json.dump(terms_ja, f, ensure_ascii=False, indent=2)

with open('terms_en.json', 'w', encoding='utf-8') as f:
    json.dump(terms_en, f, ensure_ascii=False, indent=2)

with open('mytemplates_ja.json', 'w', encoding='utf-8') as f:
    json.dump(mytemplates_ja, f, ensure_ascii=False, indent=2)

with open('mytemplates_en.json', 'w', encoding='utf-8') as f:
    json.dump(mytemplates_en, f, ensure_ascii=False, indent=2)

print("翻訳キーを生成しました。")
print("- privacy_ja.json, privacy_en.json")
print("- terms_ja.json, terms_en.json")
print("- mytemplates_ja.json, mytemplates_en.json")
