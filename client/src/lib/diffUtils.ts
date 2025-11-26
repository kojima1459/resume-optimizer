/**
 * テキストの差異を検出してハイライト用のセグメントに分割する
 */
export interface DiffSegment {
  text: string;
  type: 'same' | 'different';
}

/**
 * 2つのテキストを比較して差異セグメントを返す
 * 単語単位で比較し、異なる部分をマークする
 */
export function detectDifferences(text1: string, text2: string): {
  segments1: DiffSegment[];
  segments2: DiffSegment[];
} {
  if (!text1 && !text2) {
    return { segments1: [], segments2: [] };
  }

  if (!text1) {
    return {
      segments1: [],
      segments2: [{ text: text2, type: 'different' }],
    };
  }

  if (!text2) {
    return {
      segments1: [{ text: text1, type: 'different' }],
      segments2: [],
    };
  }

  // 文を単語に分割（日本語も考慮）
  const words1 = splitIntoWords(text1);
  const words2 = splitIntoWords(text2);

  // LCS（最長共通部分列）アルゴリズムで共通部分を検出
  const lcs = longestCommonSubsequence(words1, words2);

  // セグメントを構築
  const segments1 = buildSegments(words1, lcs, 0);
  const segments2 = buildSegments(words2, lcs, 1);

  return { segments1, segments2 };
}

/**
 * テキストを単語に分割（日本語と英語の両方に対応）
 */
function splitIntoWords(text: string): string[] {
  const words: string[] = [];
  let currentWord = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    // 日本語文字（ひらがな、カタカナ、漢字）
    const isJapanese =
      (code >= 0x3040 && code <= 0x309f) || // ひらがな
      (code >= 0x30a0 && code <= 0x30ff) || // カタカナ
      (code >= 0x4e00 && code <= 0x9faf); // 漢字

    // 英数字
    const isAlphanumeric = /[a-zA-Z0-9]/.test(char);

    // 空白文字
    const isWhitespace = /\s/.test(char);

    if (isWhitespace) {
      if (currentWord) {
        words.push(currentWord);
        currentWord = '';
      }
      words.push(char);
    } else if (isJapanese) {
      if (currentWord && !/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(currentWord[0])) {
        words.push(currentWord);
        currentWord = '';
      }
      currentWord += char;
    } else if (isAlphanumeric) {
      if (currentWord && !/[a-zA-Z0-9]/.test(currentWord[0])) {
        words.push(currentWord);
        currentWord = '';
      }
      currentWord += char;
    } else {
      if (currentWord) {
        words.push(currentWord);
        currentWord = '';
      }
      words.push(char);
    }
  }

  if (currentWord) {
    words.push(currentWord);
  }

  return words;
}

/**
 * LCS（最長共通部分列）アルゴリズム
 */
function longestCommonSubsequence(arr1: string[], arr2: string[]): number[][] {
  const m = arr1.length;
  const n = arr2.length;
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

/**
 * LCS結果からセグメントを構築
 */
function buildSegments(words: string[], lcs: number[][], index: 0 | 1): DiffSegment[] {
  const segments: DiffSegment[] = [];
  let i = index === 0 ? words.length : lcs[0].length - 1;
  let j = index === 0 ? lcs.length - 1 : words.length;
  let currentSegment: DiffSegment | null = null;

  const addSegment = (word: string, type: 'same' | 'different') => {
    if (currentSegment && currentSegment.type === type) {
      currentSegment.text = word + currentSegment.text;
    } else {
      if (currentSegment) {
        segments.unshift(currentSegment);
      }
      currentSegment = { text: word, type };
    }
  };

  if (index === 0) {
    // words1用
    while (i > 0 || j > 0) {
      if (i === 0) {
        j--;
        continue;
      }
      if (j === 0) {
        addSegment(words[i - 1], 'different');
        i--;
        continue;
      }

      if (lcs[i][j] === lcs[i - 1][j - 1] + 1 && lcs[i][j] > lcs[i - 1][j] && lcs[i][j] > lcs[i][j - 1]) {
        addSegment(words[i - 1], 'same');
        i--;
        j--;
      } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
        addSegment(words[i - 1], 'different');
        i--;
      } else {
        j--;
      }
    }
  } else {
    // words2用
    i = lcs.length - 1;
    j = words.length;
    while (i > 0 || j > 0) {
      if (i === 0) {
        addSegment(words[j - 1], 'different');
        j--;
        continue;
      }
      if (j === 0) {
        i--;
        continue;
      }

      if (lcs[i][j] === lcs[i - 1][j - 1] + 1 && lcs[i][j] > lcs[i - 1][j] && lcs[i][j] > lcs[i][j - 1]) {
        addSegment(words[j - 1], 'same');
        i--;
        j--;
      } else if (lcs[i][j - 1] >= lcs[i - 1][j]) {
        addSegment(words[j - 1], 'different');
        j--;
      } else {
        i--;
      }
    }
  }

  if (currentSegment) {
    segments.unshift(currentSegment);
  }

  return segments;
}

/**
 * 差異率を計算（0-100%）
 */
export function calculateDifferenceRate(text1: string, text2: string): number {
  if (!text1 && !text2) return 0;
  if (!text1 || !text2) return 100;

  const words1 = splitIntoWords(text1);
  const words2 = splitIntoWords(text2);
  const lcs = longestCommonSubsequence(words1, words2);
  const lcsLength = lcs[words1.length][words2.length];
  const maxLength = Math.max(words1.length, words2.length);

  return Math.round(((maxLength - lcsLength) / maxLength) * 100);
}
