import json
import re

# Terms.tsxを読み込み
with open('client/src/pages/Terms.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 翻訳キーのマッピング
terms_ja = {
    "article1": {
        "title": "第1条（適用）",
        "content1": "本利用規約（以下「本規約」といいます）は、{APP_TITLE}（以下「本サービス」といいます）の利用条件を定めるものです。",
        "content2": "本サービスを利用するすべてのユーザー（以下「ユーザー」といいます）は、本規約に同意したものとみなされます。"
    },
    "article2": {
        "title": "第2条（サービスの内容）",
        "content1": "本サービスは、AI技術を活用して職務経歴書の作成を支援するWebアプリケーションです。",
        "content2": "主な機能は以下の通りです。",
        "features": [
            "職務経歴書の自動生成",
            "求人情報に基づく最適化",
            "複数パターンの生成",
            "生成履歴の保存・管理",
            "テンプレートの作成・管理",
            "お気に入りパターンの保存",
            "各種フォーマットでのエクスポート（Word、PDF、テキスト、Markdown）"
        ]
    },
    "article3": {
        "title": "第3条（アカウント）",
        "section1": {
            "title": "1. アカウント登録",
            "content": "本サービスを利用するには、Manus OAuthを使用してログインする必要があります。ログインすることで、アカウントが自動的に作成されます。"
        },
        "section2": {
            "title": "2. アカウント管理",
            "content": "ユーザーは、自己の責任においてアカウント情報を管理するものとします。アカウント情報の不正使用により生じた損害について、当サービスは一切の責任を負いません。"
        },
        "section3": {
            "title": "3. APIキーの管理",
            "content": "本サービスでは、OpenAI、Gemini、またはClaudeのAPIキーを設定する必要があります。APIキーの管理はユーザーの責任において行うものとし、APIキーの不正使用により生じた損害について、当サービスは一切の責任を負いません。"
        }
    },
    "article4": {
        "title": "第4条（禁止事項）",
        "content": "ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。",
        "items": [
            "法令または公序良俗に違反する行為",
            "犯罪行為に関連する行為",
            "本サービスの運営を妨害する行為",
            "他のユーザーまたは第三者の権利を侵害する行為",
            "虚偽の情報を登録する行為",
            "本サービスのセキュリティを脅かす行為",
            "本サービスを商業目的で利用する行為（個人の転職活動を除く）",
            "本サービスのコンテンツを無断で複製、転載、配布する行為",
            "リバースエンジニアリング、逆コンパイル、逆アセンブルする行為",
            "その他、当サービスが不適切と判断する行為"
        ]
    },
    "article5": {
        "title": "第5条（知的財産権）",
        "section1": {
            "title": "1. サービスの知的財産権",
            "content": "本サービスに関する知的財産権は、すべて当サービスまたは当サービスにライセンスを許諾している者に帰属します。"
        },
        "section2": {
            "title": "2. 生成コンテンツの権利",
            "content": "本サービスを使用して生成された職務経歴書などのコンテンツの権利は、ユーザーに帰属します。ユーザーは、生成されたコンテンツを自由に使用、編集、配布することができます。"
        },
        "section3": {
            "title": "3. 入力データの使用",
            "content": "ユーザーが入力したデータは、本サービスの提供および改善のために使用されます。ただし、個人を特定できる情報を第三者に開示することはありません。"
        }
    },
    "article6": {
        "title": "第6条（免責事項）",
        "section1": {
            "title": "1. サービスの品質",
            "content": "当サービスは、本サービスの品質、正確性、完全性、有用性について、いかなる保証も行いません。AI技術を使用しているため、生成される内容が必ずしも正確であるとは限りません。"
        },
        "section2": {
            "title": "2. 利用結果",
            "content": "本サービスを使用して生成された職務経歴書を使用した結果について、当サービスは一切の責任を負いません。ユーザーは、生成された内容を必ず確認し、必要に応じて修正してから使用してください。"
        },
        "section3": {
            "title": "3. サービスの中断・停止",
            "content": "当サービスは、事前の通知なく本サービスの全部または一部を変更、中断、停止することがあります。これにより生じた損害について、当サービスは一切の責任を負いません。"
        },
        "section4": {
            "title": "4. データの損失",
            "content": "システム障害、メンテナンス、その他の理由により、ユーザーのデータが失われる可能性があります。当サービスは、データの損失について一切の責任を負いません。重要なデータは、必ずバックアップを取ってください。"
        },
        "section5": {
            "title": "5. 外部サービス",
            "content": "本サービスは、OpenAI、Gemini、Claudeなどの外部AIサービスを使用しています。これらの外部サービスの品質、可用性、セキュリティについて、当サービスは一切の責任を負いません。"
        }
    },
    "article7": {
        "title": "第7条（サービスの変更・終了）",
        "content1": "当サービスは、ユーザーへの事前の通知なく、本サービスの内容を変更、追加、削除することができます。また、当サービスは、本サービスの提供を終了することができます。",
        "content2": "サービス終了の際は、可能な限り事前に通知するよう努めますが、緊急の場合はこの限りではありません。"
    },
    "article8": {
        "title": "第8条（利用規約の変更）",
        "content1": "当サービスは、必要に応じて本規約を変更することができます。変更後の利用規約は、本ページに掲載した時点で効力を生じるものとします。",
        "content2": "重要な変更がある場合は、本サービス内で通知します。"
    },
    "article9": {
        "title": "第9条（準拠法・管轄裁判所）",
        "content1": "本規約の解釈にあたっては、日本法を準拠法とします。",
        "content2": "本サービスに関して紛争が生じた場合には、当サービスの所在地を管轄する裁判所を専属的合意管轄とします。"
    },
    "footer": {
        "lastUpdated": "最終更新日: 2025年1月26日",
        "copyright": "© 2025 {APP_TITLE}. All rights reserved.",
        "backToHome": "ホームに戻る"
    }
}

terms_en = {
    "article1": {
        "title": "Article 1 (Application)",
        "content1": "These Terms of Service (hereinafter referred to as \"these Terms\") define the terms and conditions for using {APP_TITLE} (hereinafter referred to as \"the Service\").",
        "content2": "All users (hereinafter referred to as \"Users\") who use the Service are deemed to have agreed to these Terms."
    },
    "article2": {
        "title": "Article 2 (Service Content)",
        "content1": "The Service is a web application that assists in creating resumes using AI technology.",
        "content2": "The main features are as follows:",
        "features": [
            "Automatic resume generation",
            "Optimization based on job postings",
            "Multiple pattern generation",
            "Saving and managing generation history",
            "Creating and managing templates",
            "Saving favorite patterns",
            "Export in various formats (Word, PDF, Text, Markdown)"
        ]
    },
    "article3": {
        "title": "Article 3 (Account)",
        "section1": {
            "title": "1. Account Registration",
            "content": "To use the Service, you must log in using Manus OAuth. By logging in, an account is automatically created."
        },
        "section2": {
            "title": "2. Account Management",
            "content": "Users shall manage their account information at their own responsibility. The Service assumes no responsibility for damages caused by unauthorized use of account information."
        },
        "section3": {
            "title": "3. API Key Management",
            "content": "The Service requires setting an API key for OpenAI, Gemini, or Claude. API key management is the user's responsibility, and the Service assumes no responsibility for damages caused by unauthorized use of API keys."
        }
    },
    "article4": {
        "title": "Article 4 (Prohibited Acts)",
        "content": "Users shall not engage in the following acts when using the Service:",
        "items": [
            "Acts that violate laws or public order and morals",
            "Acts related to criminal activities",
            "Acts that interfere with the operation of the Service",
            "Acts that infringe on the rights of other users or third parties",
            "Acts of registering false information",
            "Acts that threaten the security of the Service",
            "Acts of using the Service for commercial purposes (excluding personal job hunting activities)",
            "Acts of reproducing, reprinting, or distributing the Service's content without permission",
            "Acts of reverse engineering, decompiling, or disassembling",
            "Other acts deemed inappropriate by the Service"
        ]
    },
    "article5": {
        "title": "Article 5 (Intellectual Property Rights)",
        "section1": {
            "title": "1. Service Intellectual Property Rights",
            "content": "All intellectual property rights related to the Service belong to the Service or those who have licensed the Service."
        },
        "section2": {
            "title": "2. Generated Content Rights",
            "content": "The rights to content such as resumes generated using the Service belong to the user. Users can freely use, edit, and distribute the generated content."
        },
        "section3": {
            "title": "3. Use of Input Data",
            "content": "Data entered by users is used to provide and improve the Service. However, personally identifiable information will not be disclosed to third parties."
        }
    },
    "article6": {
        "title": "Article 6 (Disclaimer)",
        "section1": {
            "title": "1. Service Quality",
            "content": "The Service makes no warranties regarding the quality, accuracy, completeness, or usefulness of the Service. Since AI technology is used, the generated content is not necessarily accurate."
        },
        "section2": {
            "title": "2. Usage Results",
            "content": "The Service assumes no responsibility for the results of using resumes generated using the Service. Users must review the generated content and make necessary corrections before use."
        },
        "section3": {
            "title": "3. Service Interruption/Suspension",
            "content": "The Service may change, interrupt, or suspend all or part of the Service without prior notice. The Service assumes no responsibility for damages caused by this."
        },
        "section4": {
            "title": "4. Data Loss",
            "content": "User data may be lost due to system failures, maintenance, or other reasons. The Service assumes no responsibility for data loss. Please be sure to back up important data."
        },
        "section5": {
            "title": "5. External Services",
            "content": "The Service uses external AI services such as OpenAI, Gemini, and Claude. The Service assumes no responsibility for the quality, availability, or security of these external services."
        }
    },
    "article7": {
        "title": "Article 7 (Service Changes/Termination)",
        "content1": "The Service may change, add, or delete the content of the Service without prior notice to users. The Service may also terminate the provision of the Service.",
        "content2": "In the event of service termination, we will make efforts to notify in advance as much as possible, but this does not apply in emergency cases."
    },
    "article8": {
        "title": "Article 8 (Changes to Terms of Service)",
        "content1": "The Service may change these Terms as necessary. The revised Terms of Service shall take effect when posted on this page.",
        "content2": "If there are significant changes, we will notify within the Service."
    },
    "article9": {
        "title": "Article 9 (Governing Law/Jurisdiction)",
        "content1": "Japanese law shall govern the interpretation of these Terms.",
        "content2": "In the event of a dispute regarding the Service, the court having jurisdiction over the location of the Service shall have exclusive agreed jurisdiction."
    },
    "footer": {
        "lastUpdated": "Last Updated: January 26, 2025",
        "copyright": "© 2025 {APP_TITLE}. All rights reserved.",
        "backToHome": "Back to Home"
    }
}

# 保存
with open('terms_complete_ja.json', 'w', encoding='utf-8') as f:
    json.dump(terms_ja, f, ensure_ascii=False, indent=2)

with open('terms_complete_en.json', 'w', encoding='utf-8') as f:
    json.dump(terms_en, f, ensure_ascii=False, indent=2)

print("Terms.tsxの完全な翻訳キーを生成しました。")
print("- terms_complete_ja.json")
print("- terms_complete_en.json")
