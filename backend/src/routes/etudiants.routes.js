const express         = require('express')
const router          = express.Router()
const ctrl            = require('../controllers/etudiants.controller')
const { verifyToken } = require('../middlewares/auth')

// ── Routes PUBLIQUES (sans token) ──────────────────────────────
router.get('/matricule/:matricule', ctrl.getByMatricule)
router.post('/inscription', ctrl.inscription)          // ← NOUVELLE ROUTE

// ── Routes PROTÉGÉES (admin seulement) ───────────────────────
router.get('/',       ctrl.getAll)
router.get('/:id',    ctrl.getById)
router.post('/',      verifyToken, ctrl.create)
router.put('/:id',    verifyToken, ctrl.update)
router.delete('/:id', verifyToken, ctrl.remove)


module.exports = router