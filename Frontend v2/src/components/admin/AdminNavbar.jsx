export default function AdminNavbar() {
  // ✅ Lire le nom de l'admin depuis localStorage
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30 h-16">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {admin.nom ? admin.nom[0].toUpperCase() : 'A'}
          </div>
          <span className="font-semibold text-gray-800 text-lg">Panel Admin</span>
          <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-full">
            Administrateur
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* ✅ Nom réel de l'admin */}
          <span className="text-sm text-gray-500">
            Bienvenue, <span className="font-medium text-gray-700">{admin.nom || 'Admin'}</span>
          </span>
          {/* ✅ Déconnexion qui efface le token */}
          <button
            onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}