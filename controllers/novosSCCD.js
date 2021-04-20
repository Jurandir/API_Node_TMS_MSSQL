const sqlQuery     = require('../connection/sqlQuery')

async function novosSCCD( req, res ) {
    
    // Pega de 20 em 20, as fotos registradas, testa se há dulicidade e organiza por IMAGEM_ID 
    // para tentar manter a sequencia que as fotos foram tiradas
    var wsql = `
    SELECT TOP 20 * FROM SIC.dbo.SCCD_APP APP 
    WHERE APP.DT_SCCD IS NULL
    AND APP.ID IN (SELECT MIN(OK.ID) FROM SIC.dbo.SCCD_APP OK 
                                     WHERE OK.DOCUMENTO=APP.DOCUMENTO 
                                     GROUP BY OK.FILIAL_APP,OK.IMAGEM_ID )
    ORDER BY APP.DOCUMENTO,APP.IMAGEM_ID        
    `
				
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
