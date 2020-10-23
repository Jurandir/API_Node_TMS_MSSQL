const { poolPromise } = require('../connection/dbTMS')

async function tabelaCliente( req, res ) {

    if ( req.method == 'GET' ) {
       var { cnpj } = req.query
    }

    if ( req.method == 'POST' ) {
        var { cnpj } = req.body
    }
 
    var s_select = `select cli.cgccpf, cli.nome, cli.icms, cli.multcub,
	   		            (select count(*) from cfr where cfr.cli_cgccpf = cli.cgccpf)  as reg_FretePeso,
			            (select count(*) from cpp where cpp.cli_cgccpf = cli.cgccpf ) as reg_PercentualProduto,
		                (select count(*) from cif where cif.cli_cgccpf = cli.cgccpf ) as reg_FaixaPeso,
			            (select count(*) from cce where cce.cli_cgccpf = cli.cgccpf ) as reg_ColetaEntrega
		            from cli
                    where 1=1 `
    var s_cnpj    = ''
    var s_orderBy = ' order by cli.nome'

    if (cnpj) { s_cnpj = ` and cli.cgccpf = '${cnpj}'`}

    var s_sql = s_select + s_cnpj + s_orderBy
        
    try {  
        const pool = await poolPromise  
        const result = await pool.request()  
        .query( s_sql ,function(err, profileset){  
            if (err) {  
                console.log(err)  
            } else {  
                var send_data = profileset.recordset; 
                res.json(send_data).status(200);
                pool.close  
            }  
        })  
        } catch (err) {  
            res.send(err.message).status(500)  
        } 
}

module.exports = tabelaCliente

// Teste 1:
// http://localhost:5000/tabelaCliente?cnpj=97837181002190
