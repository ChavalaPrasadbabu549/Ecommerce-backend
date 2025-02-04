const Address = require("../models/Address");

const AddressController = {
    //  Add Address
    async addAddress(req, res) {
        try {
            const userId = req.user.id; // Extract authenticated user ID

            const { FullName, PhoneNumber, AltPhoneNumber, country, state, city, landmark, pincode, address_type } = req.body;

            // Validate required fields
            if (!FullName || !PhoneNumber || !AltPhoneNumber || !country || !state || !city || !pincode || !address_type) {
                return res.status(400).json({ success: false, message: "All required fields must be provided." });
            }

            // Create and save address
            const newAddress = new Address({ user_id: userId, FullName, PhoneNumber, AltPhoneNumber, country, state, city, landmark, pincode, address_type, });
            await newAddress.save();

            return res.status(201).json({ success: true, message: "Address added successfully", data: newAddress });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
        /**
        #swagger.tags = ['Address']
        */
    },
    // Edit Address
    async editAddress(req, res) {
        try {
            const userId = req.user.id;
            const { FullName, PhoneNumber, AltPhoneNumber, country, state, city, landmark, pincode, address_type, address_id } = req.body;

            // Find the address
            const address = await Address.findOne({ _id: address_id, user_id: userId });
            if (!address) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }

            // Update fields only if they are provided
            if (FullName) address.FullName = FullName;
            if (PhoneNumber) address.PhoneNumber = PhoneNumber;
            if (AltPhoneNumber) address.AltPhoneNumber = AltPhoneNumber;
            if (country) address.country = country;
            if (state) address.state = state;
            if (city) address.city = city;
            if (landmark) address.landmark = landmark;
            if (pincode) address.pincode = pincode;
            if (address_type) address.address_type = address_type;

            // Save the updated address
            const updatedAddress = await address.save();

            return res.status(200).json({ success: true, message: "Address updated successfully", data: updatedAddress });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
        /**
        #swagger.tags = ['Address']
        */
    },

    //  Get All Addresses for a User
    async getAddresses(req, res) {
        try {
            const userId = req.user.id;
            const addresses = await Address.find({ user_id: userId });

            return res.status(200).json({ success: true, message: "Addresses retrieved successfully", data: addresses });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
        /**
        #swagger.tags = ['Address']
        */
    },

    // Get Address by ID
    async getAddressById(req, res) {
        try {
            const userId = req.user.id;  // Get user ID from the authenticated user
            const { address_id } = req.params;  // Address ID passed in the route parameters

            // Find the address by ID and ensure it belongs to the logged-in user
            const address = await Address.findOne({ _id: address_id, user_id: userId });

            if (!address) {
                return res.status(404).json({ success: false, message: "Address not found" });
            }

            return res.status(200).json({ success: true, message: "Address retrieved successfully", data: address });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
          /**
        #swagger.tags = ['Address']
        */
    }
};

module.exports = AddressController;