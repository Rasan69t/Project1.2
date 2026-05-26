import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api'

const api = axios.create({
  baseURL: BASE_URL,
})

// Intercepteur : ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token') // ✅ Clé corrigée
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// ── AUTH ─────────────────────────────────────────────────────────────────────

export const loginAdmin = (nom, mot_de_passe) =>
  api.post('/auth/login', { nom, mot_de_passe })

// ── STATS ────────────────────────────────────────────────────────────────────

// GET /api/stats — Retourne { stats, recentEtudiants, recentEpreuves }
export const getStats = () => api.get('/stats')

// ── ÉTUDIANTS ────────────────────────────────────────────────────────────────

// GET /api/etudiants?filiere_id=X
export const getEtudiants = (filiere_id) =>
  api.get('/etudiants', { params: filiere_id ? { filiere_id } : {} })

// POST /api/etudiants — Requiert token
export const createEtudiant = (data) => api.post('/etudiants', data)

// PUT /api/etudiants/:id — Requiert token
export const updateEtudiant = (id, data) => api.put(`/etudiants/${id}`, data)

// DELETE /api/etudiants/:id — Requiert token
export const deleteEtudiant = (id) => api.delete(`/etudiants/${id}`)

// ── FILIÈRES ─────────────────────────────────────────────────────────────────

// GET /api/filieres — Public
export const getFilieres = () => api.get('/filieres')

// POST /api/filieres — Requiert token
export const createFiliere = (nom, description = '') =>
  api.post('/filieres', { nom, description })

// PUT /api/filieres/:id — Requiert token
export const updateFiliere = (id, data) => api.put(`/filieres/${id}`, data)

// DELETE /api/filieres/:id — Requiert token
export const deleteFiliere = (id) => api.delete(`/filieres/${id}`)

// ── MATIÈRES ─────────────────────────────────────────────────────────────────

// GET /api/matieres — Public
export const getMatieres = () => api.get('/matieres')

// POST /api/matieres — Requiert token
export const createMatiere = (nom, description = '') =>
  api.post('/matieres', { nom, description })

// DELETE /api/matieres/:id — Requiert token
export const deleteMatiere = (id) => api.delete(`/matieres/${id}`)

// ── ÉPREUVES ─────────────────────────────────────────────────────────────────

// GET /api/epreuves?filiere_id=X&annee=Y&matiere_id=Z
export const getEpreuves = (filters = {}) =>
  api.get('/epreuves', { params: filters })

// POST /api/epreuves — FormData (PDF inclus) — Requiert token
export const createEpreuve = (formData) =>
  api.post('/epreuves', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// DELETE /api/epreuves/:id — Requiert token
export const deleteEpreuve = (id) => api.delete(`/epreuves/${id}`)

export default api