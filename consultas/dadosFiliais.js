const { poolPromise } = require('../connection/dbTMS')

async function dadosFiliais( req, res ) {

    let {codigo,cid_codigo} = req.query
    let addSql = ''
    let value = ''

    if(codigo) {
       value = `${codigo}`.toUpperCase() 
       addSql = addSql + ` AND (EMP.CODIGO = '${value}') `
    }

    if(cid_codigo) {
        value = `${cid_codigo}`.toUpperCase()
        addSql = addSql + ` AND (EMP.CID_CODIGO = '${value}') `
     }

    
    let resposta = {
        success: false,
        message: 'Dados não localizados !!!',
        data: [],
        rows: 0
    }

    let s_select = `SELECT  EMP.CODIGO,EMP.CGC CNPJ,EMP.NOME,CID.UF,CID.NOME CIDADE,
                            EMP.BAIRRO,EMP.ENDERECO,EMP.NUMERO,EMP.CEP, EMP.FONE,EMP.EMAIL,
                            EMP.CID_CODIGO, EMP.LATITUDE,EMP.LONGITUDE  
                    FROM EMP
                    JOIN CID ON CID.CODIGO = EMP.CID_CODIGO
                    WHERE EMP.LATITUDE IS NOT NULL 
                      AND NOT ( EMP.NOME LIKE '%AEREO%'   )  
                      AND NOT ( EMP.NOME LIKE '%SERVIÇOS%')  
                      AND NOT ( EMP.NOME LIKE '%SERVICOS%')  
                      AND NOT ( EMP.NOME LIKE '%BACKUP%'  ) 
                      AND NOT ( EMP.NOME LIKE '%MINUTA%'  ) 
                      AND NOT ( EMP.NOME LIKE '%BACKUP%'  )
                      ${addSql}
                    ORDER BY CID.UF,CID.NOME `
        
    try {  
        const pool   = await poolPromise  
        const result = await pool.request()  
        .query( s_select ,function(err, profileset){  
            if (err) {
                resposta.success = false
                resposta.message = `ERRO: ${err}`  
            } else {  
                let dados = []
                dados.push(...profileset.recordset)
                resposta.rows    = dados.length
                resposta.success = (resposta.rows>0) ? true : false
                resposta.message = resposta.success ? 'Sucesso. OK.' : resposta.message
                resposta.data    = dados
                res.json(resposta).status(200)
                pool.close  
            }  
        })  
        } catch (err) {  
            resposta.success = false
            resposta.message = 'ERRO: '+err.message
            res.send(resposta).status(500)  
        } 
}

module.exports = dadosFiliais
