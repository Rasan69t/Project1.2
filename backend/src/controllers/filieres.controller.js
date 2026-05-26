const supabase = require('../config/supabase')

// GET /api/filieres — Récupérer toutes les filières
async function getAll(req, res) {
  const { data, error } = await supabase
    .from('filieres')
    .select('*')
    .order('nom')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// GET /api/filieres/:id — Récupérer une filière avec ses étudiants et épreuves
async function getById(req, res) {
  const { id } = req.params

  const { data, error } = await supabase
    .from('filieres')
    .select(`
      *,
      etudiants (id, nom, prenom, matricule, email),
      epreuve_fil (
        epreuves (id, titre, annee, statut)
      )
    `)
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Filière introuvable' })
  res.json(data)
}

// POST /api/filieres — Créer une filière (admin requis)
async function create(req, res) {
  const { nom, description } = req.body

  if (!nom) return res.status(400).json({ error: 'Le nom est requis' })

  const { data, error } = await supabase
    .from('filieres')
    .insert([{ nom, description }])
    .select()
    .single()

  if (error) {
    // Erreur de doublon (contrainte UNIQUE sur nom)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Cette filière existe déjà' })
    }
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json(data)
}

// PUT /api/filieres/:id — Modifier une filière (admin requis)
async function update(req, res) {
  const { id } = req.params
  const { nom, description } = req.body

  const { data, error } = await supabase
    .from('filieres')
    .update({ nom, description })
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// DELETE /api/filieres/:id — Supprimer une filière (admin requis)
async function remove(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('filieres')
    .delete()
    .eq('id', id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Filière supprimée avec succès' })
}

module.exports = { getAll, getById, create, update, remove }
