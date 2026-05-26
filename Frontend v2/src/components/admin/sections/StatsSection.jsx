import { useState, useEffect, useCallback } from 'react'
import { getStats } from '../../../api/index'

export default function StatsSection() {
  const [stats,           setStats]           = useState(null)
  const [recentEtudiants, setRecentEtudiants] = useState([])
  const [recentEpreuves,  setRecentEpreuves]  = useState([])
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState('')

  const loadStats = useCallback(() => {
    setLoading(true)
    setError('')
    console.log('🔄 Appel getStats...')  // ← ajoute cette ligne
    getStats()
      .then(res => {
        console.log('✅ Réponse stats:', res.data)  // ← et celle-ci
        setStats(res.data.stats)
        setRecentEtudiants(res.data.recentEtudiants ?? [])
        setRecentEpreuves(res.data.recentEpreuves ?? [])
      })
      .catch((err) => {
        console.log('❌ Erreur stats:', err)  // ← et celle-ci
        setError('Erreur : ' + (err.response?.data?.error || err.message))
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadStats()                                    // ← chargement immédiat au montage
    const interval = setInterval(loadStats, 30000) // ← rafraîchissement toutes les 30s

    return () => {
      clearInterval(interval)
    }
  }, [loadStats])

  if (loading) return <div className="text-sm text-gray-400">Chargement des stats...</div>
  if (error)   return <div className="text-sm text-red-500">{error}</div>

  const CARDS = [
    { label: 'Total Étudiants',      value: stats?.totalEtudiants ?? 0, color: 'text-green-500'  },
    { label: 'Épreuves disponibles', value: stats?.totalEpreuves  ?? 0, color: 'text-blue-500'   },
    { label: 'Filières',             value: stats?.totalFilieres  ?? 0, color: 'text-purple-500' },
    { label: 'Matières',             value: stats?.totalMatieres  ?? 0, color: 'text-orange-500' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Tableau de Bord</h1>
        <button
          onClick={loadStats}
          className="text-sm text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition"
        >
          🔄 Rafraîchir
        </button>
      </div>

      {/* Cards stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {CARDS.map((c, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{c.label}</p>
            <p className="text-3xl font-semibold text-gray-800">{c.value}</p>
            <p className={`text-xs mt-1 ${c.color}`}>Données en temps réel</p>
          </div>
        ))}
      </div>

      {/* Derniers étudiants inscrits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Derniers étudiants inscrits</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Nom Complet', 'Matricule', 'Filière'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {recentEtudiants.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-gray-400">
                    Aucun étudiant inscrit
                  </td>
                </tr>
              ) : (
                recentEtudiants.map(e => (
                  <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{e.nomComplet}</td>
                    <td className="px-6 py-4">{e.matricule}</td>
                    <td className="px-6 py-4">{e.filieres?.nom ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dernières épreuves ajoutées */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Dernières épreuves ajoutées</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Titre', 'Matière', 'Année', 'Statut'].map(h => (
                  <th key={h} className="px-6 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {recentEpreuves.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-400">
                    Aucune épreuve ajoutée
                  </td>
                </tr>
              ) : (
                recentEpreuves.map(e => (
                  <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{e.titre}</td>
                    <td className="px-6 py-4">{e.matieres?.nom ?? '—'}</td>
                    <td className="px-6 py-4">{e.annee}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        e.statut === 'disponible'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {e.statut}
                      </span>
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