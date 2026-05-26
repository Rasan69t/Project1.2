const supabase = require('../config/supabase')
const path     = require('path')
const fs       = require('fs')

// GET /api/epreuves?filiere_id=1&annee=2023&matiere_id=2
async function getAll(req, res) {
  const { filiere_id, annee, matiere_id, statut } = req.query

  let query = supabase
    .from('epreuves')
    .select(`
      *,
      matieres (id, nom),
      epreuve_fil (
        filieres (id, nom)
      )
    `)
    .order('annee', { ascending: false })

  if (annee)      query = query.eq('annee', parseInt(annee))
  if (matiere_id) query = query.eq('matiere_id', matiere_id)
  if (statut)     query = query.eq('statut', statut)

  // Filtre par filière via la table de liaison epreuve_fil
  if (filiere_id) {
    const { data: liaisons } = await supabase
      .from('epreuve_fil')
      .select('epreuve_id')
      .eq('filiere_id', filiere_id)

    if (liaisons && liaisons.length > 0) {
      const ids = liaisons.map(l => l.epreuve_id)
      query = query.in('id', ids)
    } else {
      return res.json([]) // Aucune épreuve pour cette filière
    }
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// GET /api/epreuves/:id
async function getById(req, res) {
  const { id } = req.params

  const { data, error } = await supabase
    .from('epreuves')
    .select('*, matieres(id, nom), epreuve_fil(filieres(id, nom))')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Épreuve introuvable' })
  res.json(data)
}

// POST /api/epreuves — Créer une épreuve avec upload PDF optionnel
async function create(req, res) {
  const { titre, matiere_id, description, annee, statut, filiere_id } = req.body

  if (!titre || !matiere_id || !annee) {
    return res.status(400).json({ error: 'titre, matiere_id et annee sont requis' })
  }

  // URL du fichier PDF si uploadé
  const fichier_pdf = req.file
    ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    : null

  // 1. Créer l'épreuve
  const { data: epreuve, error } = await supabase
    .from('epreuves')
    .insert([{
      titre,
      matiere_id: parseInt(matiere_id),
      description,
      annee: parseInt(annee),
      fichier_pdf,
      statut: statut || 'disponible'
    }])
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  // 2. Si une filière est fournie, créer la liaison dans epreuve_fil
  if (filiere_id) {
    await supabase
      .from('epreuve_fil')
      .insert([{ epreuve_id: epreuve.id, filiere_id: parseInt(filiere_id) }])
  }

  res.status(201).json(epreuve)
}

// PUT /api/epreuves/:id
async function update(req, res) {
  const { id } = req.params
  const { titre, matiere_id, description, annee, statut } = req.body

  const updates = { titre, description, statut }
  if (matiere_id) updates.matiere_id = parseInt(matiere_id)
  if (annee)      updates.annee      = parseInt(annee)
  if (req.file)   updates.fichier_pdf = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

  const { data, error } = await supabase
    .from('epreuves')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// DELETE /api/epreuves/:id
async function remove(req, res) {
  const { id } = req.params

  // Récupérer l'épreuve pour supprimer le fichier PDF local
  const { data: epreuve } = await supabase
    .from('epreuves')
    .select('fichier_pdf')
    .eq('id', id)
    .single()

  // Supprimer d'abord les liaisons (contrainte FK)
  await supabase.from('epreuve_fil').delete().eq('epreuve_id', id)

  // Supprimer l'épreuve
  const { error } = await supabase.from('epreuves').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })

  // Supprimer le fichier PDF local si présent
  if (epreuve?.fichier_pdf) {
    const filename = epreuve.fichier_pdf.split('/uploads/')[1]
    const filepath = path.join(__dirname, '../../uploads', filename)
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
  }

  res.json({ message: 'Épreuve supprimée avec succès' })
}

module.exports = { getAll, getById, create, update, remove }