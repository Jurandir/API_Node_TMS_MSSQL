const express                 = require('express')
const router                  = express.Router()

const showTest                = require('../controllers/showTest')

router.use('/showTest'   , showTest )

module.exports = router
