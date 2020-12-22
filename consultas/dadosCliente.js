const { poolPromise } = require('../connection/dbTMS')

async function dadosCliente( req, res ) {

    if ( req.method == 'GET' ) {
       var { cnpj } = req.query
    }

    if ( req.method == 'POST' ) {
        var { cnpj } = req.body
    }
	
	let loginAD = ''
	
	if(req.loginAD) {
		loginAD = 'SENHA,'
	}	
 
    var s_select = `SELECT TOP  1 * FROM (
						SELECT ${loginAD}NOME,RAZAO,CGCCPF as CNPJ,CGF as IE,ENDERECO,NUMERO,BAIRRO,CID_CODIGO as CIDADE,CEP 
						FROM CLI WHERE CGCCPF = '${cnpj}' AND CGCCPF > '00000000000000'
					UNION ALL
						SELECT ${loginAD}NOME,RAZAO,CGCCPF as CNPJ,CGF as IE,ENDERECO,NUMERO,BAIRRO,CID_CODIGO as CIDADE,CEP 
						FROM CLI WHERE CGCCPF = '20650899000103'
					) AS CLI`
        
    try {  
        const pool = await poolPromise  
        const result = await pool.request()  
        .query( s_select ,function(err, profileset){  
            if (err) {  
                console.log(err)  
            } else {  
                var send_data = profileset.recordset[0]; 
                res.json(send_data).status(200);
                pool.close  
            }  
        })  
        } catch (err) {  
            res.send(err.message).status(500)  
        } 
}

module.exports = dadosCliente
