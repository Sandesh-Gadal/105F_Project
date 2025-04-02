const express = require('express');
const app = express();
const blogRoute = require("./routes/blogRoute.js")

require('dotenv').config()



//alternative for above two lines 
// const app = require('express')();

require("./model/index.js")

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 


app.use("",blogRoute)
const PORT = 3000
app.listen(PORT,()=>{
    console.log(`NodeJs project is running on port ${PORT}` )
})




app.use(express.static('./uploads/'))
app.use(express.static(__dirname + '/public/'))







