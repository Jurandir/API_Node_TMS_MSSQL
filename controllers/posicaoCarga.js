const sqlQuery     = require('../connection/sqlQuery')

async function posicaoCarga( req, res ) {
    var userId_Token = req.userId

    var { valoresParametros } = req.body
    if (valoresParametros) {
        wcnpj     = userId_Token
        wdata_ini = valoresParametros[0]
        wdata_fin = valoresParametros[1]
    } else {
        res.send({ "erro" : "body sem parâmetros", "rotina" : "posicaoCarga", "sql" : "Sem Parâmetros" }).status(500) 
    }    

    var wsql = `SELECT 
                    CNH.DATA,
                    CONCAT(CNH.EMP_CODIGO,'-',CNH.SERIE,'-',CNH.CTRC) as CONHECIMENTO,
                    REME.NOME AS REMETENTE,
                    DEST.NOME AS DESTINATARIO,
                    CNH.NF,
                    CNH.TRE_CODIGO AS TRECHO,
                    CNH.EMP_CODIGO AS FILIAL,
                    CNH.CTRC       AS NUMERO_CTRC,
                    CNH.CHAVECTE,
                    EMP.CGC        AS EMITENTE
                    FROM CNH
                    LEFT JOIN CLI REME ON REME.CGCCPF = CNH.CLI_CGCCPF_REMET
                    LEFT JOIN CLI DEST ON DEST.CGCCPF = CNH.CLI_CGCCPF_REMET
                    LEFT JOIN EMP      ON EMP.CODIGO  = CNH.EMP_CODIGO
                WHERE  
                    ( CNH.CLI_CGCCPF_REMET     = '${wcnpj}'
                    OR  CNH.CLI_CGCCPF_DEST    = '${wcnpj}'
                    OR  CNH.CLI_CGCCPF_PAG     = '${wcnpj}' ) 
                    AND CNH.DATA BETWEEN '${wdata_ini}' AND '${wdata_fin}'
                ORDER BY 
                    CNH.DATA
                `
    try {
        data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} - Params = [ ${wcnpj}, ${wdata_ini}, ${wdata_fin} ]`)
        }  
               
        res.json(data).status(200) 
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "posicaoCarga", "sql" : wsql }).status(500) 
    }    
}

module.exports = posicaoCarga