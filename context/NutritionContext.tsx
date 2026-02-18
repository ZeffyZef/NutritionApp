import { createContext, ReactNode, useContext, useState } from 'react';

// ── Types ────────────────────────────────────────────────────
export type Repas = {
  id: number;
  nom: string;
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
};

export type Totaux = {
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
};

type NutritionContextType = {
  isGymDay: boolean;
  setIsGymDay: (val: boolean) => void;
  repasJournal: Repas[];
  ajouterRepas: (repas: Omit<Repas, 'id'>) => void;
  supprimerRepas: (id: number) => void;
  totaux: Totaux;
  targets: Totaux & { calories: number };
};

// ── Cibles nutritionnelles ───────────────────────────────────
const TARGETS = {
  gymDay:  { calories: 2880, proteines: 182, glucides: 344, lipides: 86 },
  restDay: { calories: 2540, proteines: 182, glucides: 258, lipides: 86 },
};

// ── Création du contexte ─────────────────────────────────────
const NutritionContext = createContext<NutritionContextType | null>(null);

// ── Provider : le conteneur global ──────────────────────────
export function NutritionProvider({ children }: { children: ReactNode }) {
  const [isGymDay, setIsGymDay]       = useState(true);
  const [repasJournal, setRepasJournal] = useState<Repas[]>([]);

  const ajouterRepas = (repas: Omit<Repas, 'id'>) => {
    setRepasJournal(prev => [...prev, { ...repas, id: Date.now() }]);
  };

  const supprimerRepas = (id: number) => {
    setRepasJournal(prev => prev.filter(r => r.id !== id));
  };

  const totaux = repasJournal.reduce(
    (acc, r) => ({
      calories:  acc.calories  + r.calories,
      proteines: acc.proteines + r.proteines,
      glucides:  acc.glucides  + r.glucides,
      lipides:   acc.lipides   + r.lipides,
    }),
    { calories: 0, proteines: 0, glucides: 0, lipides: 0 }
  );

  const targets = isGymDay ? TARGETS.gymDay : TARGETS.restDay;

  return (
    <NutritionContext.Provider value={{
      isGymDay, setIsGymDay,
      repasJournal, ajouterRepas, supprimerRepas,
      totaux, targets,
    }}>
      {children}
    </NutritionContext.Provider>
  );
}

// ── Hook personnalisé pour utiliser le contexte ──────────────
export function useNutrition() {
  const ctx = useContext(NutritionContext);
  if (!ctx) throw new Error('useNutrition doit être utilisé dans NutritionProvider');
  return ctx;
}