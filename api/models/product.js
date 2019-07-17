const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    barcode: {
        type: String,
        unique: true,
        required: true,

    },
    stockcode: {
        type: String,
        unique: true,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    stock: {
        type: Boolean,
        required: true
    }

})

const product = mongoose.model("product", productSchema)
module.exports = product;
