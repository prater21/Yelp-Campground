/**
 *  campground model schema setting
 */
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// campground model schema
const CampgroundSchema = new Schema({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//campground 지울 때 그 안에 있는 리뷰도 다 지우기
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);