const sql    = require('mssql')  
const config = require('../config/dbsetup.json')  

const poolPromise = new sql.ConnectionPool(config)  
    .connect()  
    .then(pool => {  
        console.log('Conectado com sucesso !!!')  
        return pool  
    })  
    .catch(err => console.log('Falha ao conectar ao BD !!!', err))  

module.exports = { sql, poolPromise  } 