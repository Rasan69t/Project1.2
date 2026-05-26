import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api";

export default function AdminLogin() {
  const [nom,           setNom]           = useState("");
  const [motDePasse,    setMotDePasse]     = useState("");
  const [showPassword,  setShowPassword]   = useState(false);
  const [loading,       setLoading]        = useState(false);
  const [error,         setError]          = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom.trim(),
          mot_de_passe: motDePasse,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Identifiants incorrects.");
        setLoading(false);
        return;
      }

      // Sauvegarder le token et les infos admin
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin",       JSON.stringify(data.admin));

      // Rediriger vers le dashboard admin
      navigate("/admin");

    } catch {
      setError("Impossible de joindre le serveur. Vérifiez que le backend tourne.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[#0f1117] text-[#e8e6df]">

      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-[#16191f] border-r border-white/10 relative overflow-hidden">

        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(232,199,125,0.06)_0%,transparent_70%)]" />

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#e8c77d] flex items-center justify-center">
            <svg className="w-4 h-4 fill-[#0f1117]" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-serif text-[17px]">EduArchive</span>
        </div>

        <div>
          <h1 className="font-serif text-4xl leading-tight mb-5">
            Panneau<br /> d'
            <span className="text-[#e8c77d]">administration</span>
          </h1>

          <p className="text-sm text-[#7a7870] max-w-xs leading-relaxed">
            Gérez les épreuves, les filières, les matières et les étudiants depuis un espace centralisé et sécurisé.
          </p>

          <div className="flex gap-8 mt-8">
            <div>
              <div className="text-xl text-[#e8c77d] font-medium">∞</div>
              <div className="text-xs text-[#7a7870] uppercase tracking-wider">Épreuves</div>
            </div>
            <div>
              <div className="text-xl text-[#e8c77d] font-medium">100%</div>
              <div className="text-xs text-[#7a7870] uppercase tracking-wider">Sécurisé</div>
            </div>
            <div>
              <div className="text-xl text-[#e8c77d] font-medium">PDF</div>
              <div className="text-xs text-[#7a7870] uppercase tracking-wider">Format</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-[#7a7870]">
          © 2025 EduArchive — Accès restreint aux administrateurs
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-12">
        <div className="w-full max-w-sm">

          <div className="mb-10">
            <div className="inline-block px-3 py-1 rounded-full text-xs uppercase tracking-widest text-[#e8c77d] border border-[#e8c77d]/30 bg-[#e8c77d]/10 mb-4">
              Administrateur
            </div>
            <h2 className="font-serif text-2xl mb-1">Connexion</h2>
            <p className="text-sm text-[#7a7870]">
              Entrez vos identifiants pour accéder au tableau de bord.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* NOM */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7a7870] mb-2">
                Nom
              </label>
              <div className="relative">
                <input
                  autoComplete="username"
                  type="text"
                  value={nom}
                  onChange={(e) => { setNom(e.target.value); setError(""); }}
                  required
                  placeholder="Ex : admin"
                  className="w-full pl-10 pr-4 py-3 bg-[#1c1f27] border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e8c77d]/30 text-[#e8e6df] placeholder:text-[#7a7870]"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 opacity-40" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" fill="none"
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            {/* MOT DE PASSE */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7a7870] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  value={motDePasse}
                  onChange={(e) => { setMotDePasse(e.target.value); setError(""); }}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#1c1f27] border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e8c77d]/30 text-[#e8e6df] placeholder:text-[#7a7870]"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 opacity-40" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#7a7870] hover:text-white transition cursor-pointer"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* BOUTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-medium transition bg-[#e8c77d] hover:bg-[#c9a85c] active:scale-95 text-[#0f1117] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Connexion en cours…" : "Se connecter"}
            </button>

            {/* ERREUR */}
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg">
                {error}
              </div>
            )}

          </form>

          <div className="mt-8 text-center text-xs text-[#7a7870]">
            Vous êtes étudiant ?{" "}
            <a href="/" className="text-[#e8c77d] hover:underline">
              Accès étudiant →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
