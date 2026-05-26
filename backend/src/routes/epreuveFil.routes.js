
const express         = require('express')
const router          = express.Router()
const ctrl            = require('../controllers/epreuveFil.controller')
const { verifyToken } = require('../middlewares/auth')

router.get('/',       ctrl.getAll)
router.post('/',      verifyToken, ctrl.create)
router.delete('/:id', verifyToken, ctrl.remove)

module.exports = router