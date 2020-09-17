const express      = require('express')
const router       = express.Router()
const faturacargas = require('../consultas/faturaCargas')

const { poolPromise } = require('../connection/db')  

router.get('/', function(req, res) {
    res.send('API CARGAS - Termaco');
});

router.get('/faturacargas', faturacargas )


router.get('/teste', async function(req, res) {
    try {  
        const pool = await poolPromise  
        const result = await pool.request()  
        .query('select * from AG_EMP',function(err, profileset){  
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
});

// console.log('Rotas exportadas...')

module.exports = router
