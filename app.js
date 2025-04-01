const express = require('express');
const { blogs } = require('./model/index.js');
const app = express();

//alternative for above two lines 
// const app = require('express')();

require("./model/index.js")

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
const PORT = 3000
app.listen(PORT,()=>{
    console.log(`NodeJs project is running on port ${PORT}` )
})

//HOMe page 
app.get('/',async(req,res)=>{
    //blogs database batw data[rows] nikalera home page ma dekhauney 
   const blogsTableBlogs = await blogs.findAll()
   
    res.render("home",{blogs : blogsTableBlogs})
})

app.get('/blogs',async (req,res)=>{
    const blogsTableBlogs =await  blogs.findAll()
    console.log(blogsTableBlogs)
    res.render("blogs", {blogs : blogsTableBlogs})
})

app.get('/addblog',(req,res)=>{
    res.render("addBlog")
})

app.post('/addblog', async(req, res) => {
    console.log("Received Data:", req.body); // Debugging output
  
    // const  title = req.body.title
    // const subTitle = req.body.subTitle
    // const description = req.body.description

    const {title, subTitle, description} = req.body
    if(!title || !subTitle || !description) {
        return res.status(400).send("All fields are required");
    }
   
    //inserting into the database
  await blogs.create({
        title: title,
        subTitle: subTitle,
        description: description
    })
    res.redirect('/');
});










