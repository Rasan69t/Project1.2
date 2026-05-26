// components/FilterBar.jsx
// Reçoit maintenant les vraies listes filieres[] et matieres[] depuis l'API

const FilterBar = ({
  filieres = [],
  matieres = [],
  selectedFiliere,
  selectedMatiere,
  onFiliereChange,
  onMatiereChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Filtre Filière */}
      <select
        value={selectedFiliere}
        onChange={(e) => onFiliereChange(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 outline-none focus:border-blue-400 transition cursor-pointer"
      >
        <option value="Toutes">Toutes les filières</option>
        {filieres.map((f) => (
          <option key={f.id} value={f.nom}>{f.nom}</option>
        ))}
      </select>

      {/* Filtre Matière */}
      <select
        value={selectedMatiere}
        onChange={(e) => onMatiereChange(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 outline-none focus:border-blue-400 transition cursor-pointer"
      >
        <option value="Toutes">Toutes les matières</option>
        {matieres.map((m) => (
          <option key={m.id} value={m.nom}>{m.nom}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
