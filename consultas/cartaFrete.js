const { poolPromise } = require('../connection/dbTMS')

async function cartaFrete( req, res ) {

    if ( req.method == 'GET' ) {
       var { empresa,codigo } = req.query
    }

    if ( req.method == 'POST' ) {
        var { empresa,codigo } = req.body
    }
 
    var s_sql = `
	SELECT	
		CONCAT(OPG.EMP_CODIGO,'-',OPG.CODIGO) CARTAFRETE,
		TRIM(CONCAT(VEI_PLACA,' ',CARRETA,' ',VEI_PLACA_SEMIREBOQUE)) PLACAS,
		MOT.NOME MOTORISTA,
		OPG.DATA,
		COUNT(APP.ID) FOTOS_API,
		SUM(ISNULL(APP.FLAG_MYSQL,0)) FOTOS_SCCD,
		COUNT( DISTINCT APP.IMAGEM_ID ) FOTOS_IDS
	FROM CARGASSQL.dbo.OPG
	JOIN CARGASSQL.dbo.MOT ON MOT.PRONTUARIO = OPG.MOT_PRONTUARIO
	LEFT JOIN SIC.dbo.SCCD_APP APP ON APP.DOCUMENTO = CONCAT(OPG.EMP_CODIGO,'-',OPG.CODIGO)
	WHERE OPG.EMP_CODIGO='${empresa}' AND OPG.CODIGO=${codigo}
	GROUP BY OPG.EMP_CODIGO, OPG.CODIGO, OPG.VEI_PLACA, OPG.CARRETA, OPG.VEI_PLACA_SEMIREBOQUE,	MOT.NOME, OPG.DATA `

    try {  
        const pool = await poolPromise  
        const result = await pool.request()  
        .query( s_sql ,function(err, profileset){  
            if (err) {  
                console.log(err)  
            } else {  
                let send_data = profileset.recordset;
                let retorno = {}				
				if (send_data[0]) {
     				retorno = send_data[0]
					retorno.success = true
					retorno.message = 'OK'
				} else {
					retorno.success = false
					retorno.message = 'Dados não encontrados !!!'
				}					
				
                res.json(retorno).status(200);
                pool.close  
            }  
        })  
        } catch (err) {  
            res.send(err.message).status(500)  
        } 
}

module.exports = cartaFrete
