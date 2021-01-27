const sqlQuery     = require('../connection/sqlQuery')

async function listaSCCD_ALB( req, res ) {
	const par_TIPO      = req.body.tipo
	const par_DOCUMENTO = req.body.documento

    var wsql = `SELECT SUBSTRING(DOCUMENTO,1,3) FILIAL,
					   SUBSTRING(DOCUMENTO,5,12) NUMERO_ORDEM,
					   CONCAT(SUBSTRING(DOCUMENTO,1,3),SUBSTRING(DOCUMENTO,5,12)) CARTAFRETE, 
					   FILIAL_APP, 
					   MAX(DT_API) DATA,
					   OPERACAO, 
					   TIPOVEICULO TIPO, 
					   MAX(DT_SCCD) DATA_OPERACAO, 
					   USUARIO,
					   MIN(FLAG_MYSQL) FLAG
				 FROM SIC.dbo.SCCD_APP
				 WHERE TIPO='${par_TIPO}' AND DOCUMENTO = '${par_DOCUMENTO}'
				 GROUP BY 
					   DOCUMENTO, 
					   FILIAL_APP, 
					   OPERACAO, 
					   TIPOVEICULO, 
					   USUARIO `
				
    try {
        data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} `)
        }  
               
        res.json(data).status(200) 
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "dadosSCCD", "sql" : wsql }).status(500) 
    }    
}

module.exports = listaSCCD_ALB