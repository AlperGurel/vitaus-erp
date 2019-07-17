const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const productModel = require("../models/product")
const path = require("path");
const xlsx = require("xlsx");
const objectID = require("mongoose").Types.ObjectId;

router.get("/", (req, res, next) => {
    //get products that has a stock value true
    //return products as a response
    productModel.find({stock: "true"}, (err, products) => {
        res.status(200).json(products)
    });
})


router.get("/:stockCode", (req, res, next) => {
    const code = req.params.stockCode;
    productModel.find({stockcode: new RegExp(code)}, (err, product) => {
        res.status(200).json(product)
    })
});

router.post("/upload", (req, res, next) => {
    const isAdding = req.body.isAdding;
    if(Object.keys(req.files).length == 0){
        return res.status(400).json({
            message: "No Files Uploaded"
        });
    }
    let sampleFile = req.files.file;
    uploadPath = path.join(__dirname ,'../../uploads/', sampleFile.name);
    sampleFile.mv(uploadPath, (err) => {
        if(err){
          return res.status(500).json({
                message: "File could not be saved"
            })  
        }
        res.status(200).json({
            message: "File Uploaded"
        })
        const workbook = xlsx.readFile(uploadPath);
        let sheetname = workbook.SheetNames[0];
        let row = 1;
        let column = "A"
        let addressOfCell =   column + row.toString();
        let worksheet = workbook.Sheets[sheetname];
        let desiredCell = worksheet[addressOfCell];
        let desiredValue = (desiredCell ? desiredCell.v : undefined);
        let newProducts = [];
        let changes = [];
        while(desiredValue !== undefined){
            let product = {};
            product.stockcode = desiredValue;
            product.barcode = (worksheet["B" + row.toString()] ? worksheet["B" + row.toString()].v : undefined);
            product.quantity =  (worksheet["C" + row.toString()] ? worksheet["C" + row.toString()].v : undefined);
            newProducts.push(product);
            row++;
            addressOfCell = column + row.toString();
            desiredCell = worksheet[addressOfCell];
            desiredValue = (desiredCell ? desiredCell.v : undefined);
            
        }
        let size = newProducts.length;
        newProducts.forEach(async (newProduct) => {
            productModel.find({stockcode: new RegExp(newProduct.stockcode)}, (err, product) => {
                if(product.length === 0){
                    let createProduct = newProduct;
                    changes.push({product: createProduct, difference: createProduct.quantity, isNew: true });
                }
                else{
                    console.log(product)
                    let existingProduct = product;
                    let quantityDifference;   
                    if(!isAdding){
                        quantityDifference = newProduct.quantity - product.quantity;
                    }
                    else{
                        quantityDifference = newProduct.quantity + product.quantity;
                    }
                    
                    existingProduct.quantity = newProduct.quantity;
                    changes.push({product: existingProduct, difference: quantityDifference, isNew: false })
                }

            });
        });
        let checkServer = setInterval(() => {

            if(changes.length === size){
                res.status(200).json();
                clearInterval(checkServer);
            }
            
        }, 300);                  
    })
})

router.post("/", (req, res, next) => {
    //get the excel and update
    
    const product = {
        barcode: req.body.barcode,
        stockcode: req.body.stockcode,
        quantity: req.body.quantity,
        stock: true 
    }
    console.log(product)
    let message, status;
    if(product.barcode && product.stockcode){
        productModel.create(product, (error, product_l) => {
            if(error){
                return next(error);
            } else{
                message = "Stock creatiton successfull";
                console.log(message);
                status = 200;
                res.status(status).json({
                    message: message
                })

            }
        });
    }
    else{
        message = "Posted stock values are undefined",
        status = 400
        res.status(status).json({
            message: message
        })
    }
    
});

router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    productModel.findByIdAndRemove(id, {}, err =>{
        res.status(200).json({
            message: "Sildik"
        })
    })
})

//UPDATE WITH EXCEL
router.put("/updatemany", (req, res, next) => {
    const productsUpdate = req.body.products;
    let counter = 0;
    if(productsUpdate.length > 0){
        productsUpdate.forEach((productUpdate) => {
            productModel.findById(productUpdate._id, (err, product) => {
                if(product){
                    productModel.findByIdAndUpdate(productUpdate._id, {
                        quantity: productUpdate.quantity, 
                        barcode: productUpdate.barcode, 
                        stockcode: productUpdate.stockcode}, {}, (err, docs) => {
                            counter++; }) 
                }
                else{
                    const newProduct = {
                        barcode: productUpdate.barcode,
                        stockcode: productUpdate.stockcode,
                        quantity: productUpdate.quantity,
                        stock: true
                    }
                    if(product.barcode && product.stockcode){
                        productModel.create(product, (error, createdProduct) => {
                            if(error){
                                return next(error);
                            } else{
                                counter++; }
                        });
                    }
                }
            })
        })
    }
    
    let checkServer = setInterval(() => {
        if(counter === productsUpdate.length){
            res.status(200).json();
            clearInterval(checkServer);
        }      
    }, 300);


})

//UPDATE
router.put("/", (req, res, next) => {    
    const quantity = req.body.quantity;
    const options = {}
    productModel.findByIdAndUpdate(req.body._id, {
        quantity: quantity
    }, options, (err, updatedProduct, next) => {
        if(err){
            return next(err);
        }
        res.status(200).json(updatedProduct)
    } )
   
});

module.exports = router;