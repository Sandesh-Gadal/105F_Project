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

app.get('/blog/:id', async (req,res)=>{
  const blogId = req.params.id
//   const foundData =  await blogs.findByPk(blogId)
const foundData = await blogs.findAll({
    where :{
        id: blogId
    }
})
console.log(foundData)  

    res.render("singleBlog",{blog : foundData})
})

app.get('/delete/:id',async(req,res)=>{
  const blogId = req.params.id 
 await blogs.destroy({
    where :{
        id : blogId
    }
 })
 res.redirect('/')
})

app.get('/addblog',(req,res)=>{
    res.render("addBlog")
})

app.post('/addblog', async(req, res) => {

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










