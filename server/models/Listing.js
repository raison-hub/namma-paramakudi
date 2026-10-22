const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    category: { 
      type: String, 
      required: true 
    },
    subCategory: { 
      type: String, 
      default: '' 
    },
    price: { 
      type: Number, 
      default: 0 
    },
    priceType: { 
      type: String, 
      default: 'Fixed' 
    },
    subArea: { 
      type: String, 
      required: true,
      trim: true 
    },
    phone: { 
      type: String, 
      required: true,
      trim: true 
    },
    whatsappPhone: { 
      type: String, 
      default: '' 
    },
    extraDetails: { 
      type: String, 
      default: '' 
    },
    photoUrl: { 
      type: String, 
      default: '' 
    },
    photos: { 
      type: [String], 
      default: [] 
    },
    postPin: { 
      type: String, 
      required: true 
    },
    lat: { 
      type: Number, 
      default: null 
    },
    lng: { 
      type: Number, 
      default: null 
    },
    isApproved: { 
      type: Boolean, 
      default: true 
    },
    reviews: [
      {
        reviewerName: { type: String, default: 'Paramakudi Local' },
        rating: { type: Number, required: true },
        comment: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    reviewCount: { 
      type: Number, 
      default: 0 
    },
    averageRating: { 
      type: Number, 
      default: 5.0 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);