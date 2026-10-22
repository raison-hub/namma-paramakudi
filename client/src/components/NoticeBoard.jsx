import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, 
  ChevronRight, 
  X, 
  PhoneCall,
  Clock
} from 'lucide-react';
import { translations } from '../translations';


const DEFAULT_NOTICES = [
  {
    _id: '1',
    title: 'EB Power Shutdown: Kattuparamakudi & Railway Road',
    titleTa: 'மின் தடை அறிவிப்பு: காட்டுப்பரமக்குடி & ரயில்வே ரோடு',
    category: 'eb',
    description: 'Sub-station maintenance work scheduled from 9:00 AM to 2:00 PM. Power will resume by 2:30 PM.',
    descriptionTa: 'துணை மின்நிலைய மாதாந்திர பராமரிப்பு பணி காரணமாக காலை 9:00 மணி முதல் மதியம் 2:00 மணி வரை மின்சாரம் நிறுத்தப்படும்.',
    dateInfo: 'Tuesday, 9:00 AM - 2:00 PM',
    isUrgent: true,
  },
  {
    _id: '2',
    title: 'Urgent: O+ve Blood Donor Needed at PMK Govt Hospital',
    titleTa: 'அவசரம்: O+ve ரத்ததானம் தேவை - அரசு மருத்துவமனை',
    category: 'blood',
    description: 'Emergency surgery patient requires 2 units of O+ve blood immediately. Please contact hospital coordinator.',
    descriptionTa: 'அவசர அறுவை சிகிச்சைக்கு 2 யூனிட் O+ve ரத்தம் உடனடியாக தேவைப்படுகிறது. தொடர்பு கொள்ளவும்.',
    dateInfo: 'Urgent Today',
    contactPhone: '9443219870',
    isUrgent: true,
  },
  {
    _id: '3',
    title: 'Muthalamman Temple Chithirai Festival Flag Hoisting',
    titleTa: 'முத்தாலம்மன் கோவில் திருவிழா கொடியேற்றம்',
    category: 'event',
    description: 'Grand flag hoisting ceremony and evening deity procession around Perumal Kovil Street.',
    descriptionTa: 'பிரசித்தி பெற்ற முத்தாலம்மன் கோவில் சித்திரை திருவிழா கொடியேற்றம் மற்றும் இரவு சுவாமி வீதி உலா நடைபெறுகிறது.',
    dateInfo: 'Coming Friday 6:00 PM',
    isUrgent: false,
  },
];

export default function NoticeBoard({ lang = 'en' }) {
  const [notices, setNotices] = useState(DEFAULT_NOTICES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/notices`);
        if (res.data && res.data.length > 0) {
          setNotices(res.data);
        }
      } catch (err) {
        
        console.log('Using default notices');
      }
    };
    fetchNotices();
  }, []);

 
  useEffect(() => {
    if (notices.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [notices]);

  const currentNotice = notices[currentIndex] || notices[0];

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'eb':
        return { label: t.ebShutdown || '⚡ EB Shutdown', bg: 'bg-amber-500/10 text-amber-700 border-amber-300' };
      case 'blood':
        return { label: t.bloodNeed || '🩸 Blood Needed', bg: 'bg-red-500/10 text-red-700 border-red-300' };
      case 'event':
        return { label: t.templeEvent || '🛕 Town Event', bg: 'bg-indigo-500/10 text-indigo-700 border-indigo-300' };
      default:
        return { label: '📢 Notice', bg: 'bg-slate-500/10 text-slate-700 border-slate-300' };
    }
  };

  const filteredNotices = filterCategory === 'all' 
    ? notices 
    : notices.filter(n => n.category === filterCategory);

  return (
    <>
      {/* 1. Header Ticker Banner */}
      <div className="bg-amber-100/90 border-b border-amber-300 text-slate-900 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3 text-xs">
          {/* Label Badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0 font-bold text-slate-950 bg-amber-400 px-2.5 py-1 rounded-lg shadow-sm">
            <Bell className="w-3.5 h-3.5 animate-pulse text-slate-950" />
            <span>{t.townNoticeBoard || (lang === 'ta' ? 'ஊர் அறிவிப்பு' : 'Town Bulletin')}</span>
          </div>

          {/* Cycling Ticker Message */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 truncate cursor-pointer hover:underline text-slate-900 flex items-center gap-2"
          >
            {currentNotice.isUrgent && (
              <span className="bg-red-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                {t.urgentTag || (lang === 'ta' ? 'அவசரம்' : 'URGENT')}
              </span>
            )}
            <span className="font-bold truncate">
              {lang === 'ta' && currentNotice.titleTa ? currentNotice.titleTa : currentNotice.title}
            </span>
            <span className="text-slate-600 text-[11px] hidden md:inline">
              — {currentNotice.dateInfo}
            </span>
          </div>

          {/* View All Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-shrink-0 text-amber-900 font-extrabold hover:text-amber-950 flex items-center gap-0.5"
          >
            <span>{t.viewAllNotices || (lang === 'ta' ? 'அனைத்தும்' : 'View All')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Modal of All Town Notices */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">
                    {t.townNoticeBoard || (lang === 'ta' ? 'ஊர் அறிவிப்பு பலகை' : 'Town Bulletin')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'ta' ? 'பரமக்குடி முக்கிய செய்திகள் மற்றும் அவசர தகவல்கள்' : 'Paramakudi Daily Updates & Community Alerts'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-1.5 py-3 border-b border-slate-100 overflow-x-auto text-xs">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  filterCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'ta' ? 'அனைத்தும்' : 'All'}
              </button>
              <button
                onClick={() => setFilterCategory('eb')}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  filterCategory === 'eb'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                {t.ebShutdown || '⚡ EB Shutdown'}
              </button>
              <button
                onClick={() => setFilterCategory('blood')}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  filterCategory === 'blood'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-800 hover:bg-red-100'
                }`}
              >
                {t.bloodNeed || '🩸 Blood Needed'}
              </button>
              <button
                onClick={() => setFilterCategory('event')}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  filterCategory === 'event'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                }`}
              >
                {t.templeEvent || '🛕 Town Events'}
              </button>
            </div>

            {/* List of Notices */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {filteredNotices.map((n) => {
                const badge = getCategoryBadge(n.category);
                return (
                  <div
                    key={n._id}
                    className={`p-4 rounded-2xl border text-xs transition ${
                      n.isUrgent
                        ? 'bg-red-50/50 border-red-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {n.dateInfo}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {lang === 'ta' && n.titleTa ? n.titleTa : n.title}
                    </h4>

                    <p className="text-slate-600 leading-relaxed mb-3">
                      {lang === 'ta' && n.descriptionTa ? n.descriptionTa : n.description}
                    </p>

                    {n.contactPhone && (
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {lang === 'ta' ? 'அவசர தொடர்பு:' : 'Contact:'}
                        </span>
                        <a
                          href={`tel:${n.contactPhone}`}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-xl text-xs transition"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>{n.contactPhone}</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}