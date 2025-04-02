const { blogs } = require('../../model/index.js');

exports.renderHome = async(req,res)=>{
    //blogs database batw data[rows] nikalera home page ma dekhauney 
   const blogsTableBlogs = await blogs.findAll()
   
    res.render("home",{blogs : blogsTableBlogs})
}


exports.renderAddBlog = (req,res)=>{
    res.render("addBlog")
}

exports.addBlog = async(req, res) => {

    const {title, subTitle, description} = req.body
    if(!title || !subTitle || !description) {
        return res.status(400).send("All fields are required");
    }
   
    //inserting into the database
  await blogs.create({
        title: title,
        subTitle: subTitle,
        description: description,
        image: process.env.backendUrl + req.file.filename
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
    }
})
console.log(foundData)  

    res.render("singleBlog",{blog : foundData})
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