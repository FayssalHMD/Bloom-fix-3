// models/FAQCategory.js
const mongoose = require('mongoose');

const faqCategorySchema = new mongoose.Schema({
    // ==================================================
    //                 START OF I18N CHANGES
    // ==================================================
    name: {
        fr: { type: String, required: true, unique: true, trim: true },
        ar: { type: String, required: true, unique: true, trim: true }
    }
    // ==================================================
    //                  END OF I18N CHANGES
    // ==================================================
}, {
    timestamps: true
});

const FAQCategory = mongoose.model('FAQCategory', faqCategorySchema);

module.exports = FAQCategory;