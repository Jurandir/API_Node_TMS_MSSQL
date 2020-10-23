const { poolPromise } = require('../connection/dbTMS')

async function tabelaColetaEntrega( req, res ) {

    if ( req.method == 'GET' ) {
       var { cnpj } = req.query
    }

    if ( req.method == 'POST' ) {
        var { cnpj } = req.body
    }
 
    var s_select = `select cli_cgccpf, volume, coleta, entrega
                    from cce
                    where 1=1 `

    var s_cnpj    = ''
    var s_orderBy = ' order by cli_cgccpf,volume'

    if (cnpj) { s_cnpj = ` and cce.cli_cgccpf = '${cnpj}'`}

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

module.exports = tabelaColetaEntrega

// Teste 1:
// http://localhost:5000/tabelaColetaEntrega?cnpj=93752442000507
