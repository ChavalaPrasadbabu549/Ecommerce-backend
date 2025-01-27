const mongoose = require('mongoose');

// Define superAdmin Schema
const SuperadminSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
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
            enum: ['Superadmin'], // Optional: Define roles
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

// Create and export superAdmin model
const Superadmin = mongoose.model('Superadmin', SuperadminSchema);
module.exports = Superadmin;
