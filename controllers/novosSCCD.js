const sqlQuery     = require('../connection/sqlQuery')

async function novosSCCD( req, res ) {

    var wsql = `
    SELECT TOP 20 * FROM SIC.dbo.SCCD_APP APP 
    WHERE APP.DT_SCCD IS NULL
    AND APP.ID IN (SELECT MIN(OK.ID) FROM SIC.dbo.SCCD_APP OK 
                                     WHERE OK.DOCUMENTO=APP.DOCUMENTO 
                                     GROUP BY OK.FILIAL_APP,OK.IMAGEM_ID )
    ORDER BY APP.ID        
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


/*

select A.* from SCCD_APP A
where A.DOCUMENTO='SPO-56940'
AND ID = (SELECT MIN(ID) FROM SCCD_APP B WHERE B.IMAGEM_ID=A.IMAGEM_ID AND B.DOCUMENTO=A.DOCUMENTO) 
ORDER BY A.ID 

*/
