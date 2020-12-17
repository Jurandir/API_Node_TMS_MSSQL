const getUserAD = require('../services/getUserAD')
const jwt = require('jsonwebtoken')

require("dotenv").config()

//authentication
const loginAD = async (req, res, next) => {
    const credenciais = async (user,pwd) => {
        let retorno  = {}
        retorno.auth = false

        let data = await getUserAD(user,pwd)

        let { success } = data
         if ( success === false ) { 
            retorno.auth     = false 
            retorno.isErr    = true
            retorno.message = 'Credenciais fornecidas não são validas.'  
        } else {

              retorno.data     = data
              retorno.auth     = true 
              retorno.isErr    = false
              retorno.message  = 'Credenciais validas'  
              console.log(`Login : (${user}) => ${Date()} - ${req.connection.remoteAddress}`)
         }
         return retorno
      }

    let dados = await credenciais(req.body.usuario,req.body.senha)

    if(dados.auth) {

      let response = {}
      response.auth      = true
      response.isErr     = false
      response.nome      = dados.data.displayName
      response.matricula = dados.data.description
      response.mail      = dados.data.mail
      response.grupos    = ['ATI']

      let token = jwt.sign({ 
        "cnpj" : '00000000000000',
        "nome": response.nome, 
        "matricula": response.matricula,
        "mail": response.mail,
        "grupos": response.grupos
      }, process.env.SECRET, { expiresIn: '24h'})
      response.token = token

      return res.json( response )
    }
    res.status(401).json( dados );
}
 
module.exports = loginAD
