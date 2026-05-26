const supabase = require('../config/supabase');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

// POST /api/auth/login
//
// Une seule page de connexion envoie toujours les deux champs :
//   { nom, matricule, mot_de_passe }
//
// Logique de détection :
//   1. On cherche d'abord un admin avec ce nom dans la table "admins"
//   2. Si admin trouvé → on vérifie le mot de passe (= valeur du champ matricule/mot_de_passe)
//   3. Si aucun admin → on cherche un étudiant par (nomComplet + matricule)
//
// L'étudiant ne sait jamais que la branche admin existe.

async function login(req, res) {
  const { nom, matricule, mot_de_passe } = req.body;

  if (!nom || nom.trim() === '') {
    return res.status(400).json({ error: 'Le champ nom est requis.' });
  }

  // La valeur saisie dans le champ "Matricule" du formulaire.
  // Pour l'étudiant c'est son matricule, pour l'admin c'est son mot de passe.
  // Le front envoie la même valeur dans les deux champs.
  const credential = (mot_de_passe || matricule || '').trim();

  if (!credential) {
    return res.status(400).json({ error: 'Le champ matricule est requis.' });
  }

  try {

    // ══════════════════════════════════════════════════════════════
    // ÉTAPE 1 : Chercher un admin avec ce nom
    // ══════════════════════════════════════════════════════════════
    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('nom', nom.trim())
      .single();

    if (admin) {
      // Un admin existe avec ce nom → vérifier le mot de passe
      const validPassword = await bcrypt.compare(credential, admin.mot_de_passe);

      if (!validPassword) {
        // Mot de passe incorrect → message générique (ne révèle pas que c'est un admin)
        return res.status(401).json({ error: 'Identifiants incorrects.' });
      }

      const token = jwt.sign(
        { id: admin.id, nom: admin.nom, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        role:  'admin',
        token,
        admin: { id: admin.id, nom: admin.nom }
      });
    }

    // ══════════════════════════════════════════════════════════════
    // ÉTAPE 2 : Aucun admin trouvé → chercher un étudiant
    // ══════════════════════════════════════════════════════════════

    // Pour l'étudiant, "credential" est son matricule
    const { data: etudiant } = await supabase
      .from('etudiants')
      .select('*, filieres(id, nom)')
      .eq('matricule', credential)
      .single();

    if (!etudiant) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    // Vérifier le statut du compte étudiant
    if (etudiant.statut !== 'valide') {
      return res.status(403).json({
        error: etudiant.statut === 'en_attente'
          ? "Votre inscription est en attente de validation par l'administrateur."
          : "Votre inscription a été rejetée. Contactez l'administration."
      });
    }

    // Vérifier que le nom complet correspond (insensible à la casse)
    const nomOk = etudiant.nomComplet?.toLowerCase() === nom.trim().toLowerCase();
    if (!nomOk) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    // Connexion étudiant réussie
    return res.json({
      role:     'etudiant',
      etudiant: {
        ...etudiant,
        filiere_id: etudiant.filiere_id ?? etudiant.filieres?.id ?? null
      }
    });

  } catch (err) {
    console.error('[auth.controller] Erreur login :', err);
    return res.status(500).json({ error: 'Erreur serveur. Réessayez plus tard.' });
  }
}

module.exports = { login };