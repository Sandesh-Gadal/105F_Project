const {users} = require("../../model/index.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {sendEmail} = require("../../services/sendEmail.js")


exports.renderRegisterForm = (req ,res) => {
    res.render("register")
}

exports.renderLoginForm = (req , res) => {
    res.render("login")
}

exports.registerUser = async (req,res) => {
    const  {username ,email,password } = req.body
  
    if(!username || !email || !password) {
        return res.status(400).send("All fields are required");
    }
    //inserting into the database
   await users.create({
    username,
    email, 
    password : bcrypt.hashSync(password, 10)
   })
    res.redirect('/login')
}

exports.loginUser = async (req,res)=> {
    const {email , password} = req.body
    if(!email || !password) {
        return res.status(400).send("All fields are required");
    }
    const foundUser = await users.findAll({
        where :{
            email : email 
        }
    })
    if(foundUser.length === 0) {
        return res.status(400).send("No User found with this email")
    }else{
        const isPasswordValid = await bcrypt.compareSync(password , foundUser[0].password)
        if(!isPasswordValid) {
            return res.status(400).send("Invalid password")
        }else{
            var token = jwt.sign({id : foundUser[0].id}, process.env.secretKey ,{expiresIn: '1d'})
            res.cookie('jwttoken', token ,{
                httpOnly: true,
                expires : new Date(Date.now() + 3*24*60*60*1000),
                secure: true
            })
            res.redirect('/')
        }
    }
}

exports.logoutUser = (req,res) => {
    res.clearCookie('jwttoken')
    res.redirect('/login')
}

exports.forgotPassword = (req , res)=> {
    res.render("forgotPassword")
}

exports.handleForgotPassword = async (req,res) =>{
    const {email} = req.body
    console.log("Email", email)
    if(!email) {
        return res.status(400).send("Please provide email");
    }
   const userData = await users.findAll({
    where :{
        email :email
    }  
})
    if(userData.length === 0) {
        return res.status(400).send("No user found with this email");
}
console.log("userData:",userData)
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);
    //if email is found then send email 
    const data = {
        email : email,
        subject : "Password Reset",
        text : `This is your OTP for password reset ${generatedOtp}`
    }
   await sendEmail(data)
   userData[0].otp = generatedOtp
   await userData[0].save()
  res.redirect('/otpForm?email='+email)
}


exports.renderOTPForm = (req,res) => {
    const {email} = req.query
    res.render("otpForm",{email:email})
}

exports.verifyOTP = async (req,res) => {
    const {otp} = req.body
const email = req.params.id
    const data = await users.findAll({
        where : {
            otp : otp,
            email : email
        }
    })
    if(data.length === 0) {
        return res.status(400).send("Invalid OTP")
    }
    res.send("OTP verified successfully")
}