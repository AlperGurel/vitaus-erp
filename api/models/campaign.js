const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    tid: {
        type: String
    },
    firm: {
        type: String,
    },
    type: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    notes: {
        type: String
    },
    attachments: [{
        url: String,
        filename: String
    }]


})

const campaign = mongoose.model("campaign", campaignSchema);
module.exports = campaign;