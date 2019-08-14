const express = require("express");
const router = express.Router();
const campaignModel = require("../models/campaign")

router.get("/", (req, res, next) => {
    campaignModel.find({}, (err, campaigns) => {
        res.status(200).json(campaigns)
    })
    
})

// router.get("/:company", (req, res, next) => {
//     const company = req.params.company;
//     campaignModel.find({company: new RegExp(company)}, (err, campaigns) => {
//         res.status(200).json(campaigns);
//     })
// })

router.get("/:id", (req, res, nex) => {
    const id = req.params.id;
    campaignModel.findById(id, function(err, campaign){
        res.status(200).json(campaign)
    })
})

router.post("/", (req, res, next) => {
    const campaign = req.body.campaign;
    if(campaign){
        campaignModel.create(campaign, (err, createdCampaign) => {
            if(err){
                return next(error);
            }
            else{
                res.status(200).json(createdCampaign);
            }
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