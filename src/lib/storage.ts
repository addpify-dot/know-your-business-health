export interface SavedAssessment {
  id: string;
  date: string; // ISO
  language: 'en' | 'hi';
  data: any;
}

const STORAGE_KEY = 'bhc_assessments_v1';

export function getSavedAssessments(): SavedAssessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAssessment(entry: SavedAssessment) {
  const list = getSavedAssessments();
  list.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
}

export function clearAssessments() {
  localStorage.removeItem(STORAGE_KEY);
}
