const { poolPromise } = require('../connection/dbERP')

async function faturaERP( req, res ) {

    if ( req.method == 'GET' ) {
       var { cnpj, quitado, dataini, datafin } = req.query
    }

    if ( req.method == 'POST' ) {
        var { cnpj, quitado, dataini, datafin } = req.body
    }
    
    var s_select = `SELECT  SE1010.E1_PREFIXO, SE1010.E1_NUM, SE1010.E1_EMISSAO, SE1010.E1_VENCTO, 
                            SE1010.E1_BAIXA,SE1010.E1_VALOR,SE1010.E1_NUMBCO,
                            SEA010.EA_PORTADO, SEA010.EA_AGEDEP, SEA010.EA_NUMCON, 
                            SE1010.E1_FILIAL, SE1010.E1_PARCELA,SE1010.E1_TIPO, SA1010.A1_COD 
                    FROM SE1010
                    LEFT JOIN SEA010 ON SE1010.E1_PREFIXO = SEA010.EA_PREFIXO 
                                    AND SE1010.E1_NUM = SEA010.EA_NUM 
                                    AND SE1010.E1_PARCELA = SEA010.EA_PARCELA
                    LEFT JOIN SA1010 ON SA1010.A1_COD = SE1010.E1_CLIENTE 
                                    AND SE1010.E1_LOJA = SA1010.A1_LOJA
                    WHERE SE1010.E1_TIPO = 'CTE'
                    AND SE1010.E1_FILIAL = '0101'
                    AND SE1010.E1_SITFAT <> 3
                    AND SA1010.A1_CGC in ('${cnpj}')      
                    AND SEA010.D_E_L_E_T_ <> '*' 
                    AND SE1010.D_E_L_E_T_ <> '*' 
                    AND SA1010.D_E_L_E_T_ <> '*'	
    `    
    var s_quitado = ''
    var s_dataini = ''
    var s_datafin = ''
    var s_orderBy = ' ORDER BY E1_NUM'

    if (quitado) { 
        if (quitado=='S') {
            s_quitado = ` AND SE1010.E1_SALDO = 0 AND SE1010.E1_STATUS = 'B'`
        } else {
            s_quitado = ` AND SE1010.E1_SALDO <> 0 AND SE1010.E1_STATUS = 'A'`
        }
    }
    if (dataini) { s_dataini = ` AND SE1010.E1_EMISSAO >= '${dataini}'`}
    if (datafin) { s_datafin = ` SE1010.E1_EMISSAO <= '${datafin}'`}

    var s_sql = s_select + s_quitado + s_dataini + s_datafin + s_orderBy
        
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

module.exports = faturaERP

