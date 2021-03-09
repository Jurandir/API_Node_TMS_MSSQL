require('dotenv').config({path: "../.env"})

const pwd        = process.env.PASS_EMAIL
const nodemailer = require("nodemailer")
const remetente  = nodemailer.createTransport({
    host: 'smtp.office365.com',
    service: '',
    port: 587,
    secure: false,
    auth: {
        user: 'cargas@termaco.com.br',
        pass: pwd
    }
})

const sendMail = (email) => {
    return new Promise( function(resolve, reject) {

        let retorno ={
            success: false,
            message: 'Problemas no envio !!!',
            err: ''
        }

        if(!email.from ) {
            email.from = 'cargas@termaco.com.br'
        }

        if(!email.from || !email.to || !email.subject || !email.text){
            retorno.err = email
            reject(retorno)
        }
    
        remetente.sendMail(email, function (error) {
            if (error) {
                retorno.err = error
                reject(retorno)
            } else {
                retorno.success = true
                retorno.message = 'Email enviado com sucesso.'
                resolve(retorno)
            }
        })
    })
}

module.exports = sendMail

// (Caso eviar anexos) : https://nodemailer.com/message/attachments/
/*
let email = {
    from: 'cargas@termaco.com.br',
    to: 'jurandir.junior@termaco.com.br',
    subject: 'Enviando Email com Node.js',
    text: 'Estou te enviando este email com node.js',
}
*/
