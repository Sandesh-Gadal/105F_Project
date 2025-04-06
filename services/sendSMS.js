const twilio = require('twilio')("ACe15c932d2acd2854f39b80706ea476a5","47ea190c6dbc4b1feda9bd481bb0cff4")

async function sendSMS(){
   await  twilio.messages.create({
        body : "Hello from Sandesh Gadal",
         to : "+977 9766488138",
        from : "+14092190183"
    })
    console.log("SMS sent successfully")
}

module.exports = sendSMS