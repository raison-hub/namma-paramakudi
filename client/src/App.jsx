import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://namma-paramakudi-api.vercel.app';
import { 
  Search, 
  MapPin, 
  Plus, 
  Globe, 
  ShieldCheck, 
  ChevronDown, 
  Navigation, 
  LayoutGrid, 
  Map as MapIcon, 
  X, 
  Upload, 
  Trash2, 
  KeyRound,
  CheckCircle2,
  Sparkles,
  Building2,
  PhoneCall,
  SlidersHorizontal,
  Home,
  AlertTriangle,
  Zap
} from 'lucide-react';

import NoticeBoard from './components/NoticeBoard';
import EmergencyBar from './components/EmergencyBar';
import ListingCard from './components/ListingCard';
import DirectoryMapView from './components/DirectoryMapView';
import AdminModal from './components/AdminModal';

const categoryMap = {
  shop: {
    label: 'Shops & Business',
    subcategories: [
      'Grocery / Provision Store',
      'Bakery & Sweets',
      'Clothing & Textiles',
      'Hardware & Electricals',
      'Stationery & Xerox',
      'Restaurant / Mess',
      'Jewellery / Fancy Store'
    ]
  },
  rental: {
    label: 'House Rentals & Real Estate',
    subcategories: [
      '1 BHK House for Rent',
      '2 BHK Independent House',
      '3+ BHK Family House',
      'Commercial Shop / Office Space',
      'Bachelor Room / Hostel',
      'Plot / Land for Sale'
    ]
  },
  driver: {
    label: 'Acting Drivers & Transport',
    subcategories: [
      'Car Acting Driver (Local & Outstation)',
      'Auto Rickshaw Service',
      'Mini Truck / Tata Ace Transport',
      'Tourist Van / Tempo Traveller'
    ]
  },
  electrician: {
    label: 'Electrician & Home Appliances',
    subcategories: [
      'House Wiring & Inverter Setup',
      'AC Service & Installation',
      'Fan / Motor Rewinding',
      'CCTV Camera Installation'
    ]
  },
  plumber: {
    label: 'Plumbing & Water Services',
    subcategories: [
      'Plumbing Repair & Pipe Fitting',
      'Motor & Borewell Pump Works',
      'Overhead Tank Cleaning'
    ]
  },
  mechanic: {
    label: 'Automobile Repair & Mechanics',
    subcategories: [
      'Two-Wheeler / Bike Mechanic',
      'Car Mechanic & Water Wash',
      'Auto-Rickshaw Repair',
      'Puncture & Tyre Works'
    ]
  },
  medical: {
    label: 'Medical, Clinics & Pharmacy',
    subcategories: [
      'Pharmacy / Medical Shop (24x7)',
      'Clinic / General Physician',
      'Dental Clinic',
      'Diagnostic Lab & Blood Testing'
    ]
  },
  Auto_cab: {
    label: 'auto_cab',
    subcategories: [
      'Auto',
      'Cab',
      'Tourist van',
      'Tourist bus'
    ]},
};

const categories = [
  { 
    id: 'all', 
    labelEn: 'All Services', 
    labelTa: 'அனைத்தும்', 
    icon: '✨',
    descEn: 'Full Directory',
    descTa: 'முழு விபரம்',
    bgGradient: 'from-amber-400 to-orange-500',
    lightBg: 'bg-amber-50 border-amber-200 text-amber-900',
  },
  { 
    id: 'emergency', 
    labelEn: 'Emergency', 
    labelTa: 'அவசரம்', 
    icon: '🚨',
    descEn: '108, Police & Fire',
    descTa: 'அவசர உதவி',
    bgGradient: 'from-red-500 to-rose-600',
    lightBg: 'bg-rose-50 border-rose-200 text-rose-900',
  },
  { 
    id: 'driver', 
    labelEn: 'Drivers', 
    labelTa: 'டிரைவர்', 
    icon: '🚗',
    descEn: 'Car & auto hire',
    descTa: 'கார் & ஆட்டோ',
    bgGradient: 'from-emerald-500 to-teal-600',
    lightBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  },
  { 
    id: 'electrician', 
    labelEn: 'Electricians', 
    labelTa: 'மின்சார வல்லுனர்', 
    icon: '⚡',
    descEn: 'Wiring & AC service',
    descTa: 'வயரிங் & ஏசி',
    bgGradient: 'from-amber-400 to-yellow-500',
    lightBg: 'bg-amber-50 border-amber-200 text-amber-900',
  },
  { 
    id: 'plumber', 
    labelEn: 'Plumbers', 
    labelTa: 'பிளம்பர்', 
    icon: '🔧',
    descEn: 'Pipes & motors',
    descTa: 'மோட்டார் & குழாய்',
    bgGradient: 'from-cyan-500 to-sky-600',
    lightBg: 'bg-cyan-50 border-cyan-200 text-cyan-900',
  },
  { 
    id: 'rental', 
    labelEn: 'Rentals', 
    labelTa: 'வாடகை வீடு', 
    icon: '🏠',
    descEn: 'Homes & shops',
    descTa: 'வீடு, கடைகள்',
    bgGradient: 'from-purple-500 to-violet-600',
    lightBg: 'bg-purple-50 border-purple-200 text-purple-900',
  },
  { 
    id: 'mechanic', 
    labelEn: 'Mechanics', 
    labelTa: 'மெக்கானிக்', 
    icon: '🏍️',
    descEn: 'Bike & car repair',
    descTa: 'வாகன பழுது',
    bgGradient: 'from-orange-500 to-red-500',
    lightBg: 'bg-orange-50 border-orange-200 text-orange-900',
  },
  { 
    id: 'medical', 
    labelEn: 'Medical', 
    labelTa: 'மருத்துவம்', 
    icon: '💊',
    descEn: '24x7 Pharmacy',
    descTa: 'மருந்தகம் & பரிசோதனை',
    bgGradient: 'from-pink-500 to-rose-500',
    lightBg: 'bg-pink-50 border-pink-200 text-pink-900',
  },
  { 
    id: 'shop', 
    labelEn: 'Shops', 
    labelTa: 'கடைகள்', 
    icon: '🛍️',
    descEn: 'Provisions & retail',
    descTa: 'மளிகை & அங்காடிகள்',
    bgGradient: 'from-teal-500 to-emerald-600',
    lightBg: 'bg-teal-50 border-teal-200 text-teal-900',
  },
{
    id: 'auto_cab',
    icon: '🚖',
    labelEn: 'Auto & Cab',
    labelTa: 'ஆட்டோ & கேப்',
    descEn: 'Car & auto hire',
    descTa: 'வாடகை ஆட்டோ & கார்',
    bgGradient: 'from-amber-500 to-yellow-600',
    lightBg: 'bg-amber-100 text-amber-800'
  },
];

const localities = [
  'All Localities',
  'Gandhi Nagar',
  'New Bus Stand',
  'Old Bus Stand',
  'Kattuparamakudi',
  'Railway Feeder Road',
  'Five Lamp Corner',
  'Perumal Kovil Street',
  'Maninagar',
  'Hospital Road'
];

const localityCoords = {
  'New Bus Stand': { lat: 9.5445, lng: 78.5895 },
  'Old Bus Stand': { lat: 9.5430, lng: 78.5860 },
  'Railway Feeder Road': { lat: 9.5490, lng: 78.5880 },
  'Gandhi Nagar': { lat: 9.5460, lng: 78.5820 },
  'Kattuparamakudi': { lat: 9.5520, lng: 78.5910 },
  'Five Lamp Corner': { lat: 9.5435, lng: 78.5875 },
  'Perumal Kovil Street': { lat: 9.5410, lng: 78.5840 },
  'Maninagar': { lat: 9.5385, lng: 78.5820 },
  'Hospital Road': { lat: 9.5420, lng: 78.5905 },
};

function calculateHaversineKm(lat1, lon1, lat2, lon2) {
  const r = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((r * c).toFixed(1));
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubArea, setSelectedSubArea] = useState('All Localities');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const [userLocation, setUserLocation] = useState(null);
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [locating, setLocating] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'shop',
    subCategory: 'Grocery / Provision Store',
    price: '',
    priceType: 'Fixed',
    subArea: '',
    phone: '',
    whatsappPhone: '',
    sameAsPhone: true,
    extraDetails: '',
    photos: [],
    photoUrl: '',
    postPin: '',
    lat: null,
    lng: null
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGpsCapturing, setIsGpsCapturing] = useState(false);
  const [gpsCaptured, setGpsCaptured] = useState(false);

  const MAX_PHOTOS = 5;

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedSubArea !== 'All Localities') params.subArea = selectedSubArea;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await axios.get(`${API_BASE_URL}/api/listings`, { params });
      let data = Array.isArray(res.data) ? res.data : [];

      if (userLocation) {
        data = data.map((item) => {
          let itemLat = item.lat;
          let itemLng = item.lng;

          if (!itemLat && localityCoords[item.subArea]) {
            itemLat = localityCoords[item.subArea].lat;
            itemLng = localityCoords[item.subArea].lng;
          }

          if (itemLat && itemLng) {
            const dist = calculateHaversineKm(userLocation.lat, userLocation.lng, itemLat, itemLng);
            return { ...item, distanceKm: dist };
          }
          return { ...item, distanceKm: null };
        });

        if (isNearMeActive) {
          data.sort((a, b) => {
            if (a.distanceKm === null) return 1;
            if (b.distanceKm === null) return -1;
            return a.distanceKm - b.distanceKm;
          });
        }
      }

      setListings(data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedSubArea, searchQuery, userLocation, isNearMeActive]);

  const handleToggleNearMe = () => {
    if (isNearMeActive) {
      setIsNearMeActive(false);
      return;
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsNearMeActive(true);
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert('Please allow location permission in your browser to sort by distance.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCategorySelectChange = (e) => {
    const newCat = e.target.value;
    const firstSub = categoryMap[newCat]?.subcategories[0] || '';
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      subCategory: firstSub
    }));
  };

  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsGpsCapturing(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }));
        setGpsCaptured(true);
        setIsGpsCapturing(false);
      },
      () => {
        setIsGpsCapturing(false);
        alert('Could not get GPS location. Please allow location permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (imagePreviews.length + files.length > MAX_PHOTOS) {
      alert(`You can upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }

    files.forEach((file) => {
      if (file.size > 3 * 1024 * 1024) {
        alert(`${file.name} is larger than 3MB. Please choose smaller images.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => {
          const updated = [...prev, reader.result];
          setFormData((fPrev) => ({
            ...fPrev,
            photos: updated,
            photoUrl: updated[0] || ''
          }));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagePreviews((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      setFormData((fPrev) => ({
        ...fPrev,
        photos: updated,
        photoUrl: updated[0] || ''
      }));
      return updated;
    });
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!formData.postPin || formData.postPin.trim().length < 4) {
      alert('Please set a 4-digit PIN to edit or delete later.');
      return;
    }

    const payload = {
      ...formData,
      extraDetails: `${formData.subCategory ? `[${formData.subCategory}] ` : ''}${formData.price ? `₹${formData.price}${formData.priceType} ` : ''}${formData.extraDetails}`
    };

    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE_URL}/api/listings`, payload);
      setIsAddOpen(false);
      setImagePreviews([]);
      setFormData({
        title: '',
        category: 'shop',
        subCategory: 'Grocery / Provision Store',
        price: '',
        priceType: 'Fixed',
        subArea: '',
        phone: '',
        whatsappPhone: '',
        sameAsPhone: true,
        extraDetails: '',
        photos: [],
        photoUrl: '',
        postPin: '',
        lat: null,
        lng: null
      });
      setGpsCaptured(false);
      fetchListings();
    } catch (err) {
      console.error(err);
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-sans pb-28 md:pb-8 selection:bg-indigo-500 selection:text-white">
      {/* VIBRANT TOP APP HEADER */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-lg shadow-indigo-900/10 border-b border-indigo-700/40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/30 text-base ring-2 ring-white/20">
              NP
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Namma Paramakudi</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-indigo-950 tracking-wide uppercase">
                  Live
                </span>
              </h1>
              <p className="text-[11px] text-indigo-200 font-medium">
                {lang === 'ta' ? 'பரமக்குடியின் நேரடி சேவைகள் மற்றும் தகவல்கள்' : 'The Hyperlocal Pulse of Paramakudi'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 transition border border-white/15 shadow-sm active:scale-95"
            >
              <Globe className="w-4 h-4 text-amber-300" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            <button
              onClick={() => setIsAddOpen(true)}
              className="hidden sm:flex bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black px-4.5 py-2.5 rounded-2xl items-center gap-2 transition shadow-lg shadow-amber-500/25 active:scale-95 ring-2 ring-amber-300/40"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{lang === 'ta' ? 'இலவச பதிவு' : 'Post Free Ad'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* TICKERS & HELP BARS */}
      <div id="town-bulletin-section">
        <NoticeBoard lang={lang} />
      </div>
      <div id="emergency-bar-section">
        <EmergencyBar lang={lang} />
      </div>

      {/* VIBRANT HERO SECTION */}
      <section className="bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-900 text-white pt-10 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 -left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-10 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-3.5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{lang === 'ta' ? 'நம் பரமக்குடியின் டிஜிட்டல் மையம்' : 'Paramakudi Direct Directory'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
            {lang === 'ta' ? (
              <>அனைத்து உள்ளூர் சேவைகளும் <br className="hidden sm:inline" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400">உங்கள் விரல் நுனியில்</span></>
            ) : (
              <>Everything Paramakudi, <br className="hidden sm:inline" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400">Vibrant & Direct.</span></>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-indigo-100/90 max-w-xl mx-auto font-medium leading-relaxed">
            {lang === 'ta'
              ? 'எலக்ட்ரீசியன், பிளம்பர், வாடகை வீடுகள், ஆக்டிங் டிரைவர்கள் மற்றும் உள்ளூர் கடைகள் அனைத்தும் நொடியில்.'
              : 'Find verified electricians, rental homes, on-demand drivers, and local shops directly from community members.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-white shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{listings.length} {lang === 'ta' ? 'சேவைகள் உள்ளன' : 'Verified Listings'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-white shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>9+ {lang === 'ta' ? 'பகுதிகள்' : 'Active Localities'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-white shadow-sm">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-300" />
              <span>{lang === 'ta' ? 'நேரடி தொடர்பு' : 'Instant WhatsApp & Call'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 py-4 flex-1 w-full space-y-7 -mt-10 relative z-20">
        
        {/* FLOATING SEARCH CONSOLE */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 md:p-4 shadow-xl shadow-indigo-950/10 border border-indigo-100">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-indigo-500" />
              <input
                type="text"
                placeholder={lang === 'ta' ? 'எலக்ட்ரீசியன், வாடகை வீடு, கார் டிரைவர், கடைகள் தேடுக...' : 'Search electrician, house rental, driver, clinic, shop...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 text-xs md:text-sm rounded-2xl bg-slate-50 border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium transition"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <div className="relative flex-1 md:w-52">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                <select
                  value={selectedSubArea}
                  onChange={(e) => setSelectedSubArea(e.target.value)}
                  className="w-full pl-9 pr-8 py-3.5 text-xs md:text-sm rounded-2xl bg-slate-50 border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none font-bold text-slate-700 cursor-pointer"
                >
                  {localities.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <button
                onClick={handleToggleNearMe}
                className={`py-3.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition flex-shrink-0 ${
                  isNearMeActive
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-orange-500/25 ring-2 ring-orange-300'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                <Navigation className={`w-3.5 h-3.5 ${isNearMeActive ? 'text-slate-950' : 'text-indigo-600'}`} />
                <span className="hidden sm:inline">{locating ? 'Locating...' : isNearMeActive ? 'Near Me (Active)' : 'Near Me'}</span>
              </button>

              <div className="hidden sm:flex bg-slate-100 p-1 rounded-2xl border border-slate-200 flex-shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl transition ${
                    viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2.5 rounded-xl transition ${
                    viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Map View"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2-ROW VIBRANT CATEGORY CARDS */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black tracking-wider uppercase text-slate-600 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{lang === 'ta' ? 'சேவை பிரிவுகள்' : 'Explore by Category'}</span>
            </h3>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
              >
                {lang === 'ta' ? 'அனைத்தையும் காட்டு' : 'Reset Category'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative p-3.5 rounded-3xl text-left transition-all duration-200 flex flex-col justify-between border ${
                    isSelected
                      ? `bg-gradient-to-br ${cat.bgGradient} text-white shadow-xl shadow-indigo-500/20 scale-[1.03] ring-4 ring-indigo-200 border-transparent`
                      : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform filter drop-shadow">
                      {cat.icon}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white text-slate-900 shadow-sm' : cat.lightBg
                    }`}>
                      {cat.id === 'all' ? listings.length : ''}
                    </span>
                  </div>

                  <div>
                    <h4 className={`text-sm font-black leading-snug line-clamp-1 ${
                      isSelected ? 'text-white' : 'text-slate-900 group-hover:text-indigo-600'
                    }`}>
                      {lang === 'ta' ? cat.labelTa : cat.labelEn}
                    </h4>
                    <p className={`text-[11px] truncate mt-0.5 font-medium ${
                      isSelected ? 'text-white/90' : 'text-slate-500'
                    }`}>
                      {lang === 'ta' ? cat.descTa : cat.descEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FEED / LISTINGS CONTENT */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-indigo-600 font-bold tracking-wide">Fetching verified listings in Paramakudi...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-indigo-100 shadow-sm max-w-md mx-auto my-6 space-y-3.5">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-100 to-orange-100 text-orange-500 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-inner">
              🔍
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Listings Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              We couldn't find matching services in this locality. Try resetting your search filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubArea('All Localities');
                setSearchQuery('');
                setIsNearMeActive(false);
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black px-6 py-3 rounded-2xl transition shadow-lg shadow-indigo-600/25"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'map' ? (
          <DirectoryMapView listings={listings} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((item) => (
              <ListingCard key={item._id} item={item} lang={lang} onListingUpdated={fetchListings} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-slate-900 to-indigo-950 text-indigo-200 text-xs py-10 mt-16 border-t border-indigo-900/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm">Namma Paramakudi</span>
            <span className="text-indigo-400">•</span>
            <span>Ramanathapuram District</span>
          </div>
          <button
            onClick={() => setIsAdminOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-amber-300 px-4 py-2 rounded-2xl flex items-center gap-1.5 font-bold transition border border-white/10 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin Portal</span>
          </button>
        </div>
      </footer>

      {/* FLOATING MOBILE BOTTOM NAVIGATION BAR */}
      <div className="sm:hidden fixed bottom-3 inset-x-3 z-50">
        <div className="bg-indigo-950/90 backdrop-blur-xl border border-indigo-700/50 rounded-3xl shadow-2xl px-3 py-2 flex items-center justify-between text-white">
          <button
            onClick={() => {
              setViewMode('grid');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition ${
              viewMode === 'grid' ? 'text-amber-400 font-black' : 'text-indigo-200 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px]">{lang === 'ta' ? 'முகப்பு' : 'Feed'}</span>
          </button>

          <button
            onClick={() => {
              setViewMode('map');
              const mainElem = document.querySelector('main');
              if (mainElem) mainElem.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition ${
              viewMode === 'map' ? 'text-amber-400 font-black' : 'text-indigo-200 hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span className="text-[10px]">{lang === 'ta' ? 'வரைபடம்' : 'Map'}</span>
          </button>

          <div className="flex-1 flex justify-center -mt-6">
            <button
              onClick={() => setIsAddOpen(true)}
              className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/40 border-3 border-indigo-950 active:scale-95 transition-transform"
              title="Post Ad"
            >
              <Plus className="w-7 h-7 stroke-[3]" />
            </button>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('emergency-bar-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-1 flex-1 py-1 text-rose-300 hover:text-rose-100 transition"
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[10px] font-bold">{lang === 'ta' ? 'அவசரம்' : 'SOS'}</span>
          </button>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex flex-col items-center gap-1 flex-1 py-1 text-indigo-200 hover:text-amber-300 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold">{lang === 'ta' ? 'நிர்வாகம்' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* ADD LISTING MODAL WITH MULTI-PHOTO UPLOAD */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[92vh] flex flex-col border border-indigo-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Post Free Listing</h3>
                <p className="text-xs text-slate-500 font-medium">Reach thousands of residents across Paramakudi</p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wide">
                  Name or Shop Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri Murugan Stores, Senthil Acting Driver"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 focus:bg-white font-medium transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wide">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={handleCategorySelectChange}
                    className="w-full border border-slate-200 rounded-2xl px-3.5 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 focus:bg-white text-slate-800 font-bold cursor-pointer"
                  >
                    {Object.keys(categoryMap).map((catKey) => (
                      <option key={catKey} value={catKey}>{categoryMap[catKey].label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wide">
                    Subcategory *
                  </label>
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full border border-slate-200 rounded-2xl px-3.5 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 focus:bg-white text-slate-800 font-bold cursor-pointer"
                  >
                    {categoryMap[formData.category]?.subcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wide">
                    Price in ₹ (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500, 6500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 focus:bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wide">
                    Price Type
                  </label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full border border-slate-200 rounded-2xl px-3.5 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 focus:bg-white font-bold cursor-pointer"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Negotiable">Negotiable</option>
                    <option value="Per Month">Per Month</option>
                    <option value="Per Day">Per Day</option>
                    <option value="Per Hour">Per Hour</option>
                    <option value="Starts From">Starts From</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wide">
                  Locality / Landmark *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gandhi Nagar, near New Bus Stand"
                  value={formData.subArea}
                  onChange={(e) => setFormData({ ...formData, subArea: e.target.value })}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 focus:bg-white font-medium mb-2"
                />

                <button
                  type="button"
                  onClick={handleCaptureGps}
                  disabled={isGpsCapturing}
                  className={`w-full py-3 px-3 rounded-2xl border flex items-center justify-center gap-2 font-bold transition text-xs ${
                    gpsCaptured 
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800' 
                      : 'border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-indigo-700'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span>{isGpsCapturing ? 'Capturing device GPS...' : gpsCaptured ? 'Live GPS Location Attached' : 'Attach Live GPS Location'}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10 digit mobile number"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        phone: val,
                        whatsappPhone: prev.sameAsPhone ? val : prev.whatsappPhone
                      }));
                    }}
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 focus:bg-white font-medium"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.sameAsPhone}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        sameAsPhone: checked,
                        whatsappPhone: checked ? prev.phone : ''
                      }));
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-slate-700 text-xs">Same number for WhatsApp</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[11px] tracking-wide">
                  Description and Details *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Explain what you offer, timings, items, charges..."
                  value={formData.extraDetails}
                  onChange={(e) => setFormData({ ...formData, extraDetails: e.target.value })}
                  className="w-full border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 focus:bg-white resize-none font-medium"
                />
              </div>

              {/* MULTI-PHOTO UPLOAD SECTION */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700 uppercase text-[11px] tracking-wide">
                    Photos ({imagePreviews.length}/{MAX_PHOTOS})
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Max {MAX_PHOTOS} photos, up to 3MB each</span>
                </div>

                {/* THUMBNAIL PREVIEWS GRID */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden border border-indigo-100 aspect-square group shadow-sm">
                        <img src={preview} alt={`upload-${idx}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* UPLOAD BUTTON */}
                {imagePreviews.length < MAX_PHOTOS && (
                  <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/80 transition rounded-3xl p-4 flex flex-col items-center justify-center cursor-pointer group">
                    <div className="p-2.5 bg-white text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform shadow-sm mb-1.5">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-800 text-xs">
                      {imagePreviews.length === 0 ? 'Add photos from camera or gallery' : '+ Add more photos'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">PNG, JPG up to 3MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-4 space-y-1.5">
                <label className="block font-black text-amber-950 text-xs flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Set 4-Digit Security PIN *</span>
                </label>
                <input
                  type="text"
                  maxLength="4"
                  required
                  placeholder="e.g. 5892"
                  value={formData.postPin}
                  onChange={(e) => setFormData({ ...formData, postPin: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-white border border-amber-300 rounded-2xl px-4 py-2.5 text-xs font-black tracking-widest text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <p className="text-[10px] text-amber-800 font-medium">
                  Remember this PIN. Only someone with this PIN can edit or remove this post later.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white font-black py-4 rounded-2xl text-xs transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing Listing...' : 'Publish Listing'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PORTAL MODAL */}
      {isAdminOpen && (
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          lang={lang}
          onRefresh={fetchListings}
        />
      )}
    </div>
  );
}