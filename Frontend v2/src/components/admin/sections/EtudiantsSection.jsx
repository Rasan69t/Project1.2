import { useState } from 'react'
import api from '../../../api/index'

export default function EtudiantsSection({ etudiants, onDelete, onAdd, onRefresh }) {
  const [search, setSearch] = useState('')

  const filtered = etudiants.filter(e => {
    const name = (e.nomComplet || '').toLowerCase()
    return name.includes(search.toLowerCase()) ||
           e.matricule.toLowerCase().includes(search.toLowerCase())
  })

  // Séparer : en attente | validés
  const enAttente = filtered.filter(e => e.statut === 'en_attente')
  const valides   = filtered.filter(e => e.statut !== 'en_attente')

  const handleValider = async (id) => {
  await api.put(`/etudiants/${id}`, { statut: 'valide' })
  onRefresh()
  }

  const handleRejeter = async (id) => {
    if (window.confirm("Rejeter cette inscription ?")) {
      await api.put(`/etudiants/${id}`, { statut: 'rejete' })
      onRefresh()
    }
  }

  const badgeStatut = (statut) => {
    const map = {
      en_attente: 'bg-yellow-50 text-yellow-700',
      valide:     'bg-green-50 text-green-700',
      rejete:     'bg-red-50 text-red-600'
    }
    const label = { en_attente: 'En attente', valide: 'Validé', rejete: 'Rejeté' }
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[statut] || ''}`}>
        {label[statut] || statut}
      </span>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Gestion des Étudiants</h1>
        <button onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
          + Ajouter manuellement
        </button>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou matricule..."
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </div>

      {/* Inscriptions en attente */}
      {enAttente.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-yellow-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
            Inscriptions en attente ({enAttente.length})
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-yellow-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-yellow-50 text-gray-500 text-xs uppercase">
                <tr>
                  {['Nom Complet', 'Matricule', 'Email', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-3 ${h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {enAttente.map(e => (
                  <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{e.nomComplet}</td>
                    <td className="px-6 py-4">{e.matricule}</td>
                    <td className="px-6 py-4 text-gray-400">{e.email || '—'}</td>
                    <td className="px-6 py-4 text-center flex gap-2 justify-center">
                      <button onClick={() => handleValider(e.id)}
                        className="bg-green-50 hover:bg-green-100 text-green-700 text-xs px-3 py-1 rounded-lg transition font-medium">
                        ✓ Valider
                      </button>
                      <button onClick={() => handleRejeter(e.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg transition">
                        ✕ Rejeter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tous les étudiants */}
      <button onClick={onRefresh} className="text-sm text-blue-600 underline">
  🔄 Actualiser
</button>
      <h2 className="text-sm font-semibold text-gray-500 mb-2">Tous les étudiants</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Nom Complet', 'Matricule', 'Email', 'Filière', 'Statut', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-3 ${h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {valides.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Aucun étudiant</td></tr>
              ) : (
                valides.map(e => (
                  <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{e.nomComplet}</td>
                    <td className="px-6 py-4">{e.matricule}</td>
                    <td className="px-6 py-4 text-gray-400">{e.email || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {e.filieres?.nom ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{badgeStatut(e.statut)}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => onDelete(e.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg transition">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}