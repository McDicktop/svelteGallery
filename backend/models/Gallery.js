const { Schema, model } = require('mongoose');

const GallerySchema = new Schema({
    filename: {
        type: String,
        required: [true, "Filename is required"],
        unique: true
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = model("Gallery", GallerySchema)