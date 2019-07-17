const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const server = http.createServer(app);




Date.prototype.addDays = function(days){
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

//PREDEFINED FIRM DATA
const firms = [
    {
        name: "Bonami",
        deadline: 20,
        payment: 30
    },
    {
        name: "Vivre",
        deadline: 5,
        payment: 45
    },
    {
        name: "Westwing",
        deadline: 10,
        payment: 30
    }
]

const firmModel = require("./api/models/firm");
firmModel.deleteMany({}, (err) => {
    if(err){
        console.log(err);
    }
})

firms.forEach((firm) => {
    firmModel.create(firm, (err, createdFirm) => {
        if(err){
            console.log(err)
        }
    })
})




server.listen(port);