const express                 = require('express')
const router                  = express.Router()
const faturacargas            = require('../consultas/faturaCargas')
const dae                     = require('../consultas/DAE')
const tabelaCliente           = require('../consultas/tabelaCliente')
const tabelaFretePeso         = require('../consultas/tabelaFretePeso')
const tabelaPercentualProduto = require('../consultas/tabelaPercentualProduto')
const tabelaFaixaPeso         = require('../consultas/tabelaFaixaPeso')
const tabelaColetaEntrega     = require('../consultas/tabelaColetaEntrega')
const teste                   = require('../consultas/teste')




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

router.use('/dae'                    , dae )
router.use('/faturacargas'           , faturacargas )
router.use('/tabelacliente'          , tabelaCliente )
router.use('/tabelafretepeso'        , tabelaFretePeso )
router.use('/tabelapercentualproduto', tabelaPercentualProduto )
router.use('/tabelafaixapeso'        , tabelaFaixaPeso )
router.use('/tabelacoletaentrega'    , tabelaColetaEntrega )


module.exports = router
