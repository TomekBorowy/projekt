const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const advSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true

    },
    description: {
        type: String,

    },
    image: {
        type: Buffer,
        required: true

    },
    imageType: {
        type: String,

    },
    telNumber: {
        type: String,

    },
    email: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },

    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,

    },
    userid: {
        type: String,

    },
    price: {
        type: String,

    }
});

advSchema.virtual('imagePath').get(function () {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})

module.exports = mongoose.model('Advertisment', advSchema);