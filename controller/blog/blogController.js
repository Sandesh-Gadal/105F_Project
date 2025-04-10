const { blogs, comments } = require('../../model/index.js');
const {users} = require("../../model/index.js")

exports.renderHome = async(req,res)=>{
    //blogs database batw data[rows] nikalera home page ma dekhauney 
   const blogsTableBlogs = await blogs.findAll({
    include :{
        model :users ,
        attributes : ['username']
    }
   })
  console.log(blogsTableBlogs)
   
    res.render("home",{blogs : blogsTableBlogs})
}


exports.renderAddBlog = (req,res)=>{
    res.render("addBlog")
}

exports.addBlog = async(req, res) => {
    const {userId} = req 
    const {title, subTitle, description} = req.body
    if(!title || !subTitle || !description) {
        return res.status(400).send("All fields are required");
    }
   
    //inserting into the database
  await blogs.create({
        title: title,
        subTitle: subTitle,
        description: description,
        image: process.env.backendUrl + req.file.filename,
        userId: userId
    })
    res.redirect('/');
}

exports.updateBlog = async (req, res) => {
    const {id} = req.params
    const {title, subTitle, description} = req.body
  
  
    if(!title || !subTitle || !description)  {
        return res.status(400).send("All fields are required");
    }
    //updating the database
    await blogs.update({
        title: title,
        subTitle: subTitle,
        description: description,
        image: process.env.backendUrl + req.file.filename
    },{
            where:{
                id:id
            }
        }
    )
 res.send("Blog updated successfully")
}

exports.renderSingleBlog =  async (req,res)=>{
  const blogId = req.params.id
//   const foundData =  await blogs.findByPk(blogId)
const foundData = await blogs.findAll({
    where :{
        id: blogId
    },
    include :{
    model : users 
    }
})

const commentData = await comments.findAll({
    where :{
        blogId : blogId
    },
    include :{
        model : users 
    }
})
    // console.log("foundData", foundData[0].user)
console.log("commentData", commentData)

    res.render("singleBlog",{blog : foundData , comments : commentData})
}

exports.deleteBlog = async(req,res)=>{
  const blogId = req.params.id 
 await blogs.destroy({
    where :{
        id : blogId
    }
 })
 res.redirect('/')
}

exports.renderUpdateBlog = async (req,res)=>{
    const blogId = req.params.id 
    const blogData = await blogs.findByPk(blogId)
 
    res.render("updateBlog",{id : blogId, blog : blogData})
}

exports.addComment =async (req,res)=>{
   
 
    const {commentMessage ,blogId ,userId } = req.body
   

    if(!commentMessage || !blogId || !userId) {
        return res.send("Please provide comment ,blogId or userId")
    }
    await comments.create({
        commentMessage : commentMessage,
        blogId : blogId,
        userId : userId
    })
    res.redirect(`/blog/${blogId}`)
}

