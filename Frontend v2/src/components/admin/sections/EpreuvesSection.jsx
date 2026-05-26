import { useState } from 'react'

export default function EpreuvesSection({ epreuves = [], filieres = [], onDelete, onAdd }) {
  const [search,     setSearch]     = useState('')
  const [filterFil,  setFilterFil]  = useState('')
  const [filterAnnee, setFilterAnnee] = useState('')

  // ── Années disponibles (extraites des épreuves) ───────────────
  const annees = [...new Set(epreuves.map(e => e.annee).filter(Boolean))].sort((a, b) => b - a)

  // ── Filtrage ─────────────────────────────────────────────────
  const filtered = epreuves.filter(ep => {
    const titre   = (ep.titre || '').toLowerCase()
    const matNom  = (ep.matieres?.nom || '').toLowerCase()
    const q       = search.toLowerCase()

    // Les filières d'une épreuve sont dans epreuve_fil[].filieres.id
    const filIds  = (ep.epreuve_fil || []).map(ef => String(ef.filieres?.id)).filter(Boolean)

    const matchSearch  = !q || titre.includes(q) || matNom.includes(q)
    const matchFiliere = !filterFil  || filIds.includes(String(filterFil))
    const matchAnnee   = !filterAnnee || String(ep.annee) === String(filterAnnee)

    return matchSearch && matchFiliere && matchAnnee
  })

  return (
    <div>
      {/* ── En-tête ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Gestion des Épreuves</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {epreuves.length} épreuve{epreuves.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          + Ajouter une épreuve
        </button>
      </div>

      {/* ── Filtres ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par titre ou matière..."
          className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {filieres.length > 0 && (
          <select
            value={filterFil}
            onChange={e => setFilterFil(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">Toutes les filières</option>
            {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
          </select>
        )}
        {annees.length > 0 && (
          <select
            value={filterAnnee}
            onChange={e => setFilterAnnee(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">Toutes les années</option>
            {annees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              <p className="text-3xl mb-2">📄</p>
              <p className="font-medium text-gray-500">
                {epreuves.length === 0
                  ? 'Aucune épreuve ajoutée pour le moment'
                  : 'Aucune épreuve ne correspond à votre recherche'}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left">Titre</th>
                  <th className="px-5 py-3 text-left">Matière</th>
                  <th className="px-5 py-3 text-left">Filières</th>
                  <th className="px-5 py-3 text-left">Année</th>
                  <th className="px-5 py-3 text-left">Statut</th>
                  <th className="px-5 py-3 text-left">Fichier</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 divide-y divide-gray-50">
                {filtered.map(ep => {
                  // Récupérer les noms des filières liées
                  const filNoms = (ep.epreuve_fil || [])
                    .map(ef => ef.filieres?.nom)
                    .filter(Boolean)

                  return (
                    <tr key={ep.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-3.5 font-medium max-w-[200px] truncate">
                        {ep.titre}
                      </td>
                      <td className="px-5 py-3.5">
                        {ep.matieres?.nom
                          ? <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full">{ep.matieres.nom}</span>
                          : <span className="text-gray-300 text-xs">—</span>
                        }
                      </td>
                      <td className="px-5 py-3.5">
                        {filNoms.length > 0
                          ? (
                            <div className="flex flex-wrap gap-1">
                              {filNoms.map(nom => (
                                <span key={nom} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{nom}</span>
                              ))}
                            </div>
                          )
                          : <span className="text-gray-300 text-xs italic">Aucune filière</span>
                        }
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                        {ep.annee || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                          ep.statut === 'disponible'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}>
                          {ep.statut || 'disponible'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {ep.fichier_pdf ? (
                          <a
                            href={ep.fichier_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                          >
                            📄 Voir PDF
                          </a>
                        ) : (
                          <span className="text-gray-300 text-xs">Aucun</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button
                          onClick={() => onDelete(ep.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">
        {filtered.length} résultat{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
        {search && ` pour "${search}"`}
      </p>
    </div>
  )
}
