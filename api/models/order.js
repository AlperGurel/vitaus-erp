const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    firm: {
        type: String,
    },
    no: {
        type: String,
        unique: true,
        required: true
    },
    creationDate: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    state: {
        type: Number
    },
    paymentDate: {
        type: Date
    }, 
    files: [{
        path: String,
        iconPath: String,
        name: String
    }],
    detail: {
        type: String
    },
    price: {
        type: Number
    },
    currency: {
        type: String
    }
    
})

const order = mongoose.model("order", orderSchema);
module.exports = order;