const {users} = require("../../model/index.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


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
            var token = jwt.sign({id : foundUser[0].id}, 'thisisthesecretkeydontshare',{expiresIn: '1d'})
            res.cookie('jwttoken', token ,{
                httpOnly: true,
                expires : new Date(Date.now() + 3*24*60*60*1000),
                secure: true
            })
            res.redirect('/')
        }
    }

   
}