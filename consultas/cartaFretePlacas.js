const { poolPromise } = require('../connection/dbTMS')

async function cartaFrete( req, res ) {

    if ( req.method == 'GET' ) {
       var { placas } = req.query
    }

    if ( req.method == 'POST' ) {
        var { placas } = req.body
    }
 
    var s_sql = `SELECT CONCAT(OPG.EMP_CODIGO,'-',OPG.CODIGO) CARTAFRETE,
					  TRIM(CONCAT(VEI_PLACA,' ',CARRETA,' ',VEI_PLACA_SEMIREBOQUE)) PLACAS,
					  MOT.NOME MOTORISTA,
					  TRE_CODIGO TRECHO,
					  DATA
				FROM OPG
				JOIN MOT ON MOT.PRONTUARIO = OPG.MOT_PRONTUARIO
				WHERE (VEI_PLACA='${placas}' OR CARRETA='${placas}' OR VEI_PLACA_SEMIREBOQUE='${placas}')
				and CAST(DATA as date) = (SELECT MAX(CAST(DATA as date)) FROM OPG 
										  WHERE VEI_PLACA='${placas}' OR 
												CARRETA='${placas}' OR 
												VEI_PLACA_SEMIREBOQUE='QTM6509' )
				ORDER BY OPG.DATATU DESC `

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
     				retorno = send_data
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
