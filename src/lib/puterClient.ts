import { puter as puterImport } from '@heyputer/puter.js';

// Get active puter instance (either imported or window.puter)
export const getPuter = () => {
  if (typeof window !== 'undefined' && (window as any).puter) {
    return (window as any).puter;
  }
  return puterImport;
};

export const puter = puterImport;
