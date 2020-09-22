const { poolPromise } = require('../connection/db')

async function tabelaPercentualProduto( req, res ) {

    if ( req.method == 'GET' ) {
       var { cnpj } = req.query
    }

    if ( req.method == 'POST' ) {
        var { cnpj } = req.body
    }
 
    var s_select = `select distinct cpp.cli_cgccpf, cid.nome as cidade, cpp.tre_codigo as trecho, cpp.pesominfrete, cpp.valorminfrete
                    from cpp
                    left join cid on cid.codigo = cast(SUBSTRING(cpp.tre_codigo, 4, 3) as varchar(3))
                    where 1=1 `
    var s_cnpj    = ''
    var s_orderBy = ' '

    if (cnpj) { s_cnpj = ` and cpp.cli_cgccpf = '${cnpj}'`}

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

module.exports = tabelaPercentualProduto

// Teste 1:
// http://localhost:5000/tabelaPercentualProduto?cnpj=92660406002243
