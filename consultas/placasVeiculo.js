const { poolPromise } = require('../connection/dbTMS')

async function placasVeiculo( req, res ) {

    if ( req.method == 'GET' ) {
       var { placas } = req.query
    }

    if ( req.method == 'POST' ) {
        var { placas } = req.body
    }
 
    var s_sql = `SELECT 
					VEI.PLACA,
					VEI.MARCA,
					AGR.NOME AGREGADO,
					VEI.BLOQUEIO,
					CONCAT(CID.NOME,' / ',CID.UF) CIDADE,
					CURRENT_TIMESTAMP DATA
				FROM CARGASSQL.dbo.VEI 
				 JOIN CARGASSQL.dbo.AGR ON AGR.CGCCPF = VEI.AGR_CGCCPF
				 JOIN CARGASSQL.dbo.CID ON CID.CODIGO = VEI.CID_CODIGO
            	WHERE PLACA = '${placas}' `

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

module.exports = placasVeiculo
