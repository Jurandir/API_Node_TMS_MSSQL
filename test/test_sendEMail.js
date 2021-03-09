const sendEmail = require('../services/sendMail')

let email = {
    to: 'jurandir.junior@termaco.com.br',
    subject: 'Enviando Email com Node.js - TESTE 02',
    text: 'Estou te enviando este email com node.js - TESTE 02',
}

sendEmail(email).then((ret)=>{
    console.log(ret)
})

