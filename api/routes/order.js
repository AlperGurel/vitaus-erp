const express = require("express");
const router = express.Router();
const orderModel = require("../models/order")
const firmModel = require("../models/firm")
const path = require("path");

router.get("/notify", (req, res, next) => {
    const datetime = new Date();
    const deadline = datetime.addDays(7);
    orderModel.find({"$lte": deadline}, (err, orders) => {
        if(err){
            return next(err);
        }
        res.status(200).json(orders);
    })
    
})

router.get("/status", (req, res, next) => {
    const statusList = [
        "Beklemede",
        "Onaylandı",
        "Transfer Edildi",
        "Üretimde",
        "Ödeme Alındı"
    ]
    res.status(200).json(statusList);
})

router.get("/firm", (req, res, next) => {
    firmModel.find({}, (err, firms) => {
        if(err){
            return next(err);
        }
        res.status(200).json(firms);
    })  
})

router.get("/currency", (req, res, next) => {
    const currencyList = [
        "Dolar",
        "Euro",
        "TL"
    ]
    res.status(200).json(currencyList);
})


router.get("/", (req, res, next) => {
    console.log("Requesting all orders");
    orderModel.find({}, (err, orders) => {
        if(err){
            return next(err);
        }
        res.status(200).json(orders)
    })
})

router.post("/upload", (req, res, next) => {
    orderModel.findById(req.body.orderid, (err, order) => {
        if(err){
            return next(err);
        }
        else{
            let oldFileList = order.files;
            let newFile = {
                path: req.body.fileurl,
                name: req.body.filename
            };
            newFile._id = null;
            oldFileList.push(newFile);
            orderModel.findByIdAndUpdate(req.body.orderid, {
                "$addToSet": {"files": oldFileList}
            }, {"new": true}, (err, updatedOrder) => {
                if(err){
                    return next(err);
                }
                else{
                    console.log("File infos success");
                    console.log(updatedOrder)
                    res.status(200).json(updatedOrder);
                }
            })
        }
    })
});

router.get("/:no", (req, res, next) => {
    console.log("Requesting single order " + req.params.no);
    const no = req.params.no;
    orderModel.find({no: no}, (err, order) => {
        if(err){
            return next(err);
        }
        else{
            res.status(200).json(order);
        }
    })
})

router.get("/:firm", (req, res, next) => {
    const firm = req.params.firm;
    orderModel.find({firm: new RegExp(firm)}, (err, orders) => {
        if(err){
            return next(err)
        }
        else{
            res.status(200).json(orders);
        }
    })
})

router.post("/", (req, res, next) => {
    const order = {
        firm: req.body.firm,
        //this can be randomly generated, currently i am not sure
        no: req.body.no,
        creationDate: req.body.creationDate,
        deadline: req.body.deadline,
        state: req.body.state,
        paymentDate: req.body.paymentDate,
        price: req.body.price,
        currency: req.body.currency,
        detail: req.body.detail
    }
    if(order.no && order.creationDate && order.deadline){
        orderModel.create(order, (err, createdOrder) => {
            if(err){
                return next(err);
            }
            else{
                res.status(200).json(createdOrder);
            }
        })
    }
    else{
        console.log(req.body);
        res.status(300).json({
            error: "Please send a valid order date, deadline and order number",
        })
    }

})

router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    orderModel.findOneAndRemove(id, {}, err => {
        if(err){
            console.log(id);
            return next(err);
        }
        else{
            res.status(200).json({message: "Requested order has been deleted"})
        }
    })
})

router.put("/", (req, res, next) => {
    const id = req.body.id;
    const newFirm = req.body.firm;
    const newNo = req.body.no;
    const newCreationDate = req.body.creationDate;
    const newDeadline = req.body.deadline;
    const newState = req.body.state;
    const newPaymentDate = req.body.paymentDate;
    const newDetail = req.body.detail;
    const newPrice = req.body.price;
    const newCurrency = req.body.currency;
    const options = {};
    orderModel.findByIdAndUpdate(id, {
        firm: newFirm,
        no: newNo,
        creationDate: newCreationDate,
        deadline: newDeadline,
        state: newState,
        paymentDate: newPaymentDate,
        detail: newDetail,
        price: newPrice,
        currency: newCurrency
    }, options, (err, updatedOrder) => {
        if(err){
            return next(err);
        }
        res.status(200).json(updatedOrder);
    })
})

module.exports = router;