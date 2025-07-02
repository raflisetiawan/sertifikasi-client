import { ref } from 'vue';

export const useQuizTimer = (onTimeUp: () => void) => {
  const timeRemaining = ref(0);
  let intervalId: NodeJS.Timeout | null = null;
  let storageKey = '';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const saveTimeToStorage = (time: number) => {
    if (storageKey) {
      localStorage.setItem(storageKey, time.toString());
    }
  };

  const getTimeFromStorage = (): number => {
    if (!storageKey) return 0;
    const saved = localStorage.getItem(storageKey);
    return saved ? parseInt(saved, 10) : 0;
  };

  const clearTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  const start = (userId: number, quizId: number, timeLimitMinutes: number) => {
    // Clear any existing timer first
    clearTimer();

    storageKey = `quiz_timer_${userId}_${quizId}`;
    const totalSeconds = timeLimitMinutes * 60;

    // Check if there's saved time, otherwise start with full time
    const savedTime = getTimeFromStorage();
    timeRemaining.value = savedTime > 0 ? savedTime : totalSeconds;

    intervalId = setInterval(() => {
      if (timeRemaining.value <= 0) {
        clearTimer();
        onTimeUp();
        return;
      }

      timeRemaining.value--;
      saveTimeToStorage(timeRemaining.value);
    }, 1000);
  };

  return {
    timeRemaining,
    start,
    clearTimer,
    formatTime,
  };
};
