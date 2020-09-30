const { poolPromise } = require('./db')

async function sqlQuery( sSQL, fn1 ) {      
    try {  
        const pool = await poolPromise 
        const result = await pool.request()  
        .query( sSQL ,function(err, profileset){  
            if (err) {  
                fn1( { "Erro" : err }  )
            } else { 
                var resultado = profileset.recordset; 
                fn1(resultado)
                pool.close  
            }  
        })  
        } catch (err) {  
            fn1( { "Erro" : err.message } )
        } 
}
module.exports = sqlQuery
