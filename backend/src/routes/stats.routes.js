const express             = require('express')
const router              = express.Router()
const { getDashboardStats } = require('../controllers/stats.controller')
const { verifyToken }     = require('../middlewares/auth')

router.get('/', verifyToken, getDashboardStats)

module.exports = router