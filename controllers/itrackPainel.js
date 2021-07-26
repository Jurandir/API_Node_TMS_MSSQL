// itrackPainel.js

const sqlQuery     = require('../connection/sqlQuery')

async function itrackPainel( req, res ) {
    
    let wsql = `
		SELECT 
		(SELECT COUNT(*) TOTAL FROM SIC.dbo.NOTAFISCAL NFE) TOTAL,
		(SELECT COUNT(*) PEND_IDCARGAPK FROM SIC.dbo.NOTAFISCAL NFE WHERE IDCARGA=0) PEND_ID,
		(SELECT COUNT(*) ENTR FROM SIC.dbo.NOTAFISCAL NFE WHERE COMPROVANTE_ENVIADO IN(1,2)) ENTREGUE,
		(SELECT COUNT(*) COMP_ENVIADOS FROM SIC.dbo.NOTAFISCAL NFE WHERE COMPROVANTE_ENVIADO=1) COMP_ENVIADOS,
		(SELECT COUNT(*) COMP_INDISPONIVEIS FROM SIC.dbo.NOTAFISCAL NFE WHERE COMPROVANTE_ORIGEM='NOTFOUND') COMP_INDISPONIVEIS,
		(SELECT COUNT(*) TOTAL_TRACKING FROM SIC.dbo.TRACKING) TOTAL_TRACKING,
		(SELECT COUNT(*) ENVI_TRACKING FROM SIC.dbo.TRACKING WHERE RET_SUCESSO=1) ENVI_TRACKING,
		(SELECT COUNT(*) PEND_TRACKING FROM SIC.dbo.TRACKING WHERE RET_SUCESSO<>1) PEND_TRACKING `
				
    try {
        data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} `)
        }  
               
        res.json(data).status(200).end() 
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "itrackPainel", "sql" : wsql }).status(500) 
    }    
}

module.exports = itrackPainel