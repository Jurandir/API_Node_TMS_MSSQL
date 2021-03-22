const { poolPromise } = require('../connection/dbTMS')

async function cartaFrete( req, res ) {

    if ( req.method == 'GET' ) {
       var { placas } = req.query
    }

    if ( req.method == 'POST' ) {
        var { placas } = req.body
    }
 
    var s_sql = `SELECT OPG.EMP_CODIGO EMPRESA,OPG.CODIGO,CONCAT(OPG.EMP_CODIGO,'-',OPG.CODIGO) CARTAFRETE,
					  TRIM(CONCAT(VEI_PLACA,' ',CARRETA,' ',VEI_PLACA_SEMIREBOQUE)) PLACAS,
					  TRIM(CONCAT(CID.NOME,' / ',CID.UF)) CIDADE,
					  MOT.NOME MOTORISTA,
					  TRE_CODIGO TRECHO,
					  DATA
				FROM CARGASSQL.dbo.OPG
				JOIN CARGASSQL.dbo.MOT ON MOT.PRONTUARIO = OPG.MOT_PRONTUARIO
				JOIN CARGASSQL.dbo.VEI ON PLACA = '${placas}'
				JOIN CARGASSQL.dbo.CID ON CID.CODIGO = VEI.CID_CODIGO				
				WHERE (VEI_PLACA='${placas}' OR CARRETA='${placas}' OR VEI_PLACA_SEMIREBOQUE='${placas}')
				and CAST(DATA as date) >= (SELECT DATEADD(DAY, -5, MAX(CAST(DATA as date)) ) FROM OPG 
										  WHERE VEI_PLACA='${placas}' OR 
												CARRETA='${placas}' OR 
												VEI_PLACA_SEMIREBOQUE='${placas}' )
				ORDER BY OPG.DATATU DESC `

    try {  
		let retorno = {
			success: false,
			message: 'Dados não localizados !!!',
			data: []
		}

        const pool = await poolPromise  
        const result = await pool.request()  
        .query( s_sql ,function(err, profileset){  
            if (err) {  
					retorno.success = false
					retorno.message = 'ERRO: '+err
                    console.log(err)  
            } else {  
                let send_data = profileset.recordset;
				if (send_data[0]) {
     				retorno.data = send_data
					retorno.success = true
					retorno.message = 'Success. OK.'
				} else {
					retorno.success = false
					retorno.message = 'Dados não localizados !!!'
				}					
				
                res.json(retorno).status(200);
                pool.close  
            }  
        })  
        } catch (err) {
            retorno.message = err.message			
            res.send(retorno).status(500)  
        } 
}

module.exports = cartaFrete
