// models/Pack.js

const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    // ==================================================
    //                 START OF I18N CHANGES
    // ==================================================
    name: {
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    contents: {
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    description: {
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    // ==================================================
    //                  END OF I18N CHANGES
    // ==================================================
    originalPrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    mainImage: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    gallery: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ],
});

// Virtual for savings text can be added later if needed for multilingual support

module.exports = mongoose.model('Pack', packSchema);