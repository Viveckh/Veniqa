import nodemailer from 'nodemailer';
import emailConfig from '../properties/email';

let transporter = nodemailer.createTransport(emailConfig.credentials)

// verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
         console.log(error);
    } else {
         console.log('Email Service is up and ready to go');
    }
});

//, somit@ngineerx.com, gcurry@ngineerx.com
export default {
    broadcastNewPublicMessage(messageObj) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Ngineerx Smart Bot 👾" <smartbot@ngineerx.com>', // sender address
            to: 'smartbot@ngineerx.com, vpandey@ngineerx.com, yjamil@ngineerx.com', // list of receivers
            subject: 'New Inquiry from ' + messageObj.name, // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Name: </b>' +  messageObj.name + '<br><b>Email: </b>' + messageObj.email + '<br><b>Phone: </b>' + messageObj.phone + '<br><b> Representative of: </b>' + messageObj.representativeOf + '<br><b>Purpose: </b>' + messageObj.purpose + '<br><b>Project Timeframe:</b> ' + messageObj.projectTimeframe + '<br><b>Details: </b>' + messageObj.details // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    },

    broadcastWhitepaperReaderAddedMessage(messageObj) {
        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Ngineerx Smart Bot 👻" <smartbot@ngineerx.com>', // sender address
            to: 'smartbot@ngineerx.com, vpandey@ngineerx.com, yjamil@ngineerx.com, somit@ngineerx.com, ' + messageObj.email, // list of receivers
            subject: 'Ngineerx Whitepaper Access for ' + messageObj.first_name + ' ' + messageObj.last_name, // Subject line
            text: 'Hello world?', // plain text body
            html: 'Hi ' +  messageObj.first_name + ' ' + messageObj.last_name + ',<br>Following are your credentials to access the Ngineerx whitepaper.<br><br><b>Username: </b>' + messageObj.username + '<br><b>Password: </b>' + messageObj.password + '<br><br>View the whitepaper at <a href="https://www.ngineerx.com">www.ngineerx.com</a><br><br><br><i>Ngineerx Smartbot</i>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    }
}