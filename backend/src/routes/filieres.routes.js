const express         = require('express')
const router          = express.Router()
const ctrl            = require('../controllers/filieres.controller')
const { verifyToken } = require('../middlewares/auth')

router.get('/',       ctrl.getAll)            // Public : le frontend en a besoin pour les selects
router.get('/:id',    ctrl.getById)           // Public
router.post('/',      verifyToken, ctrl.create)    // Admin uniquement
router.put('/:id',    verifyToken, ctrl.update)    // Admin uniquement
router.delete('/:id', verifyToken, ctrl.remove)    // Admin uniquement

module.exports = router