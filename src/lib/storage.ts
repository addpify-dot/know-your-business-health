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

// Function-level detailed assessments
export interface FunctionDetail {
  functionId: string;
  answers: Record<string, any>;
  date: string; // ISO
  language: 'en' | 'hi';
}

const FUNCTION_DETAILS_KEY = 'bhc_function_details_v1';

export function getAllFunctionDetails(): FunctionDetail[] {
  try {
    const raw = localStorage.getItem(FUNCTION_DETAILS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getFunctionDetail(functionId: string): FunctionDetail | undefined {
  const list = getAllFunctionDetails();
  return list.find((d) => d.functionId === functionId);
}

export function saveFunctionDetail(detail: FunctionDetail) {
  const list = getAllFunctionDetails().filter(d => d.functionId !== detail.functionId);
  list.unshift(detail);
  localStorage.setItem(FUNCTION_DETAILS_KEY, JSON.stringify(list.slice(0, 100)));
}
