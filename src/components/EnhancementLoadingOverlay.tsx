import { useEffect, useState } from "react";

type EnhancementLoadingOverlayProps = {
  visible: boolean;
};

export function EnhancementLoadingOverlay({ visible }: EnhancementLoadingOverlayProps) {
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      return;
    }

    const timeoutId = window.setTimeout(() => setShouldRender(false), 220);
    return () => window.clearTimeout(timeoutId);
  }, [visible]);

  if (!shouldRender && !visible) {
    return null;
  }

  return (
    <div
      className={`enhance-loading-overlay${visible ? " enhance-loading-overlay--visible" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={visible}
      aria-label="Loading"
    >
      <div className="enhance-loading-backdrop" aria-hidden />
      <div className="enhance-loading-center">
        <div className="enhance-loading-spinner" aria-hidden />
      </div>
    </div>
  );
}
