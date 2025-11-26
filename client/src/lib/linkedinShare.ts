/**
 * LinkedIn シェア機能のユーティリティ関数
 */

export interface ShareStats {
  itemCount: number;
  totalCharCount: number;
  items: string[];
}

/**
 * LinkedInシェア用のテキストを生成
 */
export function generateLinkedInShareText(stats: ShareStats): string {
  const { itemCount, totalCharCount, items } = stats;
  
  const text = `職務経歴書を最適化しました！📝

✅ 最適化した項目: ${itemCount}個
📊 総文字数: ${totalCharCount.toLocaleString()}文字
📋 項目: ${items.join('、')}

AI技術を活用して、求人情報に合わせた職務経歴書を作成しました。
転職活動を効率化したい方におすすめです！

#転職 #職務経歴書 #キャリア #AI活用`;

  return text;
}

/**
 * LinkedInシェアURLを生成
 */
export function generateLinkedInShareUrl(text: string, url?: string): string {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = url ? encodeURIComponent(url) : '';
  
  // LinkedInのシェアURL形式
  // https://www.linkedin.com/sharing/share-offsite/?url={url}
  // テキストは直接URLに含められないため、ユーザーが手動で貼り付ける形式
  if (url) {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  }
  
  // URLがない場合は、LinkedInの投稿作成ページを開く
  return `https://www.linkedin.com/feed/`;
}

/**
 * LinkedInにシェアする
 */
export function shareToLinkedIn(stats: ShareStats, appUrl?: string): void {
  const shareText = generateLinkedInShareText(stats);
  const shareUrl = generateLinkedInShareUrl(shareText, appUrl);
  
  // クリップボードにテキストをコピー
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareText).then(() => {
      console.log('Share text copied to clipboard');
    }).catch((err) => {
      console.error('Failed to copy text:', err);
    });
  }
  
  // LinkedInを新しいタブで開く
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}
