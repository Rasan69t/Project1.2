import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token    = localStorage.getItem("admin_token");
  const etudiant = localStorage.getItem("etudiant");

  // ── Règle 1 : un étudiant connecté ne peut JAMAIS accéder au panel admin ──
  if (etudiant && !token) {
    return <Navigate to="/dashboard" replace />;
  }

  // ── Règle 2 : pas de token admin → retour à l'accueil ────────────────────
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ── Règle 3 : vérifier que le token est un vrai JWT admin (sans appel réseau) ──
  // On décode le payload (partie centrale du JWT) pour vérifier le rôle.
  // Ce n'est PAS une vérification cryptographique (ça c'est le backend qui le fait),
  // mais ça empêche un étudiant d'accéder à /admin en mettant n'importe quoi dans localStorage.
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Le token doit avoir role = "admin" ET ne pas être expiré
    if (payload.role !== "admin") {
      localStorage.removeItem("admin_token");
      return <Navigate to="/" replace />;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      // Token expiré → nettoyage et retour à l'accueil
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin");
      return <Navigate to="/" replace />;
    }
  } catch {
    // Token malformé → nettoyage
    localStorage.removeItem("admin_token");
    return <Navigate to="/" replace />;
  }

  return children;
}
