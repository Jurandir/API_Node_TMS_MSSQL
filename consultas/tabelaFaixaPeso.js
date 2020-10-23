const { poolPromise } = require('../connection/dbTMS')

async function tabelaFaixaPeso( req, res ) {

    if ( req.method == 'GET' ) {
       var { cnpj } = req.query
    }

    if ( req.method == 'POST' ) {
        var { cnpj } = req.body
    }
 
    var s_select = `select cif.cli_cgccpf,concat(cif.srv_codigo,' - ',srv.nome) as servico, cid.nome as cidade, cif.tre_codigo as trecho, 
                           cif.faixaini, cif.faixafin, cif.valor, cif.pedagio, cif.fretevalor, cif.taxagris, 
	                       cif.despacho, cif.pesominfrete, cif.valorminfrete
		           from cif
		                left join cid on cid.codigo = cast(SUBSTRING(cif.tre_codigo, 4, 3) as varchar(3))
		                left join srv on srv.codigo = cif.srv_codigo	
                    where 1=1 `
    var s_cnpj    = ''
    var s_orderBy = ' order by cif.cli_cgccpf,cif.srv_codigo,cif.tre_codigo,cif.faixaini'

    if (cnpj) { s_cnpj = ` and cif.cli_cgccpf = '${cnpj}'`}

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

module.exports = tabelaFaixaPeso

// Teste 1:
// http://localhost:5000/tabelaFaixaPeso?cnpj=01188406000102
