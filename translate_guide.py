#!/usr/bin/env python3
"""
Guide.tsxの翻訳キーを自動生成するスクリプト
"""

import re
import json

# Guide.tsxから日本語テキストを抽出し、翻訳キーを生成
guide_translations_ja = {
    # ヘッダー
    "guide.header.home": "ホーム",
    "guide.header.myTemplates": "マイテンプレート",
    "guide.header.favorites": "お気に入り",
    
    # タイトル
    "guide.title": "ガイド・チュートリアル",
    "guide.subtitle": "{{title}}の使い方、機能、注意点を詳しく解説します。",
    
    # タブ
    "guide.tabs.overview": "概要",
    "guide.tabs.features": "機能",
    "guide.tabs.tutorial": "使い方",
    "guide.tabs.tips": "注意点・Tips",
    
    # 概要タブ
    "guide.overview.what.title": "{{title}}とは",
    "guide.overview.what.description": "{{title}}は、AI技術を活用して職務経歴書を求人情報に最適化するWebアプリケーションです。あなたの職務経歴書と応募したい求人情報を入力するだけで、AIが求人に最適化された職務要約、志望動機、自己PRなどを自動生成します。",
    "guide.overview.fast.title": "高速生成",
    "guide.overview.fast.description": "AIが数秒で最適化された文書を生成します。",
    "guide.overview.optimized.title": "求人に最適化",
    "guide.overview.optimized.description": "求人情報を分析し、求められるスキルや経験を強調します。",
    "guide.overview.multiple.title": "複数パターン生成",
    "guide.overview.multiple.description": "異なる表現パターンを比較して最適なものを選択できます。",
    "guide.overview.recommended.title": "こんな方におすすめ",
    "guide.overview.recommended.1": "複数の求人に応募する際、それぞれに合わせた職務経歴書を作成したい方",
    "guide.overview.recommended.2": "職務要約や志望動機の書き方に悩んでいる方",
    "guide.overview.recommended.3": "自己PRの表現を改善したい方",
    "guide.overview.recommended.4": "転職活動の効率を上げたい方",
    
    # 機能タブ - 基本機能
    "guide.features.basic.title": "基本機能",
    "guide.features.basic.1.title": "AI文書生成",
    "guide.features.basic.1.description": "職務経歴書と求人情報を入力すると、AIが職務要約、志望動機、自己PR、「なぜ御社か」などの項目を自動生成します。各項目の文字数を指定することも可能です。",
    "guide.features.basic.2.title": "複数パターン生成",
    "guide.features.basic.2.description": "同じ入力から2〜5個の異なる表現パターンを生成し、比較して最適なものを選択できます。各パターンにはAIによる自動評価スコアが表示されます。",
    "guide.features.basic.3.title": "ファイルアップロード対応",
    "guide.features.basic.3.description": "PDF、Word、画像（PNG/JPEG）ファイルをアップロードして、自動的にテキストを抽出できます。画像ファイルの場合はOCR技術を使用してテキストを認識します。",
    "guide.features.basic.4.title": "エクスポート機能",
    "guide.features.basic.4.description": "生成された文書をPDF、Word、テキスト、Markdown形式でダウンロードできます。個別項目のコピーや再生成も可能です。",
    
    # 機能タブ - 高度な機能
    "guide.features.advanced.title": "高度な機能",
    "guide.features.advanced.1.title": "業界別・職種別テンプレート",
    "guide.features.advanced.1.description": "IT、金融、製造、営業、マーケティングなどの業界・職種別テンプレートを使用して、より専門的な文書を生成できます。",
    "guide.features.advanced.2.title": "ユーザー独自テンプレート",
    "guide.features.advanced.2.description": "自分だけのカスタムテンプレートを作成・保存・管理できます。よく使う表現やフォーマットをテンプレート化することで、生成の効率が向上します。",
    "guide.features.advanced.3.title": "お気に入りパターン保存",
    "guide.features.advanced.3.description": "気に入ったパターンをお気に入りに保存し、後で見返したり比較したりできます。複数のお気に入りパターンを並べて比較し、差異をハイライト表示する機能もあります。",
    "guide.features.advanced.4.title": "AI自動評価",
    "guide.features.advanced.4.description": "生成されたパターンを求人情報と照らし合わせて自動評価し、スコアを表示します。スコアが高いパターンほど求人に適合していると判断されます。",
    "guide.features.advanced.5.title": "英語変換機能",
    "guide.features.advanced.5.description": "生成された日本語の職務経歴書を英語に変換できます。英語圏の求人に応募する際に便利です。",
    
    # 機能タブ - API設定
    "guide.features.api.title": "API設定",
    "guide.features.api.description": "このアプリを使用するには、OpenAI、Gemini、またはClaudeのAPIキーが必要です。APIキーは以下の手順で取得できます:",
    "guide.features.api.openai.title": "OpenAI APIキーの取得方法",
    "guide.features.api.openai.step1": "OpenAIの公式サイト（https://platform.openai.com/）にアクセスし、アカウントを作成またはログインします。",
    "guide.features.api.openai.step2": "ダッシュボードから「API Keys」セクションに移動します。",
    "guide.features.api.openai.step3": "「Create new secret key」ボタンをクリックして新しいAPIキーを生成します。",
    "guide.features.api.openai.step4": "生成されたAPIキーをコピーし、このアプリのAPI設定ページに貼り付けます。",
    "guide.features.api.openai.note": "注意: APIキーは一度しか表示されないため、必ず安全な場所に保存してください。",
    "guide.features.api.gemini.title": "Gemini APIキーの取得方法",
    "guide.features.api.gemini.step1": "Google AI Studio（https://makersuite.google.com/app/apikey）にアクセスし、Googleアカウントでログインします。",
    "guide.features.api.gemini.step2": "「Get API Key」ボタンをクリックします。",
    "guide.features.api.gemini.step3": "新しいプロジェクトを作成するか、既存のプロジェクトを選択します。",
    "guide.features.api.gemini.step4": "生成されたAPIキーをコピーし、このアプリのAPI設定ページに貼り付けます。",
    "guide.features.api.claude.title": "Claude APIキーの取得方法",
    "guide.features.api.claude.step1": "Anthropic Console（https://console.anthropic.com/）にアクセスし、アカウントを作成またはログインします。",
    "guide.features.api.claude.step2": "「API Keys」セクションに移動します。",
    "guide.features.api.claude.step3": "「Create Key」ボタンをクリックして新しいAPIキーを生成します。",
    "guide.features.api.claude.step4": "生成されたAPIキーをコピーし、このアプリのAPI設定ページに貼り付けます。",
    "guide.features.api.important.title": "重要な注意事項",
    "guide.features.api.important.1": "APIキーは他人に共有しないでください。悪用される可能性があります。",
    "guide.features.api.important.2": "APIキーを紛失した場合は、すぐに無効化して新しいキーを生成してください。",
    "guide.features.api.important.3": "API使用には料金が発生する場合があります。各プロバイダーの料金体系を確認してください。",
    "guide.features.api.important.4": "このアプリはAPIキーを暗号化してデータベースに保存します。",
    
    # 使い方タブ
    "guide.tutorial.basic.title": "基本的な使い方",
    "guide.tutorial.basic.step1.title": "ログイン",
    "guide.tutorial.basic.step1.description": "Manusアカウントでログインします。",
    "guide.tutorial.basic.step2.title": "API設定",
    "guide.tutorial.basic.step2.description": "ヘッダーの「API設定」ボタンをクリックし、OpenAI、Gemini、またはClaudeのAPIキーを設定します。",
    "guide.tutorial.basic.step3.title": "職務経歴書の入力",
    "guide.tutorial.basic.step3.description": "「職務経歴書」欄にあなたの職務経歴書を入力するか、PDF/Wordファイルをアップロードします。",
    "guide.tutorial.basic.step4.title": "求人情報の入力",
    "guide.tutorial.basic.step4.description": "「求人情報」欄に応募したい求人情報を入力するか、PDF/Word/画像ファイルをアップロードします。",
    "guide.tutorial.basic.step5.title": "出力項目の選択",
    "guide.tutorial.basic.step5.description": "生成したい項目（職務要約、志望動機、自己PR、なぜ御社か）を選択します。カスタム項目を追加することも可能です。",
    "guide.tutorial.basic.step6.title": "文字数の設定",
    "guide.tutorial.basic.step6.description": "各項目の文字数を指定します（オプション）。",
    "guide.tutorial.basic.step7.title": "生成開始",
    "guide.tutorial.basic.step7.description": "「生成」ボタンをクリックして、AIによる文書生成を開始します。",
    "guide.tutorial.basic.step8.title": "結果の確認とダウンロード",
    "guide.tutorial.basic.step8.description": "生成された文書を確認し、必要に応じてコピーやダウンロードを行います。",
    
    "guide.tutorial.advanced.title": "高度な使い方",
    "guide.tutorial.advanced.template.title": "テンプレートの使用",
    "guide.tutorial.advanced.template.description": "業界別・職種別テンプレートを選択すると、より専門的な文書を生成できます。また、マイテンプレートページで独自のテンプレートを作成・管理できます。",
    "guide.tutorial.advanced.multiple.title": "複数パターン生成",
    "guide.tutorial.advanced.multiple.description": "生成ボタンの横にある「複数パターン生成」ボタンをクリックすると、2〜5個の異なる表現パターンを生成できます。各パターンにはAI評価スコアが表示されるため、最適なものを選択できます。",
    "guide.tutorial.advanced.favorite.title": "お気に入りの活用",
    "guide.tutorial.advanced.favorite.description": "気に入ったパターンをお気に入りに保存し、後で見返したり比較したりできます。お気に入りページでは、複数のパターンを並べて比較し、差異をハイライト表示できます。",
    "guide.tutorial.advanced.english.title": "英語変換",
    "guide.tutorial.advanced.english.description": "生成された日本語の文書を英語に変換できます。「英語に変換」ボタンをクリックすると、英語圏の履歴書フォーマットに最適化された英語版が生成されます。",
    
    # 注意点・Tipsタブ
    "guide.tips.notes.title": "注意事項",
    "guide.tips.notes.1.title": "APIキーの管理",
    "guide.tips.notes.1.description": "APIキーは他人に共有しないでください。また、定期的に更新することをおすすめします。",
    "guide.tips.notes.2.title": "API使用料金",
    "guide.tips.notes.2.description": "OpenAI、Gemini、ClaudeのAPIは使用量に応じて料金が発生します。各プロバイダーの料金体系を確認してください。",
    "guide.tips.notes.3.title": "生成内容の確認",
    "guide.tips.notes.3.description": "AIが生成した文書は必ず内容を確認し、必要に応じて修正してください。AIは完璧ではありません。",
    "guide.tips.notes.4.title": "個人情報の取り扱い",
    "guide.tips.notes.4.description": "入力した職務経歴書や求人情報は、AIプロバイダーのAPIに送信されます。機密情報を含む場合は注意してください。",
    
    "guide.tips.effective.title": "効果的な使い方のTips",
    "guide.tips.effective.1.title": "詳細な職務経歴書を入力",
    "guide.tips.effective.1.description": "職務経歴書には、具体的な業務内容、成果、使用したツールやスキルを詳しく記載すると、より質の高い文書が生成されます。",
    "guide.tips.effective.2.title": "求人情報を正確に入力",
    "guide.tips.effective.2.description": "求人情報には、求められるスキル、経験、業務内容を詳しく記載すると、より求人に適合した文書が生成されます。",
    "guide.tips.effective.3.title": "複数パターンを比較",
    "guide.tips.effective.3.description": "複数パターン生成機能を使用して、異なる表現を比較することで、最適な文書を選択できます。",
    "guide.tips.effective.4.title": "テンプレートを活用",
    "guide.tips.effective.4.description": "業界別・職種別テンプレートを使用すると、より専門的な文書を生成できます。また、よく使う表現をマイテンプレートに保存しておくと効率的です。",
    "guide.tips.effective.5.title": "お気に入りを活用",
    "guide.tips.effective.5.description": "気に入ったパターンをお気に入りに保存し、後で見返したり比較したりすることで、より良い文書を作成できます。",
    
    "guide.tips.faq.title": "よくある質問",
    "guide.tips.faq.1.question": "APIキーを設定しないと使えませんか？",
    "guide.tips.faq.1.answer": "はい、このアプリはOpenAI、Gemini、またはClaudeのAPIキーが必要です。APIキーを設定しないとAI機能を使用できません。",
    "guide.tips.faq.2.question": "生成された文書はどこに保存されますか？",
    "guide.tips.faq.2.answer": "生成された文書は履歴として自動的に保存されます。履歴ページで過去の生成結果を確認できます。",
    "guide.tips.faq.3.question": "複数の求人に同時に応募できますか？",
    "guide.tips.faq.3.answer": "現在は1つの求人に対して1つの文書を生成する仕様ですが、今後のアップデートでバッチ一括応募機能を追加予定です。",
    "guide.tips.faq.4.question": "生成された文書を編集できますか？",
    "guide.tips.faq.4.answer": "はい、生成された文書はコピーしてテキストエディタで編集できます。また、個別項目の再生成も可能です。",
    "guide.tips.faq.5.question": "英語の職務経歴書を生成できますか？",
    "guide.tips.faq.5.answer": "はい、英語変換機能を使用して、生成された日本語の文書を英語に変換できます。",
}

