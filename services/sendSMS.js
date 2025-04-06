const twilio = require('twilio')("Api key","APi key secret")

async function sendSMS(){
   await  twilio.messages.create({
        body : "Hello from Sandesh Gadal",
         to : "+977 9766488138",
        from : "+14092190183"
    })
    console.log("SMS sent successfully")
}

module.exports = sendSMS