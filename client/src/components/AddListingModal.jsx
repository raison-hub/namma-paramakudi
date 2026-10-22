import React, { useState } from 'react';
import axios from 'axios';
import { 
  X, 
  Upload, 
  Trash2, 
  KeyRound, 
  MapPin, 
  Map as MapIcon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { translations } from '../translations';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORY_MAP = {
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
  transit: {
    label: 'Bus, Train & Travel Enquiry',
    subcategories: [
      'New Bus Stand Enquiry',
      'Omni Bus Ticket Booking',
      'Railway Station Auto Stand'
    ]
  }
};

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

export default function AddListingModal({ isOpen, onClose, lang = 'en', onListingAdded }) {
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
    timings: '7:00 AM - 9:00 PM',
    extraDetails: '',
    photoUrl: '',
    postPin: '',
    lat: null,
    lng: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPinPos, setMapPinPos] = useState({ lat: 9.5445, lng: 78.5895 });

  const t = translations[lang] || translations.en;
  if (!isOpen) return null;

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    const firstSub = CATEGORY_MAP[newCat]?.subcategories[0] || '';
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      subCategory: firstSub
    }));
  };

  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        }));
        setMapPinPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationCaptured(true);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not capture location. Please allow location access in your browser.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleConfirmMapPin = () => {
    if (mapPinPos) {
      setFormData((prev) => ({
        ...prev,
        lat: mapPinPos.lat,
        lng: mapPinPos.lng
      }));
      setLocationCaptured(true);
      setShowMapPicker(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert(lang === 'ta' ? 'படத்தின் அளவு 3MB-க்குள் இருக்க வேண்டும்.' : 'Please select an image smaller than 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, photoUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.postPin || formData.postPin.trim().length < 4) {
      alert('Please set a 4-digit PIN (e.g. 5892) to edit or delete later.');
      return;
    }

    const payload = {
      ...formData,
      extraDetails: `${formData.subCategory ? `[${formData.subCategory}] ` : ''}${formData.price ? `(₹${formData.price} -${formData.priceType}) ` : ''}${formData.extraDetails}`
    };

    try {
      setSubmitting(true);
      await axios.post('https://namma-paramakudi-api.vercel.app/api/listings', payload);
      if (onListingAdded) onListingAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {lang === 'ta' ? 'புதிய விளம்பரம் / சேவையை பதிவு செய்க' : 'Post Free Listing / Service'}
            </h3>
            <p className="text-xs text-slate-500">
              List your business, contact, or house rental in Paramakudi.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {/* TITLE */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              NAME / BUSINESS TITLE *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Star Provision & Fancy Store"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* CATEGORY & SUBCATEGORY */}
          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                CATEGORY *
              </label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium text-slate-800"
              >
                {Object.keys(CATEGORY_MAP).map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {CATEGORY_MAP[catKey].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                SUBCATEGORY *
              </label>
              <select
                value={formData.subCategory}
                onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-800 font-medium"
              >
                {CATEGORY_MAP[formData.category]?.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PRICE (₹) & PRICE TYPE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                PRICE (₹) (OPTIONAL)
              </label>
              <input
                type="number"
                placeholder="Optional"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                PRICE TYPE
              </label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
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

          {/* LOCATION / LANDMARK + GPS & MAP PICKER */}
          <div className="space-y-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                LOCATION / LANDMARK (OPTIONAL)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Opposite to Main Post Office"
                value={formData.subArea}
                onChange={(e) => setFormData({ ...formData, subArea: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleFetchCurrentLocation}
                disabled={isLocating}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition text-xs ${
                  locationCaptured 
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>{isLocating ? 'Capturing GPS...' : locationCaptured ? '✓ Live GPS Attached' : 'Attach Live GPS Location'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMapPicker(!showMapPicker)}
                className="py-2 px-3 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-50 text-indigo-700 flex items-center justify-center gap-1.5 font-bold transition text-xs"
              >
                <MapIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span>{showMapPicker ? 'Close Map' : '🗺️ Select Location from Map'}</span>
              </button>
            </div>

            {showMapPicker && (
              <div className="border border-indigo-200 rounded-2xl p-2 bg-indigo-50/30 space-y-2 mt-2">
                <div className="h-44 rounded-xl overflow-hidden border border-slate-200">
                  <MapContainer
                    center={[mapPinPos.lat || 9.5445, mapPinPos.lng || 78.5895]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="w-full h-full"
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                      position={mapPinPos}
                      setPosition={(newPos) => setMapPinPos(newPos)}
                    />
                  </MapContainer>
                </div>
                <div className="flex items-center justify-between text-[11px] px-1">
                  <span className="text-slate-500 font-medium">Tap anywhere on map to drop pin</span>
                  <button
                    type="button"
                    onClick={handleConfirmMapPin}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded-lg transition"
                  >
                    Confirm Pin Location
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PHONE & WHATSAPP */}
          <div className="space-y-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                PHONE NUMBER *
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
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
              <span className="font-semibold text-slate-700">Same number for WhatsApp</span>
            </label>

            {!formData.sameAsPhone && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  WHATSAPP NUMBER
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.whatsappPhone}
                  onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              DESCRIPTION *
            </label>
            <textarea
              rows="3"
              required
              placeholder="Details about timings, items..."
              value={formData.extraDetails}
              onChange={(e) => setFormData({ ...formData, extraDetails: e.target.value })}
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* PHOTOS */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              PHOTOS (1 TO 3 IMAGES)
            </label>

            {!imagePreview ? (
              <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50 transition rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer group">
                <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-full group-hover:scale-110 transition-transform mb-1.5">
                  <Upload className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-800 text-xs">
                  + Add Photo
                </span>
                <span className="text-[10px] text-slate-400">Pick 1 to 3</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-32 group">
                <img
                  src={imagePreview}
                  alt="Selected preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* 4-DIGIT PIN */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-1">
            <label className="block font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>SET A 4-DIGIT PIN (TO EDIT OR DELETE LATER) *</span>
            </label>
            <input
              type="text"
              maxLength="4"
              required
              placeholder="e.g. 5892"
              value={formData.postPin}
              onChange={(e) => setFormData({ ...formData, postPin: e.target.value.replace(/\D/g, '') })}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <p className="text-[10px] text-amber-800 font-medium">
              Save this PIN! You will need it to edit or delete your listing later.
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-black py-3.5 rounded-2xl text-xs transition shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {submitting ? 'Submitting Listing...' : 'Submit Listing →'}
          </button>
        </form>
      </div>
    </div>
  );
}