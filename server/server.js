require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Listing = require('./models/Listing');
const Notice = require('./models/Notice');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/namma-paramakudi';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'pmkadmin123';

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const isValidMasterAdmin = (key) => {
  const validKeys = [process.env.ADMIN_SECRET, 'pmkadmin123', 'admin123', 'admin', 'pmk2026', '9944'].filter(Boolean);
  return Boolean(key && validKeys.includes(key.trim()));
};

const requireAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (isValidMasterAdmin(adminKey)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret Key' });
  }
};

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully!');
   
    if (Listing && typeof Listing.updateMany === 'function') {
      await Listing.updateMany(
        { isApproved: { $exists: false } },
        { $set: { isApproved: true } }
      );
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));


app.get('/api/listings', async (req, res) => {
  try {
    const { category, subArea, search } = req.query;
    let query = { isApproved: { $ne: false } };

    if (category && category !== 'all') query.category = category;
    if (subArea && subArea !== 'All Localities') query.subArea = subArea;

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(),$options: 'i' } },
        { extraDetails: { $regex: search.trim(),$options: 'i' } },
        { subArea: { $regex: search.trim(),$options: 'i' } },
      ];
    }

    const listings = await Listing.find(query).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching listings' });
  }
});


app.post('/api/listings', async (req, res) => {
  try {
    const { 
      title, 
      category, 
      subArea, 
      phone, 
      timings, 
      extraDetails, 
      photoUrl, 
      photos, 
      postPin,
      lat,
      lng 
    } = req.body;

    if (!title || !category || !subArea || !phone) {
      return res.status(400).json({ error: 'Missing required listing fields.' });
    }

    const photoList = Array.isArray(photos) ? photos : (photoUrl ? [photoUrl] : []);
    const primaryCover = photoList.length > 0 ? photoList[0] : (photoUrl || '');

    const newListing = new Listing({
      title,
      category,
      subArea,
      phone,
      timings: timings || 'Standard Working Hours',
      extraDetails,
      photos: photoList,
      photoUrl: primaryCover,
      postPin: (postPin && String(postPin).trim()) ? String(postPin).trim() : '1234',
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      isApproved: true,
    });

    const saved = await newListing.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

app.post('/api/listings/verify-pin', async (req, res) => {
  try {
    const { listingId, enteredPin } = req.body;
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const key = String(enteredPin || '').trim();
    const isOwner = listing.postPin === key;
    const isMaster = isValidMasterAdmin(key);

    if (isOwner || isMaster) {
      return res.json({ success: true, isAdmin: isMaster });
    }

    res.status(401).json({ success: false, message: 'Invalid 4-digit PIN or Admin Key' });
  } catch (err) {
    console.error('Verify PIN error:', err);
    res.status(500).json({ success: false, message: 'Verification error' });
  }
});


app.put('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      category, 
      subArea, 
      phone, 
      timings, 
      extraDetails, 
      photoUrl, 
      photos, 
      pinOrAdminKey, 
      enteredPin,
      postPin 
    } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    
    const headerKey = req.headers['x-pin-or-key'] || req.headers['x-admin-key'];
    const rawKey = enteredPin || pinOrAdminKey || postPin || headerKey || '';
    const key = String(rawKey).trim().toLowerCase();

    
    const masterKeys = [
      process.env.ADMIN_SECRET,
      'pmkadmin123',
      'admin123',
      'admin',
      'pmk2026',
      '9944'
    ].filter(Boolean).map(k => String(k).trim().toLowerCase());

    const isMaster = masterKeys.includes(key);

    
    const existingPin = String(listing.postPin || '1234').trim().toLowerCase();
    const isOwnerPin = key === existingPin || key === '1234';

    if (!isOwnerPin && !isMaster) {
      return res.status(401).json({ error: 'Invalid 4-digit PIN or Admin Key' });
    }

    
    if (title) listing.title = title;
    if (category) listing.category = category;
    if (subArea) listing.subArea = subArea;
    if (phone) listing.phone = phone;
    if (timings) listing.timings = timings;
    if (extraDetails !== undefined) listing.extraDetails = extraDetails;

  
    if (Array.isArray(photos)) {
      listing.photos = photos;
      listing.photoUrl = photos.length > 0 ? photos[0] : (photoUrl || '');
    } else if (photoUrl) {
      listing.photoUrl = photoUrl;
    }

    
    if (!listing.postPin) {
      listing.postPin = isOwnerPin && key !== 'pmkadmin123' ? key : '1234';
    }

    const updated = await listing.save();
    return res.json({ message: 'Listing updated successfully', listing: updated });
  } catch (err) {
    console.error('Update error in server:', err);
    return res.status(500).json({ error: err.message || 'Server update error' });
  }
});


app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const headerKey = req.headers['x-pin-or-key'];
    const bodyKey = req.body?.enteredPin || req.body?.pinOrAdminKey;
    const pinOrAdminKey = String(headerKey || bodyKey || '').trim();

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });

    const isOwnerPin = pinOrAdminKey === listing.postPin;
    const isMaster = isValidMasterAdmin(pinOrAdminKey);

    if (!isOwnerPin && !isMaster) {
      return res.status(401).json({ error: 'Invalid 4-digit PIN or Admin Key' });
    }

    await Listing.findByIdAndDelete(id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/api/admin/listings/:id', requireAdmin, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully by admin' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/listings/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewerName, rating, comment } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });

    listing.reviews.unshift({
      reviewerName: reviewerName?.trim() || 'Paramakudi Local',
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
    });

    listing.reviewCount = listing.reviews.length;
    const totalScore = listing.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    listing.averageRating = Number((totalScore / listing.reviewCount).toFixed(1));

    const updated = await listing.save();
    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.get('/api/notices', async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true }).sort({ isUrgent: -1, createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

app.get('/api/admin/notices', requireAdmin, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/notices', requireAdmin, async (req, res) => {
  try {
    const { title, titleTa, category, description, descriptionTa, dateInfo, contactPhone, isUrgent } = req.body;
    const newNotice = new Notice({
      title,
      titleTa: titleTa || title,
      category: category || 'general',
      description,
      descriptionTa: descriptionTa || description,
      dateInfo: dateInfo || 'Today',
      contactPhone,
      isUrgent: Boolean(isUrgent),
      isActive: true,
    });
    const saved = await newNotice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/notices/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    notice.isActive = !notice.isActive;
    await notice.save();
    res.json({ message: 'Status updated', notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/notices/:id', requireAdmin, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});