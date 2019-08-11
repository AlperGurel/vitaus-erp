const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
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
        filaname: String
    }]


})

const campaign = mongoose.model("campaign", campaignSchema);
module.exports = campaign;