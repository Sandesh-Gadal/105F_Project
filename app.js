const express = require('express');
require("dotenv").config()
const app = express();
const blogRoute = require("./routes/blogRoute.js")
const userRoute = require("./routes/userRoute.js")
const commentRoute = require("./routes/commentRoute.js")
const cookieParser = require("cookie-parser");
const sendSMS = require("./services/sendSMS");
const session = require("express-session");
const flash = require('connect-flash')
const promisify = require('util').promisify
const jwt = require('jsonwebtoken')


app.use(session({
    secret : "hellothisissecret",
    resave :false ,
    saveUninitialized : false
}))

app.use(flash())




 
//alternative for above two lines 
// const app = require('express')();

require("./model/index.js")

app.use(cookieParser())
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 

// sendSMS()
app.use(async(req,res,next)=>{
    res.locals.currentUser = req.cookies.jwttoken
    if(req.cookies.jwttoken){
        const data = await promisify(jwt.verify)(req.cookies.jwttoken, process.env.secretKey)
 res.locals.currentUserId = data.id

    }
    next()
})

app.use("",blogRoute)
app.use("",userRoute)
app.use("",commentRoute)

const PORT = 3000
app.listen(PORT,()=>{
    console.log(`NodeJs project is running on port ${PORT}` )
})




app.use(express.static('./uploads/'))
app.use(express.static(__dirname + '/public/'))







