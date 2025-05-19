/**
 * Utility functions for audio playback
 */

// Cache for audio elements to avoid creating new ones for repeated sounds
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * Plays an audio file from the specified URL
 * @param url Path to the audio file
 * @param volume Volume level (0.0 to 1.0)
 * @returns The audio element that was played
 */
export const playAudio = (url: string, volume: number = 0.5): HTMLAudioElement => {
  // Use cached audio element if available
  if (audioCache[url]) {
    const audio = audioCache[url];
    audio.currentTime = 0; // Reset to beginning
    audio.volume = volume;
    audio.play().catch(err => console.error('Error playing audio:', err));
    return audio;
  }
  
  // Create new audio element
  const audio = new Audio(url);
  audio.volume = volume;
  
  // Play the audio
  audio.play().catch(err => console.error('Error playing audio:', err));
  
  // Cache for future use
  audioCache[url] = audio;
  
  return audio;
};

/**
 * Preloads audio files to reduce lag when they're first played
 * @param urls Array of audio file URLs to preload
 */
export const preloadAudio = (urls: string[]): void => {
  urls.forEach(url => {
    if (!audioCache[url]) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioCache[url] = audio;
    }
  });
};

/**
 * Stops all currently playing audio
 */
export const stopAllAudio = (): void => {
  Object.values(audioCache).forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
};
