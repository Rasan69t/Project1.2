import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import EpreuvesTable from "../components/EpreuvesTable";

const API = "http://localhost:3000/api";

const Dashboard = () => {
  const [epreuves,        setEpreuves]        = useState([]);
  const [filieres,        setFilieres]        = useState([]);
  const [matieres,        setMatieres]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");
  const [search,          setSearch]          = useState("");
  const [selectedFiliere, setFiliere]         = useState("Toutes");
  const [selectedMatiere, setMatiere]         = useState("Toutes");

  // Récupérer l'étudiant connecté depuis localStorage
  // filiere_id peut être à la racine OU dans l'objet filieres (jointure Supabase)
  const etudiant = JSON.parse(localStorage.getItem("etudiant") || "{}");
  const filiereId = etudiant.filiere_id ?? etudiant.filieres?.id ?? null;
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      // Construire les paramètres de la requête épreuves
        const params = new URLSearchParams({ statut: "disponible" });
        

        const [epRes, filRes, matRes] = await Promise.all([
          fetch(`${API}/epreuves?${params.toString()}`),
          fetch(`${API}/filieres`),
          fetch(`${API}/matieres`),
        ]);

        // Gérer les erreurs HTTP individuellement pour un meilleur diagnostic
        if (!epRes.ok) throw new Error(`Erreur épreuves (${epRes.status})`);
        if (!filRes.ok) throw new Error(`Erreur filières (${filRes.status})`);
        if (!matRes.ok) throw new Error(`Erreur matières (${matRes.status})`);

        const [epData, filData, matData] = await Promise.all([
          epRes.json(),
          filRes.json(),
          matRes.json(),
        ]);

        setEpreuves(Array.isArray(epData) ? epData : []);
        setFilieres(Array.isArray(filData) ? filData : []);
        setMatieres(Array.isArray(matData) ? matData : []);
      } catch (err) {
        setError(err.message || "Impossible de charger les épreuves. Vérifiez votre connexion.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // filiereId en dépendance (stable car vient du localStorage, ne change pas en cours de session)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filiereId]);

  // Stats
  const totalEpreuves = epreuves.length;
  const totalFilieres = filieres.length;

  // Filtrage local
  const filtered = useMemo(() => {
    return epreuves.filter((ep) => {
      const matNom  = ep.matieres?.nom || "";
      const filNoms = ep.epreuve_fil?.map((ef) => ef.filieres?.nom).filter(Boolean) || [];

      const matchFiliere = selectedFiliere === "Toutes" || filNoms.includes(selectedFiliere);
      const matchMatiere = selectedMatiere === "Toutes" || matNom === selectedMatiere;
      const matchSearch  = !search ||
        ep.titre?.toLowerCase().includes(search.toLowerCase()) ||
        matNom.toLowerCase().includes(search.toLowerCase()) ||
        filNoms.some((f) => f.toLowerCase().includes(search.toLowerCase()));

      return matchFiliere && matchMatiere && matchSearch;
    });
  }, [search, selectedFiliere, selectedMatiere, epreuves]);

  // Nom de la filière de l'étudiant pour l'affichage
  const nomFiliere = etudiant.filieres?.nom ?? "—";

  return (
    <div className="min-h-screen bg-gray-100 font-[Poppins]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord Étudiant</h1>
            <p className="text-gray-500 text-sm mt-1">
              Bonjour <strong>{etudiant.nomComplet || "Étudiant"}</strong>
              {nomFiliere !== "—" && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {nomFiliere}
                </span>
              )}
              {" "}— Consultez et téléchargez vos épreuves passées
            </p>
          </div>
        </div>

        {/* Avertissement : pas de filière assignée */}
        {nomFiliere !== "—" && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
            📚 Vous êtes en <strong>{nomFiliere}</strong>. Toutes les épreuves sont disponibles — utilisez les filtres pour affiner.
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">📄</div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Épreuves</p>
              <p className="text-2xl font-bold text-gray-800">{loading ? "…" : totalEpreuves}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🏫</div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Filières</p>
              <p className="text-2xl font-bold text-gray-800">{loading ? "…" : totalFilieres}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 col-span-2 sm:col-span-1">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">🔎</div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Résultats</p>
              <p className="text-2xl font-bold text-gray-800">{loading ? "…" : filtered.length}</p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">
            ⏳ Chargement des épreuves…
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            ❌ {error}
          </div>
        )}

        {/* Contenu principal */}
        {!loading && !error && (
          <>
            <SearchBar value={search} onChange={setSearch} />

            <FilterBar
              filieres={filieres}
              matieres={matieres}
              selectedFiliere={selectedFiliere}
              selectedMatiere={selectedMatiere}
              onFiliereChange={setFiliere}
              onMatiereChange={setMatiere}
            />

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-medium text-gray-500">Aucune épreuve trouvée</p>
                <p className="mt-1">
                  {search || selectedFiliere !== "Toutes" || selectedMatiere !== "Toutes"
                    ? "Essayez de modifier vos filtres ou votre recherche."
                    : filiereId
                      ? "Aucune épreuve disponible pour votre filière pour le moment."
                      : "Aucune épreuve disponible pour le moment."}
                </p>
              </div>
            ) : (
              <EpreuvesTable epreuves={filtered} />
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
