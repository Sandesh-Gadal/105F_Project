const express = require('express');
const app = express();

//alternative for above two lines 
// const app = require('express')();

require("./model/index.js")

app.set("view engine", "ejs");
const PORT = 3000
app.listen(PORT,()=>{
    console.log(`NodeJs project is running on port ${PORT}` )
})


app.get('/',(req,res)=>[
    res.render("home")
])
app.get('/about',(req,res)=>[
    res.render("about")
])
app.get('/contact',(req,res)=>[
    res.render("contact")
])










