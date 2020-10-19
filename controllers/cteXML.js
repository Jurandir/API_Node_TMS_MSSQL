const sqlQuery     = require('../connection/sqlQuery')

async function cteXML( req, res ) {
    var userId_Token = req.userId

    var { valoresParametros } = req.body
    if (valoresParametros) {
        wempresa = valoresParametros[0]
        wserie   = valoresParametros[1]
        wctrc    = valoresParametros[2]
    } else {
        res.send({ "erro" : "body sem parâmetros", "rotina" : "cteXML", "sql" : "Sem Parâmetros" }).status(500) 
    }    

    var wsql = `SELECT 
                    XCT.XML AS XMLCTE
                FROM 
                    XCT
                WHERE 
                    XCT.EMP_CODIGO='${wempresa}' AND 
                    XCT.CNH_SERIE='${wserie}' AND 
                    XCT.CNH_CTRC='${wctrc}' AND 
                    XCT.ACAO = '1'
                `
    try {
        data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} - Params = [ ${wempresa}, ${wserie}, ${wctrc} ]`)
        }  
               
        res.json(data).status(200) 
  
    } catch (err) { 
        res.send({ "erro" : err.message, "rotina" : "cteXML", "sql" : wsql }).status(500) 
    }    
}

module.exports = cteXML