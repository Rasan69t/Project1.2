import { useState, useEffect, useCallback } from 'react'
import AdminNavbar      from '../components/admin/AdminNavbar'
import AdminSidebar     from '../components/admin/AdminSidebar'
import StatsSection     from '../components/admin/sections/StatsSection'
import EpreuvesSection  from '../components/admin/sections/EpreuvesSection'
import FilieresSection  from '../components/admin/sections/FilieresSection'
import EtudiantsSection from '../components/admin/sections/EtudiantsSection'
import UploadModal      from '../components/admin/modals/UploadModal'
import FiliereModal     from '../components/admin/modals/FiliereModal'
import EtudiantModal    from '../components/admin/modals/EtudiantModal'
import {
  getEtudiants, deleteEtudiant,
  getFilieres,  deleteFiliere,
  getEpreuves,  deleteEpreuve,
  createEtudiant, createFiliere, createEpreuve,
} from '../api/index'

export default function Admin() {
  const [section,   setSection]   = useState('stats')
  const [modal,     setModal]     = useState(null)

  const [epreuves,  setEpreuves]  = useState([])
  const [filieres,  setFilieres]  = useState([])
  const [etudiants, setEtudiants] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  // ── Chargement des données ──────────────────────────────────
  const loadFilieres = useCallback(async () => {
    const res = await getFilieres()
    setFilieres(res.data)
  }, [])

  const loadEtudiants = useCallback(async () => {
    const res = await getEtudiants()
    setEtudiants(res.data)
  }, [])

  const loadEpreuves = useCallback(async () => {
    const res = await getEpreuves()
    setEpreuves(res.data)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([loadFilieres(), loadEtudiants(), loadEpreuves()])
      } catch (err) {
        setError('Erreur de chargement : ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [loadFilieres, loadEtudiants, loadEpreuves])

  // ── Actions CRUD ────────────────────────────────────────────
  const handleAddEpreuve = async (formData) => {
    try {
      await createEpreuve(formData)
      await loadEpreuves()
      setModal(null)
    } catch (err) {
      alert('Erreur lors de l\'upload : ' + (err.response?.data?.error || err.message))
    }
  }

  const handleDelEpreuve = async (id) => {
    if (!confirm('Supprimer cette épreuve ?')) return
    try {
      await deleteEpreuve(id)
      setEpreuves(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.error || err.message))
    }
  }

  const handleAddFiliere = async (nom) => {
    try {
      await createFiliere(nom)
      await loadFilieres()
      setModal(null)
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.error || err.message))
    }
  }

  const handleDelFiliere = async (id) => {
    if (!confirm('Supprimer cette filière ?')) return
    try {
      await deleteFiliere(id)
      setFilieres(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.error || err.message))
    }
  }

  const handleAddEtudiant = async (data) => {
    try {
      await createEtudiant(data)
      await loadEtudiants()
      setModal(null)
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.error || err.message))
    }
  }

  const handleDelEtudiant = async (id) => {
    if (!confirm('Supprimer cet étudiant ?')) return
    try {
      await deleteEtudiant(id)
      setEtudiants(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.error || err.message))
    }
  }

  // ── Rendu ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500 text-sm">Chargement des données...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <AdminNavbar />
      <AdminSidebar activeSection={section} onNavigate={setSection} />

      <main className="ml-52 pt-16 p-6 min-h-screen">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {section === 'stats'     && <StatsSection />}
        {section === 'epreuves'  && (
          <EpreuvesSection
            epreuves={epreuves}
            filieres={filieres}
            onDelete={handleDelEpreuve}
            onAdd={() => setModal('upload')}
          />
        )}
        {section === 'filieres'  && (
          <FilieresSection
            filieres={filieres}
            onDelete={handleDelFiliere}
            onAdd={() => setModal('filiere')}
          />
        )}
        {section === 'etudiants' && (
          <EtudiantsSection
            etudiants={etudiants}
            filieres={filieres}
            onAdd={() => setModal('etudiant')}
            onDelete={handleDelEtudiant}
            onRefresh={loadEtudiants}
          />
        )}
      </main>

      {modal === 'upload'   && (
        <UploadModal
          filieres={filieres}
          onClose={() => setModal(null)}
          onSubmit={handleAddEpreuve}
        />
      )}
      {modal === 'filiere'  && (
        <FiliereModal
          onClose={() => setModal(null)}
          onSubmit={handleAddFiliere}
        />
      )}
      {modal === 'etudiant' && (
        <EtudiantModal
          filieres={filieres}
          onClose={() => setModal(null)}
          onSubmit={handleAddEtudiant}
        />
      )}
    </div>
  )
}
