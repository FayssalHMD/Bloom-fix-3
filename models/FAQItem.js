// models/FAQItem.js
const mongoose = require('mongoose');

const faqItemSchema = new mongoose.Schema({
    // ==================================================
    //                 START OF I18N CHANGES
    // ==================================================
    question: {
        fr: { type: String, required: true, trim: true },
        ar: { type: String, required: true, trim: true }
    },
    answer: {
        fr: { type: String, required: true, trim: true },
        ar: { type: String, required: true, trim: true }
    },
    // ==================================================
    //                  END OF I18N CHANGES
    // ==================================================
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FAQCategory',
        required: [true, 'La catégorie est requise.']
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const FAQItem = mongoose.model('FAQItem', faqItemSchema);

module.exports = FAQItem;