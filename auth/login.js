const sqlQuery = require('../connection/sqlQuery')
const jwt = require('jsonwebtoken')
const moment = require('moment')

require("dotenv").config()

//authentication
const login = async (req, res, next) => {
    const credenciais = async (user,pwd) => {
        let retorno  = {}
        retorno.auth = false

        let data = await sqlQuery(`
          SELECT NOME
          FROM CLI 
          WHERE CGCCPF='${user}' AND SENHA='${pwd}'
          `)  
         let { Erro } = data
         if ((Erro) || (!data[0])) { 
              retorno.message = 'Credenciais fornecidas não são validas.'  
              retorno.erro = Erro
        } else {
              retorno.auth    = true 
              retorno.login   = user
              retorno.name    = data[0].NOME
              retorno.message = 'Credenciais validas'  
              console.log(moment().format(),`- Login : ${user} - ${req.connection.remoteAddress} - ${data[0].NOME}`)
         }
         return retorno
      }

    let dados = await credenciais(req.body.cnpj,req.body.senha)
    let expiration = new Date()
    let addTime = expiration.getHours() + 24

    expiration.setHours(addTime)

    if(dados.auth) {
      let token = jwt.sign({ "cnpj" : req.body.cnpj }, process.env.SECRET, { expiresIn: '24h'})
      dados.token = token
      dados.expiresIn = expiration
      res.json( dados )   // tinha um return
    } else {
		res.status(401).json( dados )
	}
}
 
module.exports = login
