import { useState, useEffect } from 'react'
import { getMatieres, createMatiere, deleteMatiere } from '../../../api/index'

export default function UploadModal({ filieres, onClose, onSubmit }) {
  const [titre,        setTitre]        = useState('')
  const [matieres,     setMatieres]     = useState([])
  const [matiereId,    setMatiereId]    = useState('')
  const [filiereId,    setFiliereId]    = useState(filieres[0]?.id ?? '')
  const [annee,        setAnnee]        = useState(new Date().getFullYear().toString())
  const [file,         setFile]         = useState(null)
  const [loading,      setLoading]      = useState(false)

  // Nouvelle matière
  const [nouvelleMatiere,    setNouvelleMatiere]    = useState(false)
  const [nomNouvelleMatiere, setNomNouvelleMatiere] = useState('')
  const [creatingMatiere,    setCreatingMatiere]    = useState(false)

  // ✅ Mode gestion (suppression)
  const [gererMatieres, setGererMatieres] = useState(false)

  useEffect(() => {
    getMatieres().then(res => {
      setMatieres(res.data)
      if (res.data.length > 0) setMatiereId(res.data[0].id)
    })
  }, [])

  async function handleCreateMatiere() {
    if (!nomNouvelleMatiere.trim()) { alert('Entrez un nom de matière.'); return }
    setCreatingMatiere(true)
    try {
      const res = await createMatiere(nomNouvelleMatiere.trim())
      const nouvelle = res.data
      setMatieres(prev => [...prev, nouvelle])
      setMatiereId(nouvelle.id)
      setNomNouvelleMatiere('')
      setNouvelleMatiere(false)
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.error || err.message))
    } finally {
      setCreatingMatiere(false)
    }
  }

  // ✅ Supprimer une matière
  async function handleDeleteMatiere(id, nom) {
    if (!confirm(`Supprimer la matière "${nom}" ?`)) return
    try {
      await deleteMatiere(id)
      setMatieres(prev => prev.filter(m => m.id !== id))
      // Si la matière supprimée était sélectionnée, réinitialiser
      if (matiereId === id || matiereId === String(id)) {
        setMatiereId(matieres[0]?.id ?? '')
      }
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.error || err.message))
    }
  }

  async function handleSubmit() {
    if (!titre || !matiereId || !file) {
      alert('Titre, matière et fichier PDF sont requis.')
      return
    }
    const formData = new FormData()
    formData.append('titre',       titre)
    formData.append('matiere_id',  matiereId)
    formData.append('filiere_id',  filiereId)
    formData.append('annee',       annee)
    formData.append('statut',      'disponible')
    formData.append('fichier_pdf', file)
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Uploader une épreuve</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="space-y-4">

          {/* Titre */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Titre de l'épreuve</label>
            <input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex: CC Réseau"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Matière */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-gray-600">Matière</label>
              <div className="flex gap-3">
                {/* ✅ Bouton gérer (supprimer) */}
                <button
                  onClick={() => { setGererMatieres(!gererMatieres); setNouvelleMatiere(false) }}
                  className="text-xs text-red-500 hover:underline"
                >
                  {gererMatieres ? '← Retour' : '🗑 Gérer'}
                </button>
                {/* Bouton nouvelle matière */}
                {!gererMatieres && (
                  <button
                    onClick={() => setNouvelleMatiere(!nouvelleMatiere)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    {nouvelleMatiere ? '← Annuler' : '+ Nouvelle'}
                  </button>
                )}
              </div>
            </div>

            {/* Mode normal — sélection */}
            {!gererMatieres && !nouvelleMatiere && (
              <select value={matiereId} onChange={e => setMatiereId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">— Sélectionner —</option>
                {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>
            )}

            {/* Mode création nouvelle matière */}
            {!gererMatieres && nouvelleMatiere && (
              <div className="flex gap-2">
                <input
                  value={nomNouvelleMatiere}
                  onChange={e => setNomNouvelleMatiere(e.target.value)}
                  placeholder="Ex: Algorithmique"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleCreateMatiere}
                  disabled={creatingMatiere}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
                >
                  {creatingMatiere ? '...' : 'Créer'}
                </button>
              </div>
            )}

            {/* ✅ Mode gestion — liste avec bouton supprimer */}
            {gererMatieres && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {matieres.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">Aucune matière</p>
                ) : (
                  matieres.map(m => (
                    <div key={m.id} className="flex items-center justify-between px-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <span className="text-sm text-gray-700">{m.nom}</span>
                      <button
                        onClick={() => handleDeleteMatiere(m.id, m.nom)}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Matière sélectionnée */}
            {!gererMatieres && matiereId && matieres.find(m => m.id === matiereId || m.id === parseInt(matiereId)) && (
              <p className="text-xs text-green-600 mt-1">
                ✅ {matieres.find(m => m.id === matiereId || m.id === parseInt(matiereId))?.nom}
              </p>
            )}
          </div>

          {/* Filière + Année */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Filière</label>
              <select value={filiereId} onChange={e => setFiliereId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">— Aucune —</option>
                {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Année</label>
              <select value={annee} onChange={e => setAnnee(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                {['2026', '2025', '2024', '2023', '2022', '2021'].map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fichier PDF */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Fichier PDF</label>
            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer"
              onClick={() => document.getElementById('file-input').click()}
            >
              <p className="text-2xl mb-1">📄</p>
              <p className="text-sm text-gray-500">Cliquer pour choisir un PDF</p>
              <p className="text-xs text-gray-400 mt-1">PDF uniquement · max 10MB</p>
              <input type="file" id="file-input" accept=".pdf" className="hidden"
                onChange={e => setFile(e.target.files[0])} />
            </div>
            {file && <p className="text-xs text-blue-600 mt-1">✅ {file.name}</p>}
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
              Annuler
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-60">
              {loading ? 'Upload en cours...' : 'Uploader'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}