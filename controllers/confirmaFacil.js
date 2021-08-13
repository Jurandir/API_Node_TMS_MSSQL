// itrackPainel.js

const sqlQuery     = require('../connection/sqlQuery')

async function confirmaFacil( req, res ) {
    let params = (req.method=='GET') ? req.query : req.body
    let { numero } = params
    let retorno = {capa:[],itens:[],cargas:[]}
    
    let wsql = `SELECT * FROM SIC.dbo.CONFIRMAFACIL WHERE NUMERO = ${numero}`
				
    try {
        data = await sqlQuery(wsql)
        retorno.capa = data
        let id   = data[0].ID
        let ctrc = data[0].CTRC

        wsql = `SELECT * FROM SIC.dbo.CONFIRMAFACILOCORRENCIA WHERE CONFIRMAFACIL_ID = ${id}`
        data = await sqlQuery(wsql)
        retorno.itens = data

        wsql = ` SELECT * FROM CARGASSQL.dbo.OUN WHERE CHAVE = '${ctrc}'`
        data = await sqlQuery(wsql)
        retorno.cargas = data
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} `)
        }  
               
        res.json(retorno).status(200).end() 
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "confirmaFacil", "sql" : wsql , req: req.query }).status(500) 
    }    
}

module.exports = confirmaFacil