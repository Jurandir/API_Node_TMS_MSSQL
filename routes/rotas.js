const express      = require('express')
const router       = express.Router()
const faturacargas = require('../consultas/faturaCargas')

const { poolPromise } = require('../connection/db')  

router.get('/', function(req, res) {
    res
    .send(`<h2>API CARGAS - Termaco:</h2>
           <br>
           <h6>  URL: /faturacargas</h6>
           <h6>  Método: GET</h6>
           <h6>  Descrição: Retorna lista de Faturas</h6>
           <h6>  Parâmetros: cnpj, quitado, dataini, datafin  </h6>
           <h6>  </h6>
        `)
    .status(200)
});

router.get('/faturacargas', faturacargas )

// console.log('Rotas exportadas...')

module.exports = router
