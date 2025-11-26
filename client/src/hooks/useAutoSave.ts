import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface AutoSaveData {
  resumeText: string;
  jobDescription: string;
  selectedItems: string[];
  charLimits: Record<string, number>;
  customItems: Array<{ key: string; label: string; charLimit: number }>;
  timestamp: number;
}

const STORAGE_KEY = 'resume_optimizer_autosave';
const AUTOSAVE_DELAY = 2000; // 2秒のデバウンス

export function useAutoSave() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // データを保存
  const saveData = (data: Omit<AutoSaveData, 'timestamp'>) => {
    try {
      const saveData: AutoSaveData = {
        ...data,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      setLastSaved(new Date());
      setIsSaving(false);
    } catch (error) {
      console.error('自動保存に失敗しました:', error);
      toast.error('自動保存に失敗しました');
      setIsSaving(false);
    }
  };

  // デバウンス付きで保存
  const scheduleSave = (data: Omit<AutoSaveData, 'timestamp'>) => {
    setIsSaving(true);
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveData(data);
    }, AUTOSAVE_DELAY);
  };

  // データを読み込み
  const loadData = (): AutoSaveData | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const data = JSON.parse(saved) as AutoSaveData;
      
      // 7日以上古いデータは無視
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (data.timestamp < sevenDaysAgo) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return data;
    } catch (error) {
      console.error('データの読み込みに失敗しました:', error);
      return null;
    }
  };

  // データをクリア
  const clearData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLastSaved(null);
      toast.success('保存データをクリアしました');
    } catch (error) {
      console.error('データのクリアに失敗しました:', error);
      toast.error('データのクリアに失敗しました');
    }
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    scheduleSave,
    loadData,
    clearData,
    lastSaved,
    isSaving,
  };
}
