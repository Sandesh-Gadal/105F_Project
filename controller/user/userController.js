const {users} = require("../../model/index.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {sendEmail} = require("../../services/sendEmail.js")


exports.renderRegisterForm = (req ,res) => {
    res.render("register")
}

exports.renderLoginForm = (req , res) => {
    const {error,success} = req.flash()
    res.render("login",{error,success})
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
   req.flash('success', 'User registered successfully')
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
            req.flash('error', 'Invalid password or email')
           
            return res.redirect('/login')
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
    const {error} = req.flash()
    res.render("forgotPassword",{error})
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
        req.flash('error','No user found with this email')
        res.redirect('forgotPassword')
        //  res.status(400).send("");
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
   userData[0].otpGeneratedTime = Date.now() 
   await userData[0].save()
  res.redirect('/otpForm?email='+email)
}


exports.renderOTPForm = (req,res) => {
    const {email} = req.query
    const {error} = req.flash()
    res.render("otpForm",{email:email, error})
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
        req.flash('error', 'Invalid OTP')
       return res.redirect('/otpForm?email='+email)
    }

    const generatedTime = data[0].otpGeneratedTime
    const currentTime = Date.now()
    if(currentTime - generatedTime <= 2*60*1000) {
        res.redirect(`/resetPassword?email=${email}&otp=${otp}`)
        
    }else{
        res.status(400).send("OTP expired")
    }
   
}


exports.renderResetPassword = (req,res)=>{
    const {email, otp} = req.query
   if(!email || !otp) {
        return res.status(400).send("Invalid OTP")
    }
    res.render("resetPassword",{email,otp})
}

exports.handleResetPassword = async (req,res) => {
   const{email ,otp} = req.params

   const {newPassword,newPasswordConfirm} = req.body
   if(!email || !otp || !newPassword || !newPasswordConfirm) {
    return res.status(400).send("All fields are required");
   }
   if(newPassword !== newPasswordConfirm) {
    return res.status(400).send("Passwords do not match");
   }
   const userData = await users.findAll({
    where : {
        email : email,
        otp : otp
    }
   })



   const generatedTime = userData[0].otpGeneratedTime
   const currentTime = Date.now()
   if(currentTime - generatedTime <= 2*60*1000) {
    res.send(`Password reset successfully `)
    userData[0].password = bcrypt.hashSync(newPassword, 10)
    await userData[0].save()
    res.redirect('/login')
   }else{
       res.status(400).send("OTP expired")
   }
   

}

