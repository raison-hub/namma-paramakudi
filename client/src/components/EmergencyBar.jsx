import React, { useState } from 'react';
import { PhoneCall, ChevronDown, ChevronUp, ShieldAlert, Flame, Zap, HeartPulse } from 'lucide-react';

const EMERGENCY_CONTACTS = [
  {
    nameEn: "Ambulance (Emergency)",
    nameTa: "108 ஆம்புலன்ஸ்",
    phone: "108",
    icon: HeartPulse,
    bg: "bg-red-500",
  },
  {
    nameEn: "Paramakudi Govt Hospital",
    nameTa: "அரசு மருத்துவமனை (GH)",
    phone: "04564222233",
    icon: HeartPulse,
    bg: "bg-rose-600",
  },
  {
    nameEn: "Town Police Station",
    nameTa: "நகர் காவல் நிலையம்",
    phone: "04564222100",
    icon: ShieldAlert,
    bg: "bg-blue-600",
  },
  {
    nameEn: "Fire & Rescue",
    nameTa: "தீயணைப்பு நிலையம்",
    phone: "101",
    icon: Flame,
    bg: "bg-orange-500",
  },
  {
    nameEn: "TNEB Power Complaint",
    nameTa: "மின்துறை புகார் (EB)",
    phone: "9498794987",
    icon: Zap,
    bg: "bg-amber-600",
  },
];

export default function EmergencyBar({ lang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-red-50 border-b border-red-200 text-slate-800 transition">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <span className="text-xs font-bold text-red-800 tracking-wide uppercase">
            {lang === 'ta' ? 'அவசர உதவி எண்கள்' : 'Emergency SOS Helpline'}
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-xs font-semibold text-red-700 hover:text-red-900 transition"
        >
          <span>{isOpen ? (lang === 'ta' ? 'மறைக்க' : 'Hide') : (lang === 'ta' ? 'எண்களைக் காட்டுக' : 'Quick Dial')}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="max-w-6xl mx-auto px-4 pb-3 pt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          {EMERGENCY_CONTACTS.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <a
                key={idx}
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-red-200/80 shadow-xs hover:border-red-400 hover:shadow-sm transition"
              >
                <div className={`${contact.bg} text-white p-1.5 rounded-lg flex-shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                    {lang === 'ta' ? contact.nameTa : contact.nameEn}
                  </p>
                  <p className="text-[10px] text-red-600 font-semibold">{contact.phone}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}