import { useState } from 'react'

export default function FiliereModal({ onClose, onSubmit }) {
  const [nom,         setNom]         = useState('')
  const [description, setDescription] = useState('')
  const [loading,     setLoading]     = useState(false)

  async function handleSubmit() {
    if (!nom) { alert('Entrez un nom de filière.'); return }
    setLoading(true)
    try {
      await onSubmit(nom, description)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Ajouter une filière</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nom de la filière</label>
            <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Ex: Génie Civil"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Description (optionnel)</label>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Formation en ingénierie..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
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
