const nodemailer = require('nodemailer')
const{ configObject } = require('../config')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user:configObject.gmail_user_app,
        pass:configObject.gmail_pass_app  
     }
})

exports.sendMail = async (destino, subject, html) => {
    return await transport.sendMail({
        from: '<aromerosambucetti@gmail.com>',
        to: destino,
        subject,
        html,
    })
}