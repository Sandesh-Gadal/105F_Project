const {addComment} = require("../controller/blog/blogController")

const router = require("express").Router()

router.route('/comment').post(addComment)

module.exports = router