const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId


const reviewSchema = new mongoose.connect({
    bookId: {
        type: objectId,
        required: true,
        ref: "book"
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        //value: ''
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        minimum : 1,
        maximum: 5
    },
    review: {
        type: String, 
        //optional
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })


module.exports = mongoose.model('review', reviewSchema);