const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  titleTa: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['eb', 'blood', 'event', 'alert', 'general'],
    default: 'general',
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  descriptionTa: {
    type: String,
    trim: true,
  },
  dateInfo: {
    type: String, 
    default: 'Today',
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  isUrgent: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notice', noticeSchema);