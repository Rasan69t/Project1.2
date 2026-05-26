export const epreuves = [
  { id: 1, titre: "CC Réseau",           matiere: "Réseau",          filiere: "Genie Logiciel", annee: 2023 },
  { id: 2, titre: "Examen Algo",         matiere: "Algorithme",      filiere: "Genie Logiciel", annee: 2022 },
  { id: 3, titre: "CC Base de Données",  matiere: "Base de Données", filiere: "Genie Logiciel", annee: 2024 },
  { id: 4, titre: "Examen Marketing Mix",matiere: "Marketing",       filiere: "Marketing",      annee: 2023 },
  { id: 5, titre: "CC Analyse Marché",   matiere: "Marketing",       filiere: "Marketing",      annee: 2022 },
  { id: 6, titre: "Examen Mécanique",    matiere: "Mécanique",       filiere: "Ingenieur",      annee: 2024 },
  { id: 7, titre: "CC Thermodynamique",  matiere: "Thermodynamique", filiere: "Ingenieur",      annee: 2023 },
  { id: 8, titre: "Examen POO",          matiere: "Programmation",   filiere: "SWE",            annee: 2024 },
  { id: 9, titre: "CC Web Avancé",       matiere: "Développement Web",filiere: "SWE",           annee: 2023 },
];

export const filieres = ["Toutes", "Genie Logiciel", "Marketing", "Ingenieur", "SWE"];

export const getMatieresByFiliere = (filiere) => {
  if (filiere === "Toutes") {
    return ["Toutes", ...new Set(epreuves.map(e => e.matiere))];
  }
  return ["Toutes", ...new Set(epreuves.filter(e => e.filiere === filiere).map(e => e.matiere))];
};
