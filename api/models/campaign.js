const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    details: {
        type: String
    }
})

const campaign = mongoose.model("campaign", campaignSchema);
module.exports = campaign;