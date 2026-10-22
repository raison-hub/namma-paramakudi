import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Star, 
  Share2, 
  CheckCircle2,
  Navigation,
  MessageCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import ListingDetailModal from './ListingDetailModal';

const categoryDefaultPhotos = {
  transit: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
  rental: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
  electrician: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
  plumber: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80',
  mechanic: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
  medical: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
  shop: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop&q=80',
  driver: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80',
  emergency: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
  general: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'
};

export default function ListingCard({ item, lang = 'en', onListingUpdated }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const cardPhoto = item.photoUrl || categoryDefaultPhotos[item.category] || categoryDefaultPhotos.general;

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareText = `Check out ${item.title} on Namma Paramakudi!\nPhone: ${item.phone}\nArea: ${item.subArea}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert(lang === 'ta' ? 'விவரம் நகலெடுக்கப்பட்டது!' : 'Details copied to clipboard!');
    }
  };

  const cleanPhone = (item.phone || '').replace(/\D/g, '');
  const waUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
    `Vanakkam ${item.title}, I found your contact on Namma Paramakudi.`
  )}`;

  const directionsUrl = item.lat && item.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${item.title}${item.subArea} Paramakudi`)}`;

  return (
    <>
      <div 
        onClick={() => setIsDetailOpen(true)}
        className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
      >
        {/* IMAGE & BADGE HEADER */}
        <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
          <img
            src={cardPhoto}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              e.target.src = categoryDefaultPhotos.general;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/30" />

          {/* TOP TAGS */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className="bg-slate-950/85 backdrop-blur-md text-amber-400 border border-slate-700/60 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {item.category}
            </span>

            {item.isApproved && (
              <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-emerald-400/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>verified</span>
              </span>
            )}
          </div>

          {/* TOP RIGHT ACTION BUTTONS */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full backdrop-blur-md transition border border-white/10 shadow-sm"
              title="Directions on Google Maps"
            >
              <Navigation className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleShare}
              className="p-2 bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-white rounded-full backdrop-blur-md transition border border-white/10 shadow-sm"
              title="Share Listing"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* BOTTOM OVERLAY INFO: LOCALITY & DISTANCE */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="flex items-center gap-1 font-semibold truncate drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">{item.subArea || 'Paramakudi'}</span>
            </span>

            {item.distanceKm && (
              <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px] shadow">
                {item.distanceKm} km away
              </span>
            )}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-black text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-amber-600 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200/70 text-xs font-bold flex-shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{item.averageRating && item.averageRating > 0 ? item.averageRating : '5.0'}</span>
              </div>
            </div>

            {item.timings && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{item.timings}</span>
              </div>
            )}

            {item.extraDetails && (
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                {item.extraDetails}
              </p>
            )}
          </div>

          {/* ACTION BUTTONS (CALL & WHATSAPP) */}
          <div className="grid grid-cols-2 gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <a
              href={`tel:${item.phone}`}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs font-black bg-slate-950 hover:bg-slate-900 text-amber-400 transition shadow-sm hover:shadow active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm shadow-emerald-600/20 active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL WITH MANDATORY PIN/ADMIN PROTECTION */}
      {isDetailOpen && (
        <ListingDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          listing={item}
          lang={lang}
          onUpdated={onListingUpdated}
        />
      )}
    </>
  );
}