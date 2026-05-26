import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api";

// ── Icônes ──────────────────────────────────────────────────────
const IconUser = () => (
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconCard = () => (
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>
  </svg>
);
const IconMail = () => (
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconLock = () => (
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconLoader = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

// ── Composant principal ──────────────────────────────────────────
export default function EduLogin() {
  // Onglet actif : 'connexion' ou 'inscription'
  const [tab, setTab] = useState("connexion");

  // Champs connexion
  const [loginMatricule, setLoginMatricule] = useState("");
  const [loginNom,       setLoginNom]       = useState("");

  // Champs inscription
  const [regNom,       setRegNom]       = useState("");
  const [regPrenom,    setRegPrenom]    = useState("");
  const [regMatricule, setRegMatricule] = useState("");
  const [regEmail,     setRegEmail]     = useState("");

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const navigate = useNavigate();

  // ── Connexion ────────────────────────────────────────────────
  const handleConnexion = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: loginMatricule.trim(),       // matricule OU nom admin
          mot_de_passe: loginNom.trim()     // nom complet OU mot de passe admin
        })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Identifiants incorrects."); return; }

      if (data.role === "admin") {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));
        navigate("/admin");
      } else {
        localStorage.setItem("etudiant", JSON.stringify(data.etudiant));
        navigate("/dashboard");
      }
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  // ── Inscription ──────────────────────────────────────────────
  const handleInscription = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${API}/etudiants/inscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom:       regNom.trim(),
          prenom:    regPrenom.trim(),
          matricule: regMatricule.trim(),
          email:     regEmail.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur lors de l'inscription."); return; }

      setSuccess("✅ Inscription envoyée ! L'administrateur va valider votre compte. Revenez vous connecter une fois validé.");
      setRegNom(""); setRegPrenom(""); setRegMatricule(""); setRegEmail("");
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full pl-10 pr-3.5 py-3 border border-black/[0.08] rounded-[10px] text-sm bg-[#f5f4f0] text-gray-900 outline-none transition focus:border-[#2b5ce6] focus:ring-2 focus:ring-[#2b5ce6]/10 focus:bg-white placeholder:text-gray-300";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0] p-8 relative overflow-hidden">
      <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-blue-600/5 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full bg-blue-600/[0.03] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-[20px] overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.10)] max-w-[900px] w-full relative z-10">

        {/* ── PANNEAU GAUCHE ── */}
        <div className="bg-[#2b5ce6] p-12 flex-col justify-between text-white hidden md:flex">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/25 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-base tracking-wide">EduArchive</span>
          </div>

          <div>
            <h2 className="text-[2.2rem] leading-tight mb-4">
              Vos épreuves,<br/>toujours<br/>disponibles.
            </h2>
            <p className="text-sm opacity-75 leading-relaxed">
              Accédez à toutes vos épreuves passées, filtrées par matière et filière, en un instant.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {["Recherche instantanée par matière", "Filtres par filière et matière", "Téléchargement PDF direct"].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm opacity-85">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <IconCheck />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ── PANNEAU DROIT ── */}
        <div className="p-10">
          {/* Onglets */}
          <div className="flex gap-1 bg-[#f5f4f0] rounded-xl p-1 mb-8">
            {["connexion", "inscription"].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all capitalize ${
                  tab === t
                    ? "bg-white text-[#2b5ce6] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "connexion" ? "🔑 Connexion" : "📝 Inscription"}
              </button>
            ))}
          </div>

          {/* ── Formulaire Connexion ── */}
          {tab === "connexion" && (
            <>
              <h3 className="text-xl font-semibold mb-1">Connexion</h3>
              <p className="text-xs text-gray-400 mb-6">
                Étudiant : saisissez votre matricule et votre nom complet.<br/>
              </p>
              <form onSubmit={handleConnexion} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">
                    Matricule
                  </label>
                  <div className="relative">
                    <IconCard />
                    <input type="text" value={loginMatricule}
                      onChange={e => { setLoginMatricule(e.target.value); setError(""); }}
                      placeholder="Votre matricule"
                      required className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">
                    Nom complet
                  </label>
                  <div className="relative">
                    <IconLock />
                    <input type="text" value={loginNom}
                      onChange={e => { setLoginNom(e.target.value); setError(""); }}
                      placeholder="Votre Nom complet"
                      required className={inputCls} />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 mt-2 bg-[#2b5ce6] hover:bg-[#1e47c8] active:scale-[0.98] text-white font-semibold text-sm rounded-[10px] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><IconLoader /> Connexion…</> : "Se connecter →"}
                </button>
              </form>
            </>
          )}

          {/* ── Formulaire Inscription ── */}
          {tab === "inscription" && (
            <>
              <h3 className="text-xl font-semibold mb-1">Créer un compte</h3>
              <p className="text-xs text-gray-400 mb-6">
                Remplissez le formulaire. L'admin validera votre inscription.
              </p>
              <form onSubmit={handleInscription} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">Nom</label>
                    <div className="relative">
                      <IconUser />
                      <input type="text" value={regNom} onChange={e => { setRegNom(e.target.value); setError(""); }}
                        placeholder="Mbarga" required className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">Prénom</label>
                    <div className="relative">
                      <IconUser />
                      <input type="text" value={regPrenom} onChange={e => { setRegPrenom(e.target.value); setError(""); }}
                        placeholder="Alice" required className={inputCls} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">Matricule</label>
                  <div className="relative">
                    <IconCard />
                    <input type="text" value={regMatricule} onChange={e => { setRegMatricule(e.target.value); setError(""); }}
                      placeholder="Ex : ETU-001" required className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">Email</label>
                  <div className="relative">
                    <IconMail />
                    <input type="email" value={regEmail} onChange={e => { setRegEmail(e.target.value); setError(""); }}
                      placeholder="alice@univ.cm" required className={inputCls} />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 mt-2 bg-[#2b5ce6] hover:bg-[#1e47c8] active:scale-[0.98] text-white font-semibold text-sm rounded-[10px] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><IconLoader /> Envoi…</> : "Envoyer ma demande →"}
                </button>
              </form>
            </>
          )}

          {/* Messages erreur / succès */}
          {error && (
            <div className="mt-4 px-3.5 py-2.5 bg-red-50 border border-red-200/60 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 px-3.5 py-3 bg-green-50 border border-green-200/60 rounded-lg text-sm text-green-700">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}