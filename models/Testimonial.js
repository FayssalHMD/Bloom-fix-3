// models/Testimonial.js

const mongoose = require('mongoose');

const imageSchema = {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
};

const testimonialSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['before-after', 'instagram'],
        default: 'instagram'
    },
    beforeImage: {
        type: imageSchema,
        required: function() { return this.type === 'before-after'; }
    },
    afterImage: {
        type: imageSchema,
        required: function() { return this.type === 'before-after'; }
    },
    instagramImage: {
        type: imageSchema,
        required: function() { return this.type === 'instagram'; }
    },
    // ==================================================
    //                 START OF I18N CHANGES
    // ==================================================
    quote: {
        fr: { type: String, trim: true },
        ar: { type: String, trim: true }
    },
    story: {
        fr: { type: String, trim: true },
        ar: { type: String, trim: true }
    },
    // ==================================================
    //                  END OF I18N CHANGES
    // ==================================================
    featuredProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);