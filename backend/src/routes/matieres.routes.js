const express         = require('express')
const router          = express.Router()
const ctrl            = require('../controllers/matieres.controller')
const { verifyToken } = require('../middlewares/auth')

router.get('/',       ctrl.getAll)
router.get('/:id',    ctrl.getById)
router.post('/',      verifyToken, ctrl.create)
router.put('/:id',    verifyToken, ctrl.update)
router.delete('/:id', verifyToken, ctrl.remove)

module.exports = router