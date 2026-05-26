// components/EpreuvesTable.jsx
// Le champ fichier_pdf contient l'URL complète renvoyée par le backend

const EpreuvesTable = ({ epreuves = [] }) => {

  const handleDownload = (ep) => {
    if (ep.fichier_pdf) {
      // Ouvre l'URL directe du PDF servi par le backend Express
      window.open(ep.fichier_pdf, "_blank");
    } else {
      alert("Aucun fichier PDF disponible pour cette épreuve.");
    }
  };

  if (epreuves.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        Aucune épreuve trouvée.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="px-5 py-3 text-left">Titre</th>
            <th className="px-5 py-3 text-left">Matière</th>
            <th className="px-5 py-3 text-left">Filière(s)</th>
            <th className="px-5 py-3 text-left">Année</th>
            <th className="px-5 py-3 text-left">Statut</th>
            <th className="px-5 py-3 text-left">PDF</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {epreuves.map((ep) => {
            // Données réelles depuis la jointure Supabase
            const matiere  = ep.matieres?.nom || "—";
            const filieres = ep.epreuve_fil
              ?.map((ef) => ef.filieres?.nom)
              .filter(Boolean)
              .join(", ") || "—";

            return (
              <tr key={ep.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3.5 font-medium text-gray-800">{ep.titre}</td>
                <td className="px-5 py-3.5 text-gray-500">{matiere}</td>
                <td className="px-5 py-3.5 text-gray-500">{filieres}</td>
                <td className="px-5 py-3.5 text-gray-500">{ep.annee}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ep.statut === "disponible"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {ep.statut || "—"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => handleDownload(ep)}
                    disabled={!ep.fichier_pdf}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    ⬇ Télécharger
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EpreuvesTable;
