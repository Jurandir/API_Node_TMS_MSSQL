const { poolPromise } = require('./db')

async function sqlQuery( sSQL, fn1 ) {      
    try {  
        let pool = await poolPromise 
        let result = await pool.request().query( sSQL )
        return result.recordset
    } catch (err) {  
        return ( { "Erro" : err.message } )
    } 
}
module.exports = sqlQuery
