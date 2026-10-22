import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  X, 
  ShieldCheck, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Bell, 
  ListFilter, 
  Plus, 
  Lock,
  Edit2,
  Save,
  Undo2,
  MapPin
} from 'lucide-react';

export default function AdminModal({ isOpen, onClose, lang = 'en', onRefresh }) {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');
  
  const [listings, setListings] = useState([]);
  const [editingListingId, setEditingListingId] = useState(null);
  const [editListingForm, setEditListingForm] = useState({
    title: '',
    category: 'shop',
    subArea: '',
    phone: '',
    timings: '',
    extraDetails: '',
    photoUrl: '',
    lat: '',
    lng: ''
  });

  const [notices, setNotices] = useState([]);
  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    titleTa: '',
    category: 'eb',
    description: '',
    descriptionTa: '',
    dateInfo: 'Today',
    contactPhone: '',
    isUrgent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validPasscodes = ['admin123', 'pmkadmin123', 'pmk2026', 'admin'];

  if (!isOpen) return null;

  const authHeader = {
    headers: { 'x-admin-key': 'pmkadmin123' },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validPasscodes.includes(adminKey.trim())) {
      setIsAuthenticated(true);
      setErrorMsg('');
      fetchData();
    } else {
      setErrorMsg('Invalid Admin Passcode');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const [noticesRes, listingsRes] = await Promise.all([
        axios.get('https://namma-paramakudi-api.vercel.app/api/admin/notices', authHeader).catch(() => ({ data: [] })),
        axios.get('https://namma-paramakudi-api.vercel.app/api/listings').catch(() => ({ data: [] })),
      ]);
      setNotices(noticesRes.data || []);
      setListings(listingsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (validPasscodes.includes(adminKey.trim())) {
      fetchData();
    }
  }, []);

  const startEditListing = (item) => {
    setEditingListingId(item._id);
    setEditListingForm({
      title: item.title || '',
      category: item.category || 'shop',
      subArea: item.subArea || '',
      phone: item.phone || '',
      timings: item.timings || '',
      extraDetails: item.extraDetails || '',
      photoUrl: item.photoUrl || '',
      lat: item.lat || '',
      lng: item.lng || ''
    });
  };

  const cancelEditListing = () => {
    setEditingListingId(null);
  };

  const handleSaveListing = async (id) => {
    try {
      setLoading(true);
      await axios.put(`https://namma-paramakudi-api.vercel.app/api/admin/listings/${id}`, editListingForm, authHeader);
      setEditingListingId(null);
      fetchData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to update listing.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return;
    try {
      await axios.delete(`https://namma-paramakudi-api.vercel.app/api/admin/listings/${id}`, authHeader);
      fetchData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to delete listing.');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('https://namma-paramakudi-api.vercel.app/api/admin/notices', noticeForm, authHeader);
      setIsAddingNotice(false);
      setNoticeForm({
        title: '',
        titleTa: '',
        category: 'eb',
        description: '',
        descriptionTa: '',
        dateInfo: 'Today',
        contactPhone: '',
        isUrgent: false,
      });
      fetchData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Failed to post notice.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotice = async (id) => {
    try {
      await axios.patch(`https://namma-paramakudi-api.vercel.app/api/admin/notices/${id}/toggle`, {}, authHeader);
      fetchData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Action failed.');
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try {
      await axios.delete(`https://namma-paramakudi-api.vercel.app/api/admin/notices/${id}`, authHeader);
      fetchData();
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 text-amber-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Admin Control Center</h3>
              <p className="text-xs text-slate-500">Manage Notices, Alerts & Directory Listings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="py-8 space-y-4 max-w-sm mx-auto w-full text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Enter Admin Passcode</h4>
            <p className="text-xs text-slate-500">Authorized local administration only.</p>

            <input
              type="password"
              placeholder="e.g. admin123"
              value={adminKey}
              onChange={(e) => {
                setAdminKey(e.target.value);
                setErrorMsg('');
              }}
              className="w-full text-center text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-amber-400 focus:outline-none"
              autoFocus
            />

            {errorMsg && <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-2.5 rounded-xl text-xs transition shadow-sm"
            >
              Unlock Panel
            </button>
          </form>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden pt-3">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'listings'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  Directory Listings ({listings.length})
                </button>
                <button
                  onClick={() => setActiveTab('notices')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeTab === 'notices'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  Town Notices ({notices.length})
                </button>
              </div>

              {activeTab === 'notices' && (
                <button
                  onClick={() => setIsAddingNotice(!isAddingNotice)}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAddingNotice ? 'Close' : 'New Notice'}
                </button>
              )}
            </div>

            {activeTab === 'listings' && (
              <div className="flex-1 overflow-y-auto py-3 space-y-3">
                {listings.map((item) => {
                  const isEditing = editingListingId === item._id;

                  return (
                    <div
                      key={item._id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs transition"
                    >
                      {isEditing ? (
                        <div className="space-y-2.5 bg-white p-3 rounded-xl border border-amber-300">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                              <input
                                type="text"
                                value={editListingForm.title}
                                onChange={(e) => setEditListingForm({ ...editListingForm, title: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                              <select
                                value={editListingForm.category}
                                onChange={(e) => setEditListingForm({ ...editListingForm, category: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                              >
                                <option value="shop">🛒 Grocery / Shop</option>
                                <option value="mechanic">🏍️ Mechanic</option>
                                <option value="electrician">⚡ Electrician</option>
                                <option value="plumber">🔧 Plumber</option>
                                <option value="driver">🚗 Acting Driver</option>
                                <option value="rental">🏠 House Rental</option>
                                <option value="transit">🚌 Bus & Transit</option>
                                <option value="medical">💊 Medical</option>
                                <option value="emergency">🚨 Emergency</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Locality / Area</label>
                              <input
                                type="text"
                                value={editListingForm.subArea}
                                onChange={(e) => setEditListingForm({ ...editListingForm, subArea: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                              <input
                                type="text"
                                value={editListingForm.phone}
                                onChange={(e) => setEditListingForm({ ...editListingForm, phone: e.target.value })}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                              />
                            </div>
                          </div>

                          {/* EDIT GPS LAT / LNG */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-indigo-600" /> Latitude
                              </label>
                              <input
                                type="number"
                                step="any"
                                placeholder="e.g. 9.5445"
                                value={editListingForm.lat}
                                onChange={(e) => setEditListingForm({ ...editListingForm, lat: e.target.value })}
                                className="w-full p-1.5 border border-slate-200 rounded bg-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Longitude</label>
                              <input
                                type="number"
                                step="any"
                                placeholder="e.g. 78.5895"
                                value={editListingForm.lng}
                                onChange={(e) => setEditListingForm({ ...editListingForm, lng: e.target.value })}
                                className="w-full p-1.5 border border-slate-200 rounded bg-white text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Timings</label>
                            <input
                              type="text"
                              value={editListingForm.timings}
                              onChange={(e) => setEditListingForm({ ...editListingForm, timings: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Details / Description</label>
                            <textarea
                              rows="2"
                              value={editListingForm.extraDetails}
                              onChange={(e) => setEditListingForm({ ...editListingForm, extraDetails: e.target.value })}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs resize-none"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={cancelEditListing}
                              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium flex items-center gap-1"
                            >
                              <Undo2 className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveListing(item._id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="truncate">
                            <p className="font-bold text-slate-900 text-sm truncate">{item.title}</p>
                            <p className="text-slate-500 text-[11px] truncate">
                              {item.category} • {item.subArea} • {item.phone}
                              {item.lat && item.lng ? ` • 📍 GPS: (${item.lat.toFixed(4)}, ${item.lng.toFixed(4)})` : ' • No GPS'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => startEditListing(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                              title="Edit listing details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteListing(item._id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'notices' && (
              <div className="flex-1 overflow-y-auto py-3 space-y-3">
                {isAddingNotice && (
                  <form onSubmit={handleCreateNotice} className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3 text-xs mb-3 shadow-sm">
                    <h5 className="font-bold text-amber-950 text-sm">Publish New Town Announcement</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Title (English)"
                        required
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="தலைப்பு (தமிழ்)"
                        value={noticeForm.titleTa}
                        onChange={(e) => setNoticeForm({ ...noticeForm, titleTa: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={noticeForm.category}
                        onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                      >
                        <option value="eb">⚡ EB Power Cut</option>
                        <option value="blood">🩸 Urgent Blood Request</option>
                        <option value="event">🛕 Temple Festival / Event</option>
                        <option value="general">📢 General News</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Date/Timing (e.g. Tue 9AM-2PM)"
                        value={noticeForm.dateInfo}
                        onChange={(e) => setNoticeForm({ ...noticeForm, dateInfo: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                      />

                      <input
                        type="text"
                        placeholder="Phone (Optional)"
                        value={noticeForm.contactPhone}
                        onChange={(e) => setNoticeForm({ ...noticeForm, contactPhone: e.target.value })}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    <textarea
                      rows="2"
                      placeholder="Detailed Announcement (English)..."
                      required
                      value={noticeForm.description}
                      onChange={(e) => setNoticeForm({ ...noticeForm, description: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none resize-none"
                    />

                    <textarea
                      rows="2"
                      placeholder="முழு விபரம் (தமிழ்)..."
                      value={noticeForm.descriptionTa}
                      onChange={(e) => setNoticeForm({ ...noticeForm, descriptionTa: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none resize-none"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 font-bold text-red-600 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={noticeForm.isUrgent}
                          onChange={(e) => setNoticeForm({ ...noticeForm, isUrgent: e.target.checked })}
                          className="w-4 h-4 rounded text-red-600 focus:ring-red-400"
                        />
                        Mark as Urgent Alert
                      </label>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow-sm"
                      >
                        Publish Notice
                      </button>
                    </div>
                  </form>
                )}

                {notices.map((n) => (
                  <div key={n._id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex-1 truncate">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          n.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {n.isActive ? 'VISIBLE ON APP' : 'HIDDEN'}
                        </span>
                        {n.isUrgent && <span className="bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.2 rounded">URGENT</span>}
                        <span className="text-slate-400 text-[11px]">• {n.dateInfo}</span>
                      </div>
                      <p className="font-bold text-slate-900 truncate">{n.title}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleToggleNotice(n._id)}
                        className={`p-1.5 rounded-xl transition ${
                          n.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-200'
                        }`}
                        title={n.isActive ? 'Hide' : 'Show'}
                      >
                        {n.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={() => handleDeleteNotice(n._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}