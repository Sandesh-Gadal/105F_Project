
const { renderRegisterForm, registerUser, renderLoginForm, loginUser, logoutUser , forgotPassword, handleForgotPassword, renderOTPForm, verifyOTP, renderResetPassword, handleResetPassword  } = require("../controller/user/userController")


const router = require("express").Router()


router.route('/register').get(renderRegisterForm).post(registerUser)
router.route('/login').get(renderLoginForm).post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/forgotPassword').get(forgotPassword).post(handleForgotPassword)
router.route('/otpForm').get(renderOTPForm)
router.route('/verifyOTP/:id').post(verifyOTP)
router.route('/resetPassword').get(renderResetPassword)
router.route('/resetPassword/:email/:otp').post(handleResetPassword)



module.exports = router 