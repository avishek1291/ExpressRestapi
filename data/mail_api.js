'use strict';
const nodemailer = require('nodemailer');
var sendmail=function(toEmail){
    console.log('rreached the send mail function')
    nodemailer.createTestAccount((err, account) => {
    
        let transporter = nodemailer.createTransport({
            service:'gmail',
          
            auth: {
                user: 'avishek1291@gmail.com',
                pass: '*******'
            }
        });
    
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Fred Foo 👻"',
            to: toEmail,
            subject: 'Challenge Registered', 
            text: 'Your registration is Succefull for the event'// plain text body
            
        };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
        
        });
    });


}
//sendmail("coding");
module.exports.sendmail=sendmail;