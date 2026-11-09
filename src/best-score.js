const STORAGE_KEY = 'endless-runner:best-score';

// Storage can be unavailable (private mode, blocked cookies); the game must still run.

export function loadBestScore() {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    localStorage.setItem(STORAGE_KEY, String(score));
  } catch {
    // Best score simply lasts for the current session only.
  }
}