# 英語翻訳
guide_translations_en = {
    # ヘッダー
    "guide.header.home": "Home",
    "guide.header.myTemplates": "My Templates",
    "guide.header.favorites": "Favorites",
    
    # タイトル
    "guide.title": "Guide & Tutorial",
    "guide.subtitle": "Learn how to use {{title}}, its features, and important tips.",
    
    # タブ
    "guide.tabs.overview": "Overview",
    "guide.tabs.features": "Features",
    "guide.tabs.tutorial": "How to Use",
    "guide.tabs.tips": "Tips & FAQ",
    
    # 概要タブ
    "guide.overview.what.title": "What is {{title}}?",
    "guide.overview.what.description": "{{title}} is a web application that optimizes your resume to job postings using AI technology. Simply input your resume and the job posting you want to apply for, and AI will automatically generate optimized career summaries, motivation letters, self-PR, and more.",
    "guide.overview.fast.title": "Fast Generation",
    "guide.overview.fast.description": "AI generates optimized documents in seconds.",
    "guide.overview.optimized.title": "Optimized for Jobs",
    "guide.overview.optimized.description": "Analyzes job postings and emphasizes required skills and experience.",
    "guide.overview.multiple.title": "Multiple Pattern Generation",
    "guide.overview.multiple.description": "Compare different expression patterns and select the best one.",
    "guide.overview.recommended.title": "Recommended for",
    "guide.overview.recommended.1": "Those who want to create tailored resumes for multiple job applications",
    "guide.overview.recommended.2": "Those struggling with writing career summaries or motivation letters",
    "guide.overview.recommended.3": "Those wanting to improve self-PR expressions",
    "guide.overview.recommended.4": "Those seeking to improve job search efficiency",
    
    # 機能タブ - 基本機能
    "guide.features.basic.title": "Basic Features",
    "guide.features.basic.1.title": "AI Document Generation",
    "guide.features.basic.1.description": "Input your resume and job posting, and AI will automatically generate career summaries, motivation letters, self-PR, 'Why this company?' sections, and more. You can also specify character limits for each section.",
    "guide.features.basic.2.title": "Multiple Pattern Generation",
    "guide.features.basic.2.description": "Generate 2-5 different expression patterns from the same input and compare them to select the best one. Each pattern includes an AI evaluation score.",
    "guide.features.basic.3.title": "File Upload Support",
    "guide.features.basic.3.description": "Upload PDF, Word, or image (PNG/JPEG) files to automatically extract text. For image files, OCR technology is used to recognize text.",
    "guide.features.basic.4.title": "Export Features",
    "guide.features.basic.4.description": "Download generated documents in PDF, Word, text, or Markdown format. You can also copy or regenerate individual sections.",
    
    # 機能タブ - 高度な機能
    "guide.features.advanced.title": "Advanced Features",
    "guide.features.advanced.1.title": "Industry & Job-Specific Templates",
    "guide.features.advanced.1.description": "Use industry and job-specific templates for IT, finance, manufacturing, sales, marketing, and more to generate more professional documents.",
    "guide.features.advanced.2.title": "Custom User Templates",
    "guide.features.advanced.2.description": "Create, save, and manage your own custom templates. Templating frequently used expressions and formats improves generation efficiency.",
    "guide.features.advanced.3.title": "Favorite Pattern Saving",
    "guide.features.advanced.3.description": "Save favorite patterns to review or compare later. You can also compare multiple favorite patterns side by side with highlighted differences.",
    "guide.features.advanced.4.title": "AI Auto-Evaluation",
    "guide.features.advanced.4.description": "Automatically evaluate generated patterns against job postings and display scores. Higher scores indicate better job fit.",
    "guide.features.advanced.5.title": "English Conversion",
    "guide.features.advanced.5.description": "Convert generated Japanese resumes to English. Useful when applying to English-speaking job markets.",
    
    # 機能タブ - API設定
    "guide.features.api.title": "API Settings",
    "guide.features.api.description": "To use this app, you need an API key for OpenAI, Gemini, or Claude. You can obtain API keys by following these steps:",
    "guide.features.api.openai.title": "How to Get OpenAI API Key",
    "guide.features.api.openai.step1": "Visit the OpenAI official website (https://platform.openai.com/) and create an account or log in.",
    "guide.features.api.openai.step2": "Navigate to the 'API Keys' section from the dashboard.",
    "guide.features.api.openai.step3": "Click the 'Create new secret key' button to generate a new API key.",
    "guide.features.api.openai.step4": "Copy the generated API key and paste it into the API Settings page of this app.",
    "guide.features.api.openai.note": "Note: API keys are only displayed once, so be sure to save them in a secure location.",
    "guide.features.api.gemini.title": "How to Get Gemini API Key",
    "guide.features.api.gemini.step1": "Visit Google AI Studio (https://makersuite.google.com/app/apikey) and log in with your Google account.",
    "guide.features.api.gemini.step2": "Click the 'Get API Key' button.",
    "guide.features.api.gemini.step3": "Create a new project or select an existing one.",
    "guide.features.api.gemini.step4": "Copy the generated API key and paste it into the API Settings page of this app.",
    "guide.features.api.claude.title": "How to Get Claude API Key",
    "guide.features.api.claude.step1": "Visit Anthropic Console (https://console.anthropic.com/) and create an account or log in.",
    "guide.features.api.claude.step2": "Navigate to the 'API Keys' section.",
    "guide.features.api.claude.step3": "Click the 'Create Key' button to generate a new API key.",
    "guide.features.api.claude.step4": "Copy the generated API key and paste it into the API Settings page of this app.",
    "guide.features.api.important.title": "Important Notes",
    "guide.features.api.important.1": "Do not share your API key with others. It could be misused.",
    "guide.features.api.important.2": "If you lose your API key, immediately revoke it and generate a new one.",
    "guide.features.api.important.3": "API usage may incur charges. Check the pricing structure of each provider.",
    "guide.features.api.important.4": "This app encrypts and stores API keys in the database.",
    
    # 使い方タブ
    "guide.tutorial.basic.title": "Basic Usage",
    "guide.tutorial.basic.step1.title": "Login",
    "guide.tutorial.basic.step1.description": "Log in with your Manus account.",
    "guide.tutorial.basic.step2.title": "API Settings",
    "guide.tutorial.basic.step2.description": "Click the 'API Settings' button in the header and set your OpenAI, Gemini, or Claude API key.",
    "guide.tutorial.basic.step3.title": "Input Resume",
    "guide.tutorial.basic.step3.description": "Enter your resume in the 'Resume' field or upload a PDF/Word file.",
    "guide.tutorial.basic.step4.title": "Input Job Posting",
    "guide.tutorial.basic.step4.description": "Enter the job posting you want to apply for in the 'Job Posting' field or upload a PDF/Word/image file.",
    "guide.tutorial.basic.step5.title": "Select Output Items",
    "guide.tutorial.basic.step5.description": "Select the items you want to generate (career summary, motivation letter, self-PR, why this company). You can also add custom items.",
    "guide.tutorial.basic.step6.title": "Set Character Limits",
    "guide.tutorial.basic.step6.description": "Specify character limits for each item (optional).",
    "guide.tutorial.basic.step7.title": "Start Generation",
    "guide.tutorial.basic.step7.description": "Click the 'Generate' button to start AI document generation.",
    "guide.tutorial.basic.step8.title": "Review and Download Results",
    "guide.tutorial.basic.step8.description": "Review the generated documents and copy or download as needed.",
    
    "guide.tutorial.advanced.title": "Advanced Usage",
    "guide.tutorial.advanced.template.title": "Using Templates",
    "guide.tutorial.advanced.template.description": "Select industry or job-specific templates to generate more professional documents. You can also create and manage your own templates on the My Templates page.",
    "guide.tutorial.advanced.multiple.title": "Multiple Pattern Generation",
    "guide.tutorial.advanced.multiple.description": "Click the 'Generate Multiple Patterns' button next to the generate button to create 2-5 different expression patterns. Each pattern includes an AI evaluation score to help you select the best one.",
    "guide.tutorial.advanced.favorite.title": "Using Favorites",
    "guide.tutorial.advanced.favorite.description": "Save favorite patterns to review or compare later. On the Favorites page, you can compare multiple patterns side by side with highlighted differences.",
    "guide.tutorial.advanced.english.title": "English Conversion",
    "guide.tutorial.advanced.english.description": "Convert generated Japanese documents to English. Click the 'Convert to English' button to generate an English version optimized for English-speaking resume formats.",
    
    # 注意点・Tipsタブ
    "guide.tips.notes.title": "Important Notes",
    "guide.tips.notes.1.title": "API Key Management",
    "guide.tips.notes.1.description": "Do not share your API key with others. We also recommend updating it regularly.",
    "guide.tips.notes.2.title": "API Usage Fees",
    "guide.tips.notes.2.description": "OpenAI, Gemini, and Claude APIs charge based on usage. Check each provider's pricing structure.",
    "guide.tips.notes.3.title": "Review Generated Content",
    "guide.tips.notes.3.description": "Always review AI-generated documents and make necessary edits. AI is not perfect.",
    "guide.tips.notes.4.title": "Personal Information Handling",
    "guide.tips.notes.4.description": "Input resumes and job postings are sent to AI provider APIs. Be cautious if they contain confidential information.",
    
    "guide.tips.effective.title": "Tips for Effective Use",
    "guide.tips.effective.1.title": "Input Detailed Resume",
    "guide.tips.effective.1.description": "Include specific job duties, achievements, tools used, and skills in your resume for higher quality document generation.",
    "guide.tips.effective.2.title": "Input Accurate Job Posting",
    "guide.tips.effective.2.description": "Include detailed required skills, experience, and job duties in the job posting for better job-fit documents.",
    "guide.tips.effective.3.title": "Compare Multiple Patterns",
    "guide.tips.effective.3.description": "Use the multiple pattern generation feature to compare different expressions and select the best document.",
    "guide.tips.effective.4.title": "Use Templates",
    "guide.tips.effective.4.description": "Use industry or job-specific templates to generate more professional documents. Save frequently used expressions in My Templates for efficiency.",
    "guide.tips.effective.5.title": "Use Favorites",
    "guide.tips.effective.5.description": "Save favorite patterns to review or compare later for creating better documents.",
    
    "guide.tips.faq.title": "Frequently Asked Questions",
    "guide.tips.faq.1.question": "Can I use this app without setting an API key?",
    "guide.tips.faq.1.answer": "No, this app requires an OpenAI, Gemini, or Claude API key. You cannot use AI features without setting an API key.",
    "guide.tips.faq.2.question": "Where are generated documents saved?",
    "guide.tips.faq.2.answer": "Generated documents are automatically saved as history. You can review past generation results on the History page.",
    "guide.tips.faq.3.question": "Can I apply to multiple jobs simultaneously?",
    "guide.tips.faq.3.answer": "Currently, the app generates one document per job posting, but we plan to add a batch application feature in future updates.",
    "guide.tips.faq.4.question": "Can I edit generated documents?",
    "guide.tips.faq.4.answer": "Yes, you can copy generated documents and edit them in a text editor. You can also regenerate individual sections.",
    "guide.tips.faq.5.question": "Can I generate English resumes?",
    "guide.tips.faq.5.answer": "Yes, you can use the English conversion feature to convert generated Japanese documents to English.",
}

# JSONファイルに保存
with open('/home/ubuntu/resume_optimizer/guide_ja.json', 'w', encoding='utf-8') as f:
    json.dump(guide_translations_ja, f, ensure_ascii=False, indent=2)

with open('/home/ubuntu/resume_optimizer/guide_en.json', 'w', encoding='utf-8') as f:
    json.dump(guide_translations_en, f, ensure_ascii=False, indent=2)

print("翻訳キーをguide_ja.jsonとguide_en.jsonに保存しました。")
print(f"日本語キー数: {len(guide_translations_ja)}")
print(f"英語キー数: {len(guide_translations_en)}")
