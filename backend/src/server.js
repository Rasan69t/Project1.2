require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

const authRoutes       = require('./routes/auth.routes')
const filieresRoutes   = require('./routes/filieres.routes')
const matieresRoutes   = require('./routes/matieres.routes')
const etudiantsRoutes  = require('./routes/etudiants.routes')
const epreuvesRoutes   = require('./routes/epreuves.routes')
const epreuveFilRoutes = require('./routes/epreuveFil.routes')
const statsRoutes      = require('./routes/stats.routes')

const app  = express()
const PORT = process.env.PORT || 3000

// ── Middlewares globaux ──────────────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173', // URL de ton frontend Vite
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Servir les fichiers PDF uploadés (accès public)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes)
app.use('/api/filieres',    filieresRoutes)
app.use('/api/matieres',    matieresRoutes)
app.use('/api/etudiants',   etudiantsRoutes)
app.use('/api/epreuves',    epreuvesRoutes)
app.use('/api/epreuve-fil', epreuveFilRoutes)
app.use('/api/stats',       statsRoutes)

// ── Route test ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'API Epreuves operationnelle', version: '1.0' })
})

// ── Middleware gestion des erreurs ───────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erreur interne du serveur', details: err.message })
})

app.listen(PORT, () => {
  console.log(`Serveur demarré sur http://localhost:${PORT}`)
})