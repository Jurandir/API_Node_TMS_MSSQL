const express                 = require('express')
const router                  = express.Router()

const showTest                = require('../controllers/showTest')
const itrackPainel            = require('../controllers/itrackPainel')


router.use('/showTest'     , showTest )
router.use('/itrackPainel' , itrackPainel )

module.exports = router
