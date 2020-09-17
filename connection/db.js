const sql = require('mssql')  
const config = {  
        user: 'sa',  
        password: '@totvs123',  
        server: "192.168.0.41\\CARGASSQL",  
        database: "CARGASSQL",
        //port: '',
        options: {
            encrypt: false,
            enableArithAbort: true 
        }        
    }  

const poolPromise = new sql.ConnectionPool(config)  
    .connect()  
    .then(pool => {  
        console.log('Connected to MSSQL')  
        return pool  
    })  
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))  

module.exports = { sql, poolPromise  } 