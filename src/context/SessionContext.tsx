import { createContext, useContext, useState, ReactNode } from 'react';

interface SessionContextType {
  wrongIds: Set<string>;
  addWrongCard: (cardId: string) => void;
  clearWrongCards: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());

  const addWrongCard = (cardId: string) => {
    setWrongIds((prev) => new Set([...prev, cardId]));
  };

  const clearWrongCards = () => {
    setWrongIds(new Set());
  };

  return (
    <SessionContext.Provider value={{ wrongIds, addWrongCard, clearWrongCards }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

