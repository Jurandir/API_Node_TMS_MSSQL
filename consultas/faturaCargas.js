const { poolPromise } = require('../connection/db')

// Teste 1:
// http://localhost:5000/faturacargas?cnpj=97837181002190&quitado=S&dataini=2020-08-01&datafin=2020-08-17

// Teste 2:
// http://localhost:5000/faturacargas?cnpj=97837181002190&dataini=2020-08-01&datafin=2020-08-17

// Teste 3:
// http://localhost:5000/faturacargas?cnpj=61064838011682&dataini=2020-08-01&datafin=2020-08-17


async function faturaCargas(req, res) {
    
    const { cnpj, quitado, dataini, datafin } = req.query

    // console.log(req.query)

    var s_select = `select fat.cli_cgccpf,isnull(fat.quitado,'N') as quitado,codigo, datafat, datavenc, datapag, valor, fat.bloquete as bloquete, agt_codigo 
                    from fat 
                    where ((fat.status is null) or (fat.status <> 'C'))`
    var s_cnpj    = ''
    var s_quitado = ''
    var s_dataini = ''
    var s_datafin = ''
    var s_orderBy = ' order by fat.datavenc desc'

    if (cnpj)    { s_cnpj    = ` and fat.cli_cgccpf = '${cnpj}'`}
    if (quitado) { s_quitado = ` and isnull(fat.quitado,'N') <> '${quitado}'`}
    if (dataini) { s_dataini = ` and datafat >= '${dataini}'`}
    if (datafin) { s_datafin = ` and datafat <= '${datafin}'`}

    var s_sql = s_select + s_cnpj + s_quitado + s_dataini + s_datafin + s_orderBy
        
    try {  
        const pool = await poolPromise  
        const result = await pool.request()  
        .query( s_sql ,function(err, profileset){  
            if (err) {  
                console.log(err)  
            } else {  
                var send_data = profileset.recordset; 
                res.status(200) 
                res.json(send_data);  
            }  
        })  
        } catch (err) {  
            res.status(500)  
            res.send(err.message)  
        } 
}

module.exports = faturaCargas