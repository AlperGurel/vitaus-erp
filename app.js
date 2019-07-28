const express = require("express")
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const cors = require("cors");

mongoose.connect("mongodb://alper:alpersahin34@ds151817.mlab.com:51817/heroku_v0nfcs00", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;

//handle mongo error
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("database connection succesfull");
})

//Routes
const stockRouter = require("./api/routes/stock");
const campaignRouter = require("./api/routes/campaign")
const orderRouter = require("./api/routes/order")

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, UPDATE, PATCH, DELETE, GET");
        return res.status(200).json();
    }
    next();
})
app.use(cors());
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(fileUpload());


app.use("/stock", stockRouter);
app.use("/campaign", campaignRouter);
app.use("/api/order", orderRouter);
app.disable("etag");



app.use((req, res, next)=>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;