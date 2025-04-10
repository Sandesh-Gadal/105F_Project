const express = require('express');
const app = express();
const blogRoute = require("./routes/blogRoute.js")
const userRoute = require("./routes/userRoute.js")
const commentRoute = require("./routes/commentRoute.js")
const cookieParser = require("cookie-parser");
const sendSMS = require("./services/sendSMS");
const session = require("express-session");
const flash = require('connect-flash')


app.use(session({
    secret : "hellothisissecret",
    resave :false ,
    saveUninitialized : false
}))

app.use(flash())

require('dotenv').config()


 
//alternative for above two lines 
// const app = require('express')();

require("./model/index.js")

app.use(cookieParser())
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 

// sendSMS()
app.use((req,res,next)=>{
    res.locals.currentUser = req.cookies.jwttoken
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







