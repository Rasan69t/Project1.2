import { useState } from 'react'

export default function EtudiantModal({ filieres, onClose, onSubmit }) {
  const [nomComplet, setNomComplet] = useState('')
  const [mat,        setMat]        = useState('')
  const [email,      setEmail]      = useState('')
  const [filiereId,  setFiliereId]  = useState(filieres[0]?.id ?? '')
  const [loading,    setLoading]    = useState(false)

  async function handleSubmit() {
    if (!nomComplet || !mat) { alert('Nom complet et matricule sont requis.'); return }
    setLoading(true)
    try {
      await onSubmit({ nomComplet, matricule: mat, email, filiere_id: filiereId ? parseInt(filiereId) : null })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Ajouter un étudiant</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="space-y-4">

          {/* Nom Complet */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom Complet</label>
            <input value={nomComplet} onChange={e => setNomComplet(e.target.value)}
              placeholder="Ex: Alice Mbarga"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Matricule */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Matricule</label>
            <input value={mat} onChange={e => setMat(e.target.value)}
              placeholder="Ex: ETU005"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email (optionnel)</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Ex: alice@univ.cm"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          {/* Filière */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Filière</label>
            <select value={filiereId} onChange={e => setFiliereId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">— Aucune —</option>
              {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
              Annuler
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-60">
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}