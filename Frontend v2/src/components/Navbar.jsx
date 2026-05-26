import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const etudiant = JSON.parse(localStorage.getItem("etudiant") || "{}");
  const nom = etudiant.nomComplet;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("etudiant");
    localStorage.removeItem("nomComplet");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">🎓</span>
          </div>
          <span className="text-blue-700 font-bold text-lg hidden sm:block">EduArchive</span>
        </div>

        {/* Welcome */}
        <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full">
          👋 {nom ? `Bienvenue, ${nom}` : "Bienvenue"}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md active:scale-95"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;