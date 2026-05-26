const multer = require('multer')
const path   = require('path')

// Définir où et comment stocker les fichiers uploadés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Dossier de destination
  },
  filename: (req, file, cb) => {
    const timestamp  = Date.now()
    const safeName   = file.originalname
      .normalize('NFD')                          // décomposer les accents
      .replace(/[\u0300-\u036f]/g, '')          // supprimer les accents
      .replace(/\s+/g, '-')                      // espaces → tirets
      .replace(/[^a-zA-Z0-9.\-_]/g, '')        // caractères spéciaux
      .toLowerCase()

    cb(null, `${timestamp}-${safeName}`)
  }
})

// Filtrer pour n'accepter que les PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Seuls les fichiers PDF sont acceptés'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Max 10 MB
})

module.exports = upload