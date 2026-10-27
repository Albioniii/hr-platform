// Ruajtja e të dhënave në localStorage të shfletuesit.
// Kështu të dhënat mbeten edhe pasi e rifreskon faqen (nuk kemi ende backend).

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage mund të jetë i bllokuar (p.sh. modaliteti privat) – thjesht e injorojmë.
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // injoro
  }
}
