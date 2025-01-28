const Category = require('../models/Category');
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

const Categorycontroller = {
    // Create Category
    async createCategory(req, res) {
        try {
            const SuperAdminId = req.user.id;
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ success: false, message: 'Category name is required' });
            }
            // Validate picture
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Picture is required' });
            }

            const newCategory = new Category({
                name,
                picture: req.file.filename, // Save uploaded file name
                superadminId: SuperAdminId, // Associate category with the vendor
            });

            await newCategory.save();
            return res.status(201).json({ success: true, message: 'Category created successfully', data: newCategory });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Category']
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['picture'] = { in: 'formData', type: 'file', required: true,description: 'Category picture', accept: 'image/jpeg, image/png'},
        #swagger.parameters['name'] = { in: 'formData', type: 'string', required: true },
       */
    },

    // Get All Category API
    async GetAllCategory(req, res) {
        try {
            const category = await Category.find(); // Exclude password from the response
            return res.status(200).json({ success: true, data: category });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Category']
        */
    },

    // Update Category
    async updateCategory(req, res) {
        try {
            const { category_Id } = req.body; // Category ID from path
            const { name } = req.body;

            // Find the category by ID
            const category = await Category.findById(category_Id);
            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }

            // Update fields
            if (name) category.name = name;
            if (req.file) category.picture = req.file.filename;

            await category.save();

            return res.status(200).json({ success: true, message: 'Category updated successfully', data: category });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }

        /**
        #swagger.tags = ['Category']
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['category_Id'] = { in: 'formData', type: 'string', required: true },
        #swagger.parameters['picture'] = { in: 'formData', type: 'file', required: false, description: 'Category picture', accept: 'image/jpeg, image/png'},
        #swagger.parameters['name'] = { in: 'formData', type: 'string', required: false },
        */
    },
    // Change Category status
    async ChangeStatus(req, res) {
        try {
            const { category_Id } = req.params;

            // Find the category by ID
            const category = await Category.findById(category_Id);

            if (!category) {
                return res.status(404).json({ success: false, message: 'category not found' });
            }
            // Toggle the status
            category.status = !category.status;

            // Save the updated admin
            await category.save();

            return res.status(200).json({ success: true, message: 'Status updated successfully', data: category });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
        /**
        #swagger.tags = ['Category']
        #swagger.autoBody = false
        #swagger.consumes = ['multipart/form-data']
        */
    },


}
module.exports = {
    createCategory: Categorycontroller.createCategory,
    updateCategory: Categorycontroller.updateCategory,
    GetAllCategory: Categorycontroller.GetAllCategory,
    ChangeStatus: Categorycontroller.ChangeStatus,
    upload,
}