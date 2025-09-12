// models/Product.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const productSchema = new mongoose.Schema({
    id: { // This is the slug for the URL
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
    short_description: {
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
    price: {
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
    // ==================================================
    //                 START OF I18N CHANGES
    // ==================================================
    ingredients: {
        fr: [String],
        ar: [String]
    },
    how_to_use: {
        fr: [String],
        ar: [String]
    },
    // ==================================================
    //                  END OF I18N CHANGES
    // ==================================================
    reviews: [reviewSchema]
});

productSchema.virtual('mainImageUrl').get(function() {
    return this.mainImage ? this.mainImage.url : '/images/placeholder.jpg';
});

module.exports = mongoose.model('Product', productSchema);