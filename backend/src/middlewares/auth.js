const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  // Le token doit être dans le header : Authorization: Bearer <token>
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé : token manquant' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded // { id, email, nom_prenom }
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide ou expiré' })
  }
}

module.exports = { verifyToken }