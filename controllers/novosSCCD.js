const sqlQuery     = require('../connection/sqlQuery')

async function novosSCCD( req, res ) {

    var wsql = `SELECT * FROM SIC.dbo.SCCD_APP WHERE DT_SCCD IS NULL`
				
    try {
        data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} `)
        }  
               
        res.json(data).status(200).end() 
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "dadosSCCD", "sql" : wsql }).status(500) 
    }    
}

module.exports = novosSCCD