const express                 = require('express')
const router                  = express.Router()
const faturacargas            = require('../consultas/faturaCargas')
const dae                     = require('../consultas/DAE')
const tabelaCliente           = require('../consultas/tabelaCliente')
const tabelaFretePeso         = require('../consultas/tabelaFretePeso')
const tabelaPercentualProduto = require('../consultas/tabelaPercentualProduto')
const tabelaFaixaPeso         = require('../consultas/tabelaFaixaPeso')
const tabelaColetaEntrega     = require('../consultas/tabelaColetaEntrega')
const apiCliente              = require('../consultas/apiCliente')
const login                   = require('../auth/login')
const logout                  = require('../auth/logout')
const validaToken             = require('../auth/verifyToken')


router.post('/login'                 , login )
router.post('/logout'                , logout )

router.use('/dae'                    , dae )
router.use('/faturacargas'           , faturacargas )
router.use('/tabelacliente'          , tabelaCliente )
router.use('/tabelafretepeso'        , tabelaFretePeso )
router.use('/tabelapercentualproduto', tabelaPercentualProduto )
router.use('/tabelafaixapeso'        , tabelaFaixaPeso )
router.use('/tabelacoletaentrega'    , tabelaColetaEntrega )
router.use('/apicliente'             , validaToken, apiCliente )


module.exports = router
