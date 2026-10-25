import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { DraftPost } from '../types';
import { readStoredDraft, writeStoredDraft } from './storage';

interface DraftPostContextValue {
  draft: DraftPost | null;
  setDraft: (draft: DraftPost) => void;
  clearDraft: () => void;
}

const DraftPostContext = createContext<DraftPostContextValue | null>(null);

/** Carries a post from the "New Post" form to the "Preview" page (replaces PostdataService). */
export function DraftPostProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<DraftPost | null>(readStoredDraft);

  const setDraft = useCallback((next: DraftPost) => {
    writeStoredDraft(next);
    setDraftState(next);
  }, []);

  const clearDraft = useCallback(() => {
    writeStoredDraft(null);
    setDraftState(null);
  }, []);

  const value = useMemo(() => ({ draft, setDraft, clearDraft }), [draft, setDraft, clearDraft]);
  return <DraftPostContext.Provider value={value}>{children}</DraftPostContext.Provider>;
}

export function useDraftPost() {
  const ctx = useContext(DraftPostContext);
  if (!ctx) throw new Error('useDraftPost must be used inside <DraftPostProvider>');
  return ctx;
}
