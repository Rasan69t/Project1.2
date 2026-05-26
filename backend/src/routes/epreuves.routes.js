const express         = require('express')
const router          = express.Router()
const ctrl            = require('../controllers/epreuves.controller')
const { verifyToken } = require('../middlewares/auth')
const upload          = require('../middlewares/upload')

router.get('/',    ctrl.getAll)
router.get('/:id', ctrl.getById)

// upload.single('fichier_pdf') : doit correspondre au nom du champ dans le formulaire
router.post('/',      verifyToken, upload.single('fichier_pdf'), ctrl.create)
router.put('/:id',    verifyToken, upload.single('fichier_pdf'), ctrl.update)
router.delete('/:id', verifyToken, ctrl.remove)

module.exports = router