import { Check, Copy, Download, QrCode, Share2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

type Props = {
  onClose: () => void;
  url?: string;
};

export default function AppShareMenu({ onClose, url }: Props) {
  const currentUrl =
    url ?? (typeof window !== "undefined" ? window.location.href : "");
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [installed, setInstalled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKey);
    }, 50);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const installPwa = async () => {
    if (!deferredPrompt) return;
    const prompt = deferredPrompt as unknown as {
      prompt: () => void;
      userChoice: Promise<{ outcome: string }>;
    };
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-72 bg-[oklch(0.13_0.015_62)] border border-primary/20 rounded-2xl shadow-2xl z-[150] overflow-hidden"
      data-ocid="app_share.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/15">
        <div className="flex items-center gap-2">
          <Share2 size={15} className="text-primary" />
          <span className="text-sm font-bold text-foreground font-serif">
            Share this App
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          aria-label="Close share menu"
          data-ocid="app_share.close_button"
        >
          <X size={14} />
        </button>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center py-5 px-4 bg-white/[0.02]">
        <div className="p-3 bg-white rounded-xl shadow-inner">
          <QRCodeSVG
            value={currentUrl}
            size={140}
            bgColor="#ffffff"
            fgColor="#06090f"
            level="M"
          />
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground text-center max-w-[200px] leading-relaxed">
          Scan to open this app
        </p>
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2 border-t border-primary/10">
        {/* Copy link */}
        <button
          type="button"
          onClick={copyLink}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-sm ${
            copied
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-muted/20 border-border/30 text-foreground hover:bg-primary/10 hover:border-primary/30"
          }`}
          data-ocid="app_share.copy_link_button"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        {/* PWA Install */}
        {(deferredPrompt || installed) && (
          <button
            type="button"
            onClick={installPwa}
            disabled={installed}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-sm ${
              installed
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-primary/10 border-primary/30 text-primary hover:bg-primary/15"
            }`}
            data-ocid="app_share.install_button"
          >
            <Download size={15} />
            <span>{installed ? "App Installed!" : "Install App"}</span>
          </button>
        )}

        {/* QR label */}
        <div className="flex items-center gap-2 px-1 pt-1">
          <QrCode size={12} className="text-muted-foreground/50" />
          <p className="text-[10px] text-muted-foreground/50 truncate">
            {currentUrl}
          </p>
        </div>
      </div>
    </div>
  );
}
