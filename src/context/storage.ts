import type { DraftPost, User } from '../types';

const USER_KEY = 'user';
const DRAFT_KEY = 'draftPost';

const read = <T,>(storage: Storage, key: string): T | null => {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const write = (storage: Storage, key: string, value: unknown) => {
  if (value == null) storage.removeItem(key);
  else storage.setItem(key, JSON.stringify(value));
};

// Same localStorage key as the Angular app, so existing sessions keep working.
export const readStoredUser = () => read<User>(localStorage, USER_KEY);
export const writeStoredUser = (user: User | null) => write(localStorage, USER_KEY, user);

// The draft lives in sessionStorage so the preview page survives a refresh.
export const readStoredDraft = () => read<DraftPost>(sessionStorage, DRAFT_KEY);
export const writeStoredDraft = (draft: DraftPost | null) => write(sessionStorage, DRAFT_KEY, draft);
