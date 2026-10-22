import React, { useState } from 'react';
import axios from 'axios';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Star, 
  Edit3, 
  Trash2, 
  KeyRound, 
  Upload, 
  ChevronLeft, 
  ChevronRight,
  Clock
} from 'lucide-react';

export default function ListingDetailModal({ isOpen, onClose, listing, lang = 'en', onUpdated }) {
  if (!isOpen || !listing) return null;

  
  const allPhotos = listing.photos && listing.photos.length > 0 
    ? listing.photos 
    : listing.photoUrl 
      ? [listing.photoUrl] 
      : [];

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  
  const [isEditing, setIsEditing] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  
  const [editForm, setEditForm] = useState({
    title: listing.title || '',
    category: listing.category || 'shop',
    subArea: listing.subArea || '',
    phone: listing.phone || '',
    timings: listing.timings || 'Standard Working Hours',
    extraDetails: listing.extraDetails || '',
    photos: allPhotos,
    photoUrl: listing.photoUrl || (allPhotos[0] || '')
  });

  const MAX_PHOTOS = 5;

  const handleVerifyForEdit = () => {
    const key = enteredPin.trim();
    if (!key) {
      setAuthError('Please enter your 4-digit PIN or Admin Key.');
      return;
    }
    setAuthError('');
    setIsEditing(true);
  };

  const handleExecuteDelete = async () => {
    const key = enteredPin.trim();
    if (!key) {
      setAuthError('Please enter your 4-digit PIN or Admin Key to delete.');
      return;
    }

    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;

    try {
      setIsDeleting(true);
      setAuthError('');
      await axios.delete(`https://namma-paramakudi-api.vercel.app/api/listings/${listing._id}`, {
        headers: {
          'x-pin-or-key': key,
          'x-admin-key': key
        },
        data: {
          enteredPin: key,
          pinOrAdminKey: key
        }
      });
      alert('Listing deleted successfully.');
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setAuthError(err.response?.data?.error || 'Invalid PIN or delete failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddEditPhotos = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (editForm.photos.length + files.length > MAX_PHOTOS) {
      alert(`Maximum of ${MAX_PHOTOS} photos allowed.`);
      return;
    }

    files.forEach((file) => {
      if (file.size > 3 * 1024 * 1024) {
        alert(`${file.name} is larger than 3MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => {
          const updated = [...prev.photos, reader.result];
          return {
            ...prev,
            photos: updated,
            photoUrl: updated[0] || ''
          };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveEditPhoto = (idx) => {
    setEditForm((prev) => {
      const updated = prev.photos.filter((_, i) => i !== idx);
      return {
        ...prev,
        photos: updated,
        photoUrl: updated[0] || ''
      };
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const keyToSend = enteredPin.trim();

    if (!keyToSend) {
      setAuthError('Please enter your 4-digit PIN or Admin Key to save changes.');
      return;
    }

    try {
      setIsUpdating(true);
      setAuthError('');

      await axios.put(
        `https://namma-paramakudi-api.vercel.app/api/listings/${listing._id}`,
        {
          ...editForm,
          enteredPin: keyToSend,
          pinOrAdminKey: keyToSend,
          postPin: keyToSend
        },
        {
          headers: {
            'x-pin-or-key': keyToSend,
            'x-admin-key': keyToSend
          }
        }
      );

      alert('Listing updated successfully!');
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      setAuthError(err.response?.data?.error || 'Incorrect PIN or update failed.');
    } finally {
      setIsUpdating(false);
    }
  };

  const cleanPhone = (listing.phone || '').replace(/\D/g, '');
  const waUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(
    `Vanakkam ${listing.title}, I found your contact on Namma Paramakudi.`
  )}`;

  const directionsUrl = listing.lat && listing.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${listing.title}${listing.subArea} Paramakudi`)}`;

  return (
    // Click backdrop to close
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 overflow-y-auto"
    >
      {/* Container to restrict height while hosting the floating close trigger */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 relative mt-6"
      >
        
        {/* FLOATING, ABSOLUTELY UN-SCROLLABLE CLOSE BUTTON */}
        <div className="absolute top-4 right-4 z-50">
          <button 
            type="button"
            onClick={onClose} 
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white border-2 border-white transition-all shadow-lg hover:scale-105 active:scale-95"
            title="Close Ad"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* COMPACT TOP BAR FOR CATEGORIES */}
        <div className="px-4 py-4.5 bg-slate-50/80 border-b border-slate-100 flex items-center pr-16">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              {listing.category}
            </span>
            {listing.isApproved && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {!isEditing ? (
            <>
              {/* PHOTO DISPLAY (FULLY CONTAINED, SIZED TO PREVENT OFF-SCREEN SCROLL) */}
              {allPhotos.length > 0 && (
                <div className="space-y-2">
                  <div className="relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
                    <img 
                      src={allPhotos[activePhotoIdx]} 
                      alt={listing.title} 
                      className="max-h-full max-w-full object-contain transition-all duration-300"
                    />

                    {/* Carousel controls */}
                    {allPhotos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? allPhotos.length - 1 : prev - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition shadow"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePhotoIdx((prev) => (prev === allPhotos.length - 1 ? 0 : prev + 1))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-md transition shadow"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {activePhotoIdx + 1} / {allPhotos.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Previews */}
                  {allPhotos.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                      {allPhotos.map((photo, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActivePhotoIdx(i)}
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 bg-slate-100 transition ${
                            activePhotoIdx === i ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={photo} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* LISTING DETAILS */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{listing.title}</h2>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-black flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{listing.averageRating || '5.0'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>{listing.subArea || 'Paramakudi'}</span>
                </div>

                {listing.timings && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span>{listing.timings}</span>
                  </div>
                )}

                {listing.extraDetails && (
                  <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/70 text-slate-700 text-xs leading-relaxed font-medium">
                    {listing.extraDetails}
                  </div>
                )}
              </div>

              {/* QUICK ACTION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <a
                  href={`tel:${listing.phone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-md shadow-indigo-600/20 active:scale-95"
                >
                  <Phone className="w-4 h-4 text-indigo-200" />
                  <span>Call {listing.phone}</span>
                </a>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black bg-slate-900 hover:bg-slate-800 text-amber-400 transition shadow active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </a>
              </div>

              {/* OWNER & ADMIN CONTROLS */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3 bg-slate-50 p-4 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  <span>Owner & Admin Controls</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    placeholder="Enter 4-digit PIN or Admin Key"
                    value={enteredPin}
                    onChange={(e) => setEnteredPin(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleVerifyForEdit}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit & Photos</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
                {authError && <p className="text-[11px] text-red-600 font-bold">{authError}</p>}
              </div>
            </>
          ) : (
            /* EDIT FORM */
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-sm">Edit Listing & Photos</h3>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Back to Details
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Shop Name</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Locality / Landmark</label>
                  <input
                    type="text"
                    required
                    value={editForm.subArea}
                    onChange={(e) => setEditForm({ ...editForm, subArea: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operating Hours</label>
                <input
                  type="text"
                  placeholder="e.g. 9:00 AM - 9:00 PM"
                  value={editForm.timings}
                  onChange={(e) => setEditForm({ ...editForm, timings: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Details</label>
                <textarea
                  rows="3"
                  required
                  value={editForm.extraDetails}
                  onChange={(e) => setEditForm({ ...editForm, extraDetails: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium resize-none"
                />
              </div>

              {/* MULTI-PHOTO UPLOAD & EDIT */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700 uppercase text-[11px] tracking-wide">
                    Manage Photos ({editForm.photos.length}/{MAX_PHOTOS})
                  </label>
                  <span className="text-[10px] text-slate-400">Add or remove photos</span>
                </div>

                {editForm.photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 mb-3">
                    {editForm.photos.map((photo, idx) => (
                      <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-square group shadow-xs">
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveEditPhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {editForm.photos.length < MAX_PHOTOS && (
                  <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition">
                    <Upload className="w-5 h-5 text-indigo-600 mb-1" />
                    <span className="font-bold text-slate-700 text-xs">+ Add more photos</span>
                    <span className="text-[10px] text-slate-400">Max {MAX_PHOTOS} photos total</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAddEditPhotos}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* PIN CONFIRMATION */}
              <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-3.5 space-y-1">
                <label className="block font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Enter 4-Digit Security PIN to Authorize Update *</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your 4-digit PIN or Admin Key"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {authError && <p className="text-[11px] text-red-600 font-bold">{authError}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl transition shadow-md shadow-indigo-600/20 active:scale-95"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save & Update Listing'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}