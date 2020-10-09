const sqlQuery = require('../connection/sqlQuery')
const jwt = require('jsonwebtoken')

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
         }
         return retorno
      }

    let dados = await credenciais(req.body.cnpj,req.body.senha)

    if(dados.auth) {
      let token = jwt.sign({ "cnpj" : req.body.cnpj }, process.env.SECRET, { expiresIn: '24h'})
      dados.token = token
      return res.json( dados )
    }
    res.status(401).json( dados );
}
 
module.exports = login
