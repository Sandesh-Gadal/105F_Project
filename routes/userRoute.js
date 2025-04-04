const { renderRegisterForm, registerUser, renderLoginForm, loginUser, logoutUser , forgotPassword, handleForgotPassword  } = require("../controller/user/userController")

const router = require("express").Router()


router.route('/register').get(renderRegisterForm).post(registerUser)
router.route('/login').get(renderLoginForm).post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/forgotPassword').get(forgotPassword).post(handleForgotPassword)





module.exports = router 