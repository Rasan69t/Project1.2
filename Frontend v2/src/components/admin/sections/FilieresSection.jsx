export default function FilieresSection({ filieres, onDelete, onAdd }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Gestion des Filières</h1>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          + Ajouter une filière
        </button>
      </div>

      {filieres.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
          Aucune filière créée
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filieres.map(f => (
            <div key={f.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{f.nom}</p>
                {f.description && (
                  <p className="text-xs text-gray-400 mt-1">{f.description}</p>
                )}
              </div>
              <button
                onClick={() => onDelete(f.id)}
                className="text-red-400 hover:text-red-600 transition text-sm ml-4"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}