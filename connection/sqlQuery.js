const { poolPromise } = require('./db')

async function sqlQuery( sSQL, fn1 ) {      
    try {  
        const pool = await poolPromise 
        const result = await pool.request()  
        .query( sSQL ,function(err, profileset){  
            
            console.log('sqlQuery',1000)

            if (err) {  

                console.log('sqlQuery ERRO:',err)

                fn1( { "Erro" : err }  )

                return { "Erro" : err }

            } else { 
                var resultado = profileset.recordset; 
                console.log('sqlQuery',resultado,sSQL)
                fn1(resultado)
                return resultado
                //pool.close  
            }  
        })  
        } catch (err) {  
            fn1( { "Erro" : err.message } )
        } 
}
module.exports = sqlQuery
