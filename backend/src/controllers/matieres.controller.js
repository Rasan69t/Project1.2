const supabase = require('../config/supabase')

async function getAll(req, res) {
  const { data, error } = await supabase
    .from('matieres')
    .select('*')
    .order('nom')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

async function getById(req, res) {
  const { id } = req.params
  const { data, error } = await supabase
    .from('matieres')
    .select('*, epreuves(*)')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Matière introuvable' })
  res.json(data)
}

async function create(req, res) {
  const { nom, description } = req.body
  if (!nom) return res.status(400).json({ error: 'Le nom est requis' })

  const { data, error } = await supabase
    .from('matieres')
    .insert([{ nom, description }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
}

async function update(req, res) {
  const { id } = req.params
  const { nom, description } = req.body

  const { data, error } = await supabase
    .from('matieres')
    .update({ nom, description })
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

async function remove(req, res) {
  const { id } = req.params
  const { error } = await supabase.from('matieres').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Matière supprimée' })
}

module.exports = { getAll, getById, create, update, remove }