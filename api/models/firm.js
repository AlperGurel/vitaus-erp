const mongoose = require("mongoose");

const firmSchema = new mongoose.Schema({
    name: {
        type: String
    },
    logoPath: {
        type: String
    },
    deadline: {
        type: Number
    },
    payment: {
        type: Number
    }

})

const firm = mongoose.model("firm", firmSchema);
module.exports = firm;