import { useEffect, useRef } from "react";

interface AdSpaceProps {
  /**
   * 広告のサイズタイプ
   * - banner: 728x90 (PC) / 320x100 (モバイル)
   * - rectangle: 300x250
   * - large-rectangle: 336x280
   */
  size?: "banner" | "rectangle" | "large-rectangle";
  /**
   * 広告枠のクラス名
   */
  className?: string;
}

/**
 * Google AdSense広告枠コンポーネント
 * 
 * AdSense審査通過前は「広告スペース（準備中）」を表示
 * 審査通過後は、環境変数にAdSenseコードを設定して実際の広告を表示
 */
export function AdSpace({ size = "banner", className = "" }: AdSpaceProps) {
  const adRef = useRef<HTMLDivElement>(null);
  
  // 環境変数からAdSenseクライアントIDを取得
  const adsenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const adsenseSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID;

  useEffect(() => {
    // AdSenseコードが設定されている場合のみ広告を読み込む
    if (adsenseClientId && adsenseSlotId && adRef.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, [adsenseClientId, adsenseSlotId]);

  // サイズに応じたスタイルを設定
  const getSizeStyles = () => {
    switch (size) {
      case "banner":
        return "min-h-[90px] md:min-h-[90px]";
      case "rectangle":
        return "min-h-[250px]";
      case "large-rectangle":
        return "min-h-[280px]";
      default:
        return "min-h-[90px]";
    }
  };

  // AdSenseコードが設定されていない場合はプレースホルダーを表示
  if (!adsenseClientId || !adsenseSlotId) {
    return (
      <div
        className={`${getSizeStyles()} flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg ${className}`}
      >
        <div className="text-center p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            広告スペース（準備中）
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            AdSense審査通過後に広告が表示されます
          </p>
        </div>
      </div>
    );
  }

  // AdSenseコードが設定されている場合は実際の広告を表示
  return (
    <div ref={adRef} className={`${getSizeStyles()} ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseClientId}
        data-ad-slot={adsenseSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
