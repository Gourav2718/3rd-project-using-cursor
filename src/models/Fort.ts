import mongoose from 'mongoose';

const FortSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a fort name'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
  },
  district: {
    type: String,
    required: [true, 'Please provide a district'],
    trim: true,
  },
  history: {
    type: String,
    required: [true, 'Please provide historical information'],
  },
  imageUrl: {
    type: String,
    default: '', // Will be populated from Google image search
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Fort || mongoose.model('Fort', FortSchema); 