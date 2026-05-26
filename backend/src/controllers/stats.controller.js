const supabase = require('../config/supabase')

// GET /api/stats
async function getDashboardStats(req, res) {
  try {
    // Toutes les requêtes en parallèle pour la performance
    const [
      { count: totalEtudiants },
      { count: totalEpreuves },
      { count: totalFilieres },
      { count: totalMatieres }
    ] = await Promise.all([
      supabase.from('etudiants').select('*', { count: 'exact', head: true }),
      supabase.from('epreuves').select('*', { count: 'exact', head: true }),
      supabase.from('filieres').select('*', { count: 'exact', head: true }),
      supabase.from('matieres').select('*', { count: 'exact', head: true })
    ])

    // Derniers étudiants inscrits
    const { data: recentEtudiants } = await supabase
      .from('etudiants')
      .select('id, nomComplet, matricule, filieres(nom)')
      .order('id', { ascending: false })
      .limit(5)

    // Dernières épreuves ajoutées
    const { data: recentEpreuves } = await supabase
      .from('epreuves')
      .select('id, titre, annee, statut, created_at, matieres(nom)')
      .order('created_at', { ascending: false })
      .limit(5)

    res.json({
      stats: { totalEtudiants, totalEpreuves, totalFilieres, totalMatieres },
      recentEtudiants,
      recentEpreuves
    })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques' })
  }
}

module.exports = { getDashboardStats }