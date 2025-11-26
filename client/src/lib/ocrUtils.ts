import { createWorker } from 'tesseract.js';

/**
 * 画像ファイルからテキストを抽出する
 * @param file 画像ファイル（PNG, JPEG, etc.）
 * @param onProgress 進捗コールバック（0-1の値）
 * @returns 抽出されたテキスト
 */
export async function extractTextFromImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Tesseract.jsワーカーを作成
  const worker = await createWorker('jpn+eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(m.progress);
      }
    },
  });

  try {
    // 画像からテキストを抽出
    const { data } = await worker.recognize(file);
    return data.text.trim();
  } finally {
    // ワーカーを終了
    await worker.terminate();
  }
}

/**
 * 画像ファイルかどうかを判定
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
