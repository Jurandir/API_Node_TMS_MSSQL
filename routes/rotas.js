const express      = require('express')
const router       = express.Router()
const faturacargas = require('../consultas/faturaCargas')
const dae          = require('../consultas/DAE')
const teste        = require('../consultas/teste')

const { poolPromise } = require('../connection/db')  

router.get('/', function(req, res) {
    res
    .send(`<h2>API CARGAS - Termaco:</h2>
           <br>
           <h3>  URL: /faturacargas</h3>
           <h6>  Método: GET / POST </h6>
           <h6>  Descrição: Retorna lista de Faturas</h6>
           <h6>  Parâmetros: cnpj, quitado, dataini, datafin  </h6>
           <h6>  </h6>
        `)
    .status(200)
});

router.use('/faturacargas', faturacargas )
router.use('/dae', dae )

module.exports = router
