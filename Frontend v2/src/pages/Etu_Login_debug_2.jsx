import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api";

// ── Icônes ───────────────────────────────────────────────────────
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
const IconFiliere = () => (
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
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

export default function EtuLogin() {
  const [tab, setTab] = useState("connexion");

  // ── Champs connexion ─────────────────────────────────────────
  const [loginNom,       setLoginNom]       = useState(""); // nom complet étudiant
  const [loginMatricule, setLoginMatricule] = useState(""); // matricule étudiant
  const [loginMotDePasse, setLoginMotDePasse] = useState(""); // mot de passe admin (optionnel)

  // ── Champs inscription ───────────────────────────────────────
  const [regNom,       setRegNom]       = useState("");
  const [regPrenom,    setRegPrenom]    = useState("");
  const [regMatricule, setRegMatricule] = useState("");
  const [regEmail,     setRegEmail]     = useState("");
  const [regFiliere,   setRegFiliere]   = useState("");

  // ── Filières pour le select inscription ─────────────────────
  const [filieres,     setFilieres]     = useState([]);
  const [loadFilieres, setLoadFilieres] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Charger les filières dès que l'onglet inscription s'ouvre
  useEffect(() => {
    if (tab !== "inscription" || filieres.length > 0) return;

    const controller = new AbortController();
    const loadFilieresData = async () => {
      setLoadFilieres(true);
      try {
        const res = await fetch(`${API}/filieres`, { signal: controller.signal });
        const data = await res.json();
        if (!controller.signal.aborted) {
          setFilieres(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!controller.signal.aborted) {
          setFilieres([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadFilieres(false);
        }
      }
    };

    loadFilieresData();
    return () => controller.abort();
  }, [tab, filieres.length]);

  // ── Connexion (étudiant OU admin) ────────────────────────────
  // Si mot de passe rempli → { nom, mot_de_passe } → backend détecte "admin"
  // Sinon                  → { nom, matricule }     → backend détecte "étudiant"
  const handleConnexion = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const body = loginMotDePasse.trim()
        ? { nom: loginNom.trim(), mot_de_passe: loginMotDePasse }
        : { nom: loginNom.trim(), matricule: loginMatricule.trim() };

      const res = await fetch(`${API}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body)
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
      setError("Impossible de joindre le serveur. Vérifiez que le backend tourne.");
    } finally {
      setLoading(false);
    }
  };

  // ── Inscription étudiant ─────────────────────────────────────
  const handleInscription = async (e) => {
    e.preventDefault();
    if (!regFiliere) { setError("Veuillez choisir votre filière."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${API}/etudiants/inscription`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          nom:        regNom.trim(),
          prenom:     regPrenom.trim(),
          matricule:  regMatricule.trim(),
          email:      regEmail.trim(),
          filiere_id: parseInt(regFiliere)
        })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur lors de l'inscription."); return; }

      setSuccess("✅ Inscription envoyée ! L'administrateur va valider votre compte. Revenez vous connecter une fois validé.");
      setRegNom(""); setRegPrenom(""); setRegMatricule(""); setRegEmail(""); setRegFiliere("");
    } catch {
      setError("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls  = "w-full pl-10 pr-3.5 py-3 border border-black/[0.08] rounded-[10px] text-sm bg-[#f5f4f0] text-gray-900 outline-none transition focus:border-[#2b5ce6] focus:ring-2 focus:ring-[#2b5ce6]/10 focus:bg-white placeholder:text-gray-300";
  const selectCls = "w-full pl-10 pr-3.5 py-3 border border-black/[0.08] rounded-[10px] text-sm bg-[#f5f4f0] text-gray-900 outline-none transition focus:border-[#2b5ce6] focus:ring-2 focus:ring-[#2b5ce6]/10 focus:bg-white appearance-none cursor-pointer";

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
              <button key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all capitalize ${
                  tab === t ? "bg-white text-[#2b5ce6] shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "connexion" ? "🔑 Connexion" : "📝 Inscription"}
              </button>
            ))}
          </div>

          {/* ── CONNEXION ── */}
          {tab === "connexion" && (
            <>
              <h3 className="text-xl font-semibold mb-1">Connexion étudiant</h3>
              <p className="text-xs text-gray-400 mb-6">
                Étudiant : saisissez votre <strong className="text-gray-500">nom complet</strong> et <strong className="text-gray-500">matricule</strong>.
                Admin : saisissez votre <strong className="text-gray-500">nom</strong> et <strong className="text-gray-500">mot de passe</strong>.
              </p>

              <form onSubmit={handleConnexion} className="space-y-4">
                {/* Nom complet */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">
                    Nom complet
                  </label>
                  <div className="relative">
                    <IconUser />
                    <input
                      type="text"
                      value={loginNom}
                      onChange={e => { setLoginNom(e.target.value); setError(""); }}
                      placeholder="Ex : MBARGA Alice"
                      required
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Matricule — masqué si mot de passe admin rempli */}
                {!loginMotDePasse && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">
                      Matricule <span className="text-gray-300 normal-case font-normal">(étudiant)</span>
                    </label>
                    <div className="relative">
                      <IconCard />
                      <input
                        type="text"
                        value={loginMatricule}
                        onChange={e => { setLoginMatricule(e.target.value); setError(""); }}
                        placeholder="Ex : ETU-001"
                        className={inputCls}
                      />
                    </div>
                  </div>
                )}

                {/* Mot de passe — masqué si matricule étudiant rempli */}
                {!loginMatricule && (
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">
                      Mot de passe <span className="text-gray-300 normal-case font-normal">(admin)</span>
                    </label>
                    <div className="relative">
                      <IconCard />
                      <input
                        type="password"
                        value={loginMotDePasse}
                        onChange={e => { setLoginMotDePasse(e.target.value); setError(""); }}
                        placeholder="••••••••"
                        className={inputCls}
                      />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading || (!loginMatricule && !loginMotDePasse)}
                  className="w-full py-3.5 mt-2 bg-[#2b5ce6] hover:bg-[#1e47c8] active:scale-[0.98] text-white font-semibold text-sm rounded-[10px] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
                  {loading ? <><IconLoader /> Connexion…</> : "Se connecter →"}
                </button>
              </form>
            </>
          )}

          {/* ── INSCRIPTION ── */}
          {tab === "inscription" && (
            <>
              <h3 className="text-xl font-semibold mb-1">Créer un compte</h3>
              <p className="text-xs text-gray-400 mb-6">
                Remplissez le formulaire. L'admin validera votre inscription avant que vous puissiez vous connecter.
              </p>

              <form onSubmit={handleInscription} className="space-y-4">
                {/* Nom + Prénom */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">Nom</label>
                    <div className="relative">
                      <IconUser />
                      <input type="text" value={regNom}
                        onChange={e => { setRegNom(e.target.value); setError(""); }}
                        placeholder="MBARGA" required className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">Prénom</label>
                    <div className="relative">
                      <IconUser />
                      <input type="text" value={regPrenom}
                        onChange={e => { setRegPrenom(e.target.value); setError(""); }}
                        placeholder="Alice" required className={inputCls} />
                    </div>
                  </div>
                </div>

                {/* Matricule */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">Matricule</label>
                  <div className="relative">
                    <IconCard />
                    <input type="text" value={regMatricule}
                      onChange={e => { setRegMatricule(e.target.value); setError(""); }}
                      placeholder="Ex : ETU-001" required className={inputCls} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">Email</label>
                  <div className="relative">
                    <IconMail />
                    <input type="email" value={regEmail}
                      onChange={e => { setRegEmail(e.target.value); setError(""); }}
                      placeholder="alice@univ.cm" required className={inputCls} />
                  </div>
                </div>

                {/* Filière */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1.5">
                    Filière <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <IconFiliere />
                    {loadFilieres ? (
                      <div className={`${inputCls} text-gray-400`}>Chargement…</div>
                    ) : filieres.length === 0 ? (
                      <div className={`${inputCls} text-red-400 text-xs`}>
                        Impossible de charger les filières — vérifiez le serveur
                      </div>
                    ) : (
                      <select value={regFiliere}
                        onChange={e => { setRegFiliere(e.target.value); setError(""); }}
                        required className={selectCls}>
                        <option value="">-- Choisissez votre filière --</option>
                        {filieres.map(f => (
                          <option key={f.id} value={f.id}>{f.nom}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={loading || loadFilieres || filieres.length === 0}
                  className="w-full py-3.5 mt-2 bg-[#2b5ce6] hover:bg-[#1e47c8] active:scale-[0.98] text-white font-semibold text-sm rounded-[10px] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
                  {loading ? <><IconLoader /> Envoi…</> : "Envoyer ma demande →"}
                </button>
              </form>
            </>
          )}

          {/* Messages */}
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
