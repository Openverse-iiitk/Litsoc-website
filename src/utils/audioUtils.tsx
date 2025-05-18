/**
 * Utility for playing audio files
 */

const audioCache: { [key: string]: HTMLAudioElement } = {};

// Preload an audio file
export const preloadAudio = (src: string): void => {
  if (!audioCache[src]) {
    const audio = new Audio(src);
    audio.load();
    audioCache[src] = audio;
  }
};

// Play an audio file
export const playAudio = (src: string): Promise<void> => {
  if (!audioCache[src]) {
    preloadAudio(src);
  }
  
  const audio = audioCache[src];
  
  // Reset the audio to start from beginning if it's already playing
  audio.pause();
  audio.currentTime = 0;
  
  // Return a promise that resolves or rejects based on play status
  return audio.play()
    .catch(error => {
      console.warn('Audio playback was prevented:', error);
      // You might want to show a UI element to let users manually enable audio
    });
};