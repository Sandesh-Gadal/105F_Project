const multer = require('multer');

var storage = multer.diskStorage({
    destination : function (req, file , cb ){
        cb(null, './uploads') // callback function => cb(error, success)
        // cb ma yeuta matra vayo vaney cb(error) ho vanih bujney 
    },
    filename  :function(req, file ,cb){
        cb(null,Date.now() + "-" + file.originalname)
    }
})

module.exports = {
    multer ,
    storage 
}