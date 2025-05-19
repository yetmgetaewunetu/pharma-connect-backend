const mongoose = require("mongoose");

const PharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: [true, "License is a pre-requisite for a legal pharmacy"],
    trim: true,
  },
  licenseImage: {
    type: String,
    required: [true, "License image should be provided"],
    trim: true,
  },
  pharmacyImage: {
    type: String,
    required: [true, "License image should be provided"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

PharmacySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Pharmacy = mongoose.model("Pharmacy", PharmacySchema);

module.exports = Pharmacy;
