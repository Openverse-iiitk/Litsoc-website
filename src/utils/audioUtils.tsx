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
export const playAudio = (src: string): void => {
  if (!audioCache[src]) {
    preloadAudio(src);
  }
  
  const audio = audioCache[src];
  
  // Reset the audio to start from beginning if it's already playing
  audio.pause();
  audio.currentTime = 0;
  
  // Play the audio with a catch for mobile browsers that require user interaction
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.warn('Audio playback was prevented:', error);
    });
  }
};