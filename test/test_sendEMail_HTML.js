const sendEmail = require('../services/sendMail')
const jwt = require('jsonwebtoken')

require('dotenv').config()


let cnpj = '00000000000000'
let send = 'jurandir.junior@termaco.com.br'

let token = jwt.sign({ "cnpj" : cnpj, "sendTo": send }, process.env.SECRET, { expiresIn: '24h'})

let uri=`http://siconline.termaco.com.br/support?login=${token}`

const encoded = encodeURI(uri);

let email = {
    to: send,
    subject: 'TERMACO - recuperação de senha !!!',
    text: '',
    html: `<h1>SIC</h1>
            <h3>Usuário :${cnpj}
            <a href="${encoded}">
              <h4>Recuperação da senha</h4>
            </a>`,
}

sendEmail(email).then((ret)=>{
    console.log(ret)
}).catch(err=>{
    console.log(err)
})
