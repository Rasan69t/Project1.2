import { Navigate } from "react-router-dom";

export default function ProtectedRouteEtudiant({ children }) {
  const etudiant    = localStorage.getItem("etudiant");
  const admin_token = localStorage.getItem("admin_token");

  // ── Règle 1 : un admin connecté ne peut pas accéder au dashboard étudiant ──
  if (admin_token && !etudiant) {
    return <Navigate to="/admin" replace />;
  }

  // ── Règle 2 : pas de session étudiant → retour à l'accueil ───────────────
  if (!etudiant) {
    return <Navigate to="/" replace />;
  }

  // ── Règle 3 : vérifier que l'objet étudiant est valide (pas corrompu) ────
  try {
    const data = JSON.parse(etudiant);
    if (!data || !data.matricule || !data.nomComplet) {
      localStorage.removeItem("etudiant");
      return <Navigate to="/" replace />;
    }
  } catch {
    localStorage.removeItem("etudiant");
    return <Navigate to="/" replace />;
  }

  return children;
}
