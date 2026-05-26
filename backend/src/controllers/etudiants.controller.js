const supabase = require('../config/supabase')

// GET /api/etudiants?filiere_id=2
async function getAll(req, res) {
  const { filiere_id } = req.query

  let query = supabase
    .from('etudiants')
    .select('*, filieres(id, nom)')
    .order('nomComplet')

  if (filiere_id) {
    query = query.eq('filiere_id', filiere_id)
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// GET /api/etudiants/matricule/:matricule
async function getByMatricule(req, res) {
  const { matricule } = req.params

  const { data, error } = await supabase
    .from('etudiants')
    .select('*, filieres(id, nom)')
    .eq('matricule', matricule)
    .single()

  if (error || !data) {
    return res.status(404).json({ error: 'Étudiant introuvable' })
  }
  res.json(data)
}

// GET /api/etudiants/:id
async function getById(req, res) {
  const { id } = req.params
  const { data, error } = await supabase
    .from('etudiants')
    .select('*, filieres(id, nom)')
    .eq('id', id)
    .single()

  if (error) return res.status(404).json({ error: 'Étudiant introuvable' })
  res.json(data)
}

// POST /api/etudiants (création manuelle par admin)
async function create(req, res) {
  const { nomComplet, matricule, email, filiere_id } = req.body

  if (!nomComplet || !matricule) {
    return res.status(400).json({ error: 'Nom complet et matricule sont requis' })
  }

  const { data, error } = await supabase
    .from('etudiants')
    .insert([{ nomComplet, matricule, email, filiere_id }])
    .select('*, filieres(id, nom)')
    .single()

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ce matricule existe déjà' })
    }
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json(data)
}

// PUT /api/etudiants/:id — ne met à jour que les champs fournis
async function update(req, res) {
  const { id } = req.params
  const updates = {}

  if (req.body.nomComplet  !== undefined) updates.nomComplet  = req.body.nomComplet
  if (req.body.matricule   !== undefined) updates.matricule   = req.body.matricule
  if (req.body.email       !== undefined) updates.email       = req.body.email
  if (req.body.filiere_id  !== undefined) updates.filiere_id  = req.body.filiere_id
  if (req.body.statut      !== undefined) updates.statut      = req.body.statut

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Aucune donnée à mettre à jour' })
  }

  const { data, error } = await supabase
    .from('etudiants')
    .update(updates)
    .eq('id', id)
    .select('*, filieres(id, nom)')
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// DELETE /api/etudiants/:id
async function remove(req, res) {
  const { id } = req.params
  const { error } = await supabase.from('etudiants').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Étudiant supprimé' })
}

// POST /api/etudiants/inscription — Route PUBLIQUE (sans token)
// L'étudiant choisit sa filière dès l'inscription
async function inscription(req, res) {
  const { nom, prenom, matricule, email, filiere_id } = req.body

  if (!nom || !prenom || !matricule || !email) {
    return res.status(400).json({
      error: 'Nom, prénom, matricule et email sont requis'
    })
  }

  if (!filiere_id) {
    return res.status(400).json({
      error: 'Veuillez choisir une filière'
    })
  }

  // Construire le nom complet au format "NOM Prénom" pour cohérence avec la connexion
  const nomComplet = `${nom.trim()} ${prenom.trim()}`

  // Vérifier si le matricule existe déjà
  const { data: existing } = await supabase
    .from('etudiants')
    .select('id')
    .eq('matricule', matricule.trim())
    .single()

  if (existing) {
    return res.status(409).json({ error: 'Ce matricule est déjà enregistré' })
  }

  // Vérifier que la filière existe
  const { data: filiere } = await supabase
    .from('filieres')
    .select('id, nom')
    .eq('id', filiere_id)
    .single()

  if (!filiere) {
    return res.status(400).json({ error: 'Filière introuvable' })
  }

  const { data, error } = await supabase
    .from('etudiants')
    .insert([{
      nomComplet,
      matricule:  matricule.trim(),
      email:      email.trim(),
      filiere_id: parseInt(filiere_id),
      statut:     'en_attente'
    }])
    .select('*, filieres(id, nom)')
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json({
    message: "Inscription envoyée avec succès. En attente de validation par l'administrateur.",
    etudiant: data
  })
}

module.exports = { getAll, getByMatricule, getById, create, update, remove, inscription }
