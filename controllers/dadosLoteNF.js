const sqlQuery     = require('../connection/sqlQuery')

async function dadosLoteNF( req, res ) {
    var userId_Token = req.userId

    var { cnpj, list_nfs } = req.body 
    if ( (cnpj) && (list_nfs) ) {
        cnpj     = cnpj
        list_nfs = list_nfs
    } else {
        res.send({ "erro" : "body sem parâmetros", "rotina" : "dadosLoteNF", "sql" : "Sem todos os Parâmetros" }).status(500) 
    }    

    var wsql = `SELECT DISTINCT 
                    CONCAT (NFR.EMP_CODIGO,'-',NFR.CNH_SERIE,'-',NFR.CNH_CTRC) AS DOCUMENTO,
                    NFR.DATA, CNH.DATAENTREGA ,NFR.NF, NFR.VALOR, NFR.VOLUME, NFR.CHAVENFE, NFR.CLI_CGCCPF_REMET AS EMITENTE_NFE
                FROM NFR
				JOIN CNH ON CNH.EMP_CODIGO=NFR.EMP_CODIGO AND CNH.SERIE=NFR.CNH_SERIE AND CNH.CTRC=NFR.CNH_CTRC
                WHERE 
                    (CNH.CLI_CGCCPF_REMET = '${cnpj}'
					OR 
					CNH.CLI_CGCCPF_DEST = '${cnpj}'
					OR
					CNH.CLI_CGCCPF_PAG = '${cnpj}')	
	                AND NFR.NF IN (${list_nfs})
                `				
    try {
				
        data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} - Params = [ ${cnpj}, ${list_nfs} ]`)
        }  
               
        res.json(data).status(200) 
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "dadosLoteNF", "sql" : wsql }).status(500) 
    }    
}

module.exports = dadosLoteNF