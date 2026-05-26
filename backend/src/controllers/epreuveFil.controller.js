const supabase = require('../config/supabase')

// GET /api/epreuve-fil
async function getAll(req, res) {
  const { data, error } = await supabase
    .from('epreuve_fil')
    .select('*, epreuves(id, titre, annee), filieres(id, nom)')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// POST /api/epreuve-fil — Lier une épreuve à une filière
async function create(req, res) {
  const { epreuve_id, filiere_id } = req.body

  if (!epreuve_id || !filiere_id) {
    return res.status(400).json({ error: 'epreuve_id et filiere_id sont requis' })
  }

  const { data, error } = await supabase
    .from('epreuve_fil')
    .insert([{ epreuve_id, filiere_id }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
}

// DELETE /api/epreuve-fil/:id
async function remove(req, res) {
  const { id } = req.params
  const { error } = await supabase.from('epreuve_fil').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Liaison supprimée' })
}

module.exports = { getAll, create, remove }