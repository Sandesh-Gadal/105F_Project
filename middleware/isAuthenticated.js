const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const {users} = require("../model/index.js")

exports.isAuthenticated = async (req , res , next)=> {
 const token = req.cookies.jwttoken
 console.log(token)
 if(!token || token === undefined || token === null){
    return res.redirect('/login')
 }
//if token comes then verify it
  const verifiedResult =  await promisify(jwt.verify)(token, process.env.secretKey)
  const user = await users.findByPk(verifiedResult.id)
  if(!user){
    return res.redirect('/login')
  }
  req.userId = verifiedResult.id
  next()
}