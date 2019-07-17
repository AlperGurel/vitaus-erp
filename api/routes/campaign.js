const express = require("express");
const router = express.Router();
const campaignModel = require("../models/campaign")

router.get("/", (req, res, next) => {
    campaignModel.find({}, (err, campaigns) => {
        res.status(200).json(campaigns)
    })
})

router.get("/:company", (req, res, next) => {
    const company = req.params.company;
    campaignModel.find({company: new RegExp(company)}, (err, campaigns) => {
        res.status(200).json(campaigns);
    })
})

router.post("/", (req, res, next) => {
    const campaign = {
        company: req.body.company,
        details: req.body.details
    }
    if(campaign.company){
        campaignModel.create(campaign, (err, createdCampaign) => {
            if(err){
                return next(error);
            }
            else{
                res.status(200).json(createdCampaign);
            }
        })
    }
    else{
        res.status(300).json({
            error: "Please send a campaign name"
        })
    }
})

router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    campaignModel.findByIdAndRemove(id, {}, err => {
        if(err){
            return next(error);
        }
        else{
            res.status(200).json({message: "Requested campaign is deleted"});
        }
    })
})

router.put("/", (req, res, next)=> {
    const id = req.body._id
    const newDetail = req.body.details;
    const newCompany = req.body.company;
    const options = {}
    campaignModel.findByIdAndUpdate(id, {
        details: newDetail,
        company: newCompany
    }, options, (err, campaign) => {
        if(err){
            return next(error);
        }
        res.status(200).json(campaign);
    })

})

module.exports = router;