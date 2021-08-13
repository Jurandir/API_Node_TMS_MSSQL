const express                 = require('express')
const router                  = express.Router()

const showTest                = require('../controllers/showTest')
const itrackPainel            = require('../controllers/itrackPainel')
const confirmaFacil           = require('../controllers/confirmaFacil')
const iTrack                  = require('../controllers/iTrack')

router.use('/showTest'      , showTest )
router.use('/itrackPainel'  , itrackPainel )
router.use('/confirmaFacil' , confirmaFacil )
router.use('/iTrack'        , iTrack )

module.exports = router
