import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPwaPrompt({ lang = 'en' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsStandalone(true);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.deferredPwaPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPwaPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setIsDismissed(true);
      }
      setDeferredPrompt(null);
      window.deferredPwaPrompt = null;
    } else {
      alert(
        lang === 'ta'
          ? 'இந்த செயலியை நிறுவ, உங்கள் உலாவியின் முகவரிப் பட்டியில் (Address bar) உள்ள Install ஐகானை கிளிக் செய்யவும் அல்லது மொபைலில் Chrome மெனுவில் "Add to Home screen" என்பதைத் தேர்ந்தெடுக்கவும்.'
          : 'To install, click the Install icon in your browser address bar, or tap "Add to Home screen" from your browser menu.'
      );
    }
  };

  if (isStandalone || isDismissed) return null;

  return (
    <aside
      aria-label="Install App Prompt"
      className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-400/40 flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm flex-shrink-0 shadow-md">
          PMK
        </div>
        <div>
          <p className="font-bold text-xs text-white">
            {lang === 'ta' ? 'நம்ம பரமக்குடி ஆப்' : 'Install Namma PMK'}
          </p>
          <p className="text-[11px] text-slate-400">
            {lang === 'ta' ? 'முகப்புத் திரையில் நிறுவவும்' : 'Add to home screen'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          {lang === 'ta' ? 'நிறுவு' : 'Install'}
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          aria-label="Close install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}