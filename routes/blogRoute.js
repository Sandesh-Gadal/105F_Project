const { renderHome, renderAddBlog, renderSingleBlog, deleteBlog, renderUpdateBlog, updateBlog, addBlog } = require("../controller/blog/blogController")
const {storage , multer}= require("../middleware/multerConfig.js");
const upload = multer({storage: storage})
const router =require("express").Router()



router.route('/').get(renderHome)
router.route('/addblog').get(renderAddBlog).post(upload.single('image'), addBlog)

//singleBlog
router.route('/blog/:id').get(renderSingleBlog)
router.route('/delete/:id').get(deleteBlog)
router.route('/update/:id').get(renderUpdateBlog).post(upload.single('image'), updateBlog)




















module.exports = router