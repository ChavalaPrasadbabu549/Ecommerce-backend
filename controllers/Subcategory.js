const Subcategory = require('../models/Subcategory');
const multer = require('multer');


// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({
    storage,
});

const SubcategoryController = {
    // Create Subcategory
    async createSubcategory(req, res) {
        try {
            const { name, category_id } = req.body;

            if (!name) {
                return res.status(400).json({ success: false, message: 'Subcategory name is required' });
            }
            // Validate picture
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Picture is required' });
            }
            if (!category_id) {
                return res.status(400).json({ success: false, message: 'Category ID is required' });
            }

            const newSubcategory = new Subcategory({
                name,
                picture: req.file.filename, // Save uploaded file name
                categoryId: category_id,
            });

            await newSubcategory.save();
            return res.status(201).json({ success: true, message: 'Subcategory created successfully', data: newSubcategory });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
       #swagger.tags = ['Subcategory']
       #swagger.autoBody = false
       #swagger.consumes = ['multipart/form-data']
       #swagger.parameters['category_id'] = { in: 'formData', type: 'string', required: true },
       #swagger.parameters['picture'] = { in: 'formData', type: 'file', required: true,description: 'Category picture', accept: 'image/jpeg, image/png'},
       #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true },
      */
    },

    // Get Subcategories
    async getSubcategories(req, res) {
        try {
            const subcategories = await Subcategory.find().populate('categoryId', 'name');
            return res.status(200).json({ success: true, data: subcategories });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Subcategory']
       */
    },

    // Update Subcategory
    async updateSubcategory(req, res) {
        try {
            const { subcategoryId } = req.body;
            const { name } = req.body;

            const subcategory = await Subcategory.findById(subcategoryId);
            if (!subcategory) {
                return res.status(404).json({ success: false, message: 'Subcategory not found' });
            }

            if (name) subcategory.name = name;
            if (req.file) {
                subcategory.picture = req.file.filename;
            }

            await subcategory.save();

            return res.status(200).json({ success: true, message: 'Subcategory updated successfully', data: subcategory });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
       #swagger.tags = ['Subcategory']
       #swagger.autoBody = false
       #swagger.consumes = ['multipart/form-data']
       #swagger.parameters['subcategoryId'] = { in: 'formData', type: 'string', required: true },
       #swagger.parameters['picture'] = { in: 'formData', type: 'file', required: false, accept: 'image/jpeg, image/png'},
       #swagger.parameters['name'] = { in: 'formData', type: 'string', required: false },
        */
    },

    // Change Subcategory Status
    async changeSubcategoryStatus(req, res) {
        try {
            const { subcategory_Id } = req.params;

            const subcategory = await Subcategory.findById(subcategory_Id);
            if (!subcategory) {
                return res.status(404).json({ success: false, message: 'Subcategory not found' });
            }
            // Toggle the status
            subcategory.status = !subcategory.status;
            await subcategory.save();

            return res.status(200).json({ success: true, message: 'Status updated successfully', data: subcategory });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }

        /**
        #swagger.tags = ['Subcategory']
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
       */
    },
};

module.exports = {
    createSubcategory: SubcategoryController.createSubcategory,
    getSubcategories: SubcategoryController.getSubcategories,
    updateSubcategory: SubcategoryController.updateSubcategory,
    changeSubcategoryStatus: SubcategoryController.changeSubcategoryStatus,
    upload,
}