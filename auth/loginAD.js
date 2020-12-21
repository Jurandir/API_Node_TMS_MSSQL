const getUserAD = require('../services/getUserAD')
const jwt = require('jsonwebtoken')

require("dotenv").config()

//authentication
const loginAD = async (req, res) => {
    const credenciais = async (user,base64) => {

       console.log('credenciais:',user,base64)


        let xpto = Buffer.from(base64, "base64").toString("ascii").substr(1)
        let len  = xpto.length
        let pwd  = xpto.substr(0,len-1)

        let retorno  = {}
        retorno.auth = false

        console.log('credenciais-pwd:',user,pwd)


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


    console.log('credenciais-dados:',dados)

    if(dados.auth) {

      let response = {}
      response.auth      = true
      response.matricula = dados.data.description
      response.nome      = dados.data.displayName
      response.grupos    = []
      response.mail      = dados.data.mail

      for await (grp of dados.data.groups) {
        response.grupos.push(grp.cn)
      }

      let cnpj = req.body.cnpj || '00000000000000'

      let token = jwt.sign({ 
        "cnpj" : cnpj,
        "nome": response.nome, 
        "matricula": response.matricula,
        "mail": response.mail,
        "grupos": response.grupos
      }, process.env.SECRET, { expiresIn: '24h'})
      response.token = token
      response.isErr = false

      res.json( response )
    }
    res.status(401).json( dados );
}
 
module.exports = loginAD
