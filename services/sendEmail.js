const mailer = require('nodemailer');

exports.sendEmail = async(data) =>{
    //logic to send the email

   const transporter =  mailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.email,
            pass: process.env.emailAppPassword
        }
    })

    const mailOptions = {
        from : "Sandesh Gadal <unitedstates201920@gmail.com",
        to : data.email,
        subject : data.subject,
        text : data.text,
   
    }
   await transporter.sendMail(mailOptions)
      

}