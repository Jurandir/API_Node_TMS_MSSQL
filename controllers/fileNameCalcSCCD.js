const sqlQuery     = require('../connection/sqlQuery')

async function fileNameCalcSCCD( req, res ) {
    let {par_id} = req.query

    var wsql = `SELECT A.*,CONCAT (CARTAFRETE,'_',FILIAL_APP,'_img_',FILE_SEQ) FILENAME
                FROM (
                    SELECT ROW_NUMBER() OVER (
                            PARTITION BY DOCUMENTO
                            ,OPERACAO
                            ,FILIAL_APP ORDER BY IMAGEM_ID ASC
                            ) AS FILE_SEQ
                        ,SUBSTRING(DOCUMENTO, 1, 3) FILIAL
                        ,SUBSTRING(DOCUMENTO, 1, 3) + SUBSTRING(DOCUMENTO, 5, 16) CARTAFRETE
                        ,OPERACAO
                        ,FILIAL_APP
                        ,ID
                        ,DESTINO
                    FROM  SIC.dbo.SCCD_APP B
                    ) A
                WHERE ID = ${par_id}
    `
	
	let retorno = {
        success : false,
        message : 'Dados não encontrados !!!',
        data: [],
    }
				
    try {
        data = await sqlQuery(wsql)
  
        let { Erro } = data
        if (Erro) { 
          throw new Error(`DB ERRO - ${Erro} `)
        }  
		
		retorno.success = (data.length > 0)
        retorno.data    = data[0]
        retorno.isErr   = false
        retorno.message = ( retorno.success==true ? 'Sucesso. OK.' : retorno.message )
               
        res.json(retorno).status(200).end() 
  
    } catch (err) { 
        retorno.isErr   = true	    
		retorno.message = err.message
		retorno.sql     = wsql
		retorno.rotine  = "fileNameCalcSCCD"
        res.json(retorno).status(500).end() 
    }    
}

module.exports = fileNameCalcSCCD
