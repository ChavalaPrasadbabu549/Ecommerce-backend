const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        profile_pic: {
            type: String, // URL or path for the profile picture
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: false, // Optional field
        },
        role: {
            type: String,
            enum: ['User', 'Vendor', 'Superadmin'], // Restrict roles to 'user' or 'admin'
            default: 'User',
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

const User = mongoose.model('User', userSchema); // Use `userSchema` instead of `customerSchema`

module.exports = User;
