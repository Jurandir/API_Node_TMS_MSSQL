// iTrack.js

const sqlQuery     = require('../connection/sqlQuery')

async function iTrack( req, res ) {
    let params = (req.method=='GET') ? req.query : req.body
    let { danfe } = params
    let retorno = {capa:[],itens:[],cargas:[]}
    
    let wsql = `SELECT NF.*, TIPOCTRC CTRC_TIPO,STATUS CTRC_STATUS,ENTREGADO CTRC_ENTREGUE,DATAENTREGA CTRC_DATAENTREGA
                FROM SIC.dbo.NOTAFISCAL NF
                JOIN CARGASSQL.dbo.CNH ON CNH.EMP_CODIGO=SUBSTRING(NF.DOCUMENTO,1,3) AND  CNH.SERIE=SUBSTRING(NF.DOCUMENTO,4,1) AND  CNH.CTRC=SUBSTRING(NF.DOCUMENTO,5,10)
                WHERE NF.DANFE = '${danfe}'`
				
    try {
        data = await sqlQuery(wsql)
        retorno.capa = data
        let ctrc = data[0].DOCUMENTO

        wsql = `SELECT * FROM SIC.dbo.TRACKING WHERE DANFE = '${danfe}'`
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
        res.send({ "erro" : err.message, "rotina" : "iTrack", "sql" : wsql , req: req.query }).status(500) 
    }    
}

module.exports = iTrack