const { poolPromise } = require('../connection/dbTMS')

async function tabelaFretePeso( req, res ) {

    if ( req.method == 'GET' ) {
       var { cnpj } = req.query
    }

    if ( req.method == 'POST' ) {
        var { cnpj } = req.body
    }
 
    var s_select = `select cfr.cli_cgccpf    , concat(cfr.srv_codigo,' - ',srv.nome) as servico, 
                           cid.nome as cidade, cfr.tre_codigo as trecho , cfr.fretepeso , 
                           cfr.fretevalor    , cfr.despacho, cfr.pedagio, cfr.pesominfrete, 
                           cfr.valorminfrete , cfr.taxagris
		            from cfr
		                inner join cid on cid.codigo = cast(SUBSTRING(cfr.tre_codigo, 4, 3) as varchar(3))
		                left  join srv on srv.codigo = cfr.srv_codigo
                    where 1=1 `
    var s_cnpj    = ''
    var s_orderBy = ' order by srv.nome,cid.nome'

    if (cnpj) { s_cnpj = ` and cfr.cli_cgccpf = '${cnpj}'`}

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

module.exports = tabelaFretePeso

// Teste 1:
// http://localhost:5000/tabelaFretePeso?cnpj=11606365000180
