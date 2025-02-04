//Address Model 
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    FullName: {
        type: String,
        required: true,
        trim: true,
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    AltPhoneNumber: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    landmark: {
        type: String,
        required: true,
        trim: true,
    },
    pincode: {
        type: String, 
        required: true
    },
    address_type: {
        type: String,
        enum: ["Home", "Work", "Other"],
        required: true
    },
    default: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Address", addressSchema);
