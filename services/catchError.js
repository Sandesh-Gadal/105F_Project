const catchError = (fn)=>{
    return(req, res, next)=>{
        fn(req, res, next).catch((error)=>{
            console.log(error)
            res.status(500).send("Internal Server Error")
        })
    }
}


module.exports = catchError