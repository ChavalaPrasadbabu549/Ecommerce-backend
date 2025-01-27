const mongoose = require('mongoose');

// Define Admin Schema
const VendorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profile_pic: {
      type: String, // URL or path for the profile picture
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email is unique
    },
    password: {
      type: String, // Password should be stored as a hashed string
      required: true,
    },
    role: {
      type: String,
      enum: ['Vendor',], // Optional: Define roles
      required: true,
    },
    status: {
      type: Boolean,
      default: true, // Default status is active
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export Vendors model
const Vendors = mongoose.model('Vendors', VendorSchema);
module.exports = Admin;
