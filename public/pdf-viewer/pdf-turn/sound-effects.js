/**
 * Audio manager for the page turning sound effect
 */

// Create audio context only when needed
let audioContext = null;
let pageTurnSound = null;
let audioInitialized = false;

// Function to initialize the audio system
function initAudio() {
  if (audioInitialized) return true;
  
  try {
    // Only create AudioContext when needed (on user interaction)
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioInitialized = true;
    console.log('Audio system initialized');
    
    // Start preloading the sound
    preloadPageTurnSound('/audio/page-turn.mp3')
      .catch(error => console.warn('Could not preload page turn sound:', error));
      
    return true;
  } catch (error) {
    console.error('Failed to initialize audio system:', error);
    return false;
  }
}

// Preload sound
function preloadPageTurnSound(soundUrl) {
  if (!audioContext) {
    console.warn('Audio context not initialized');
    return Promise.reject(new Error('Audio context not initialized'));
  }
  
  return fetch(soundUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch sound file: ${response.status} ${response.statusText}`);
      }
      return response.arrayBuffer();
    })
    .then(buffer => audioContext.decodeAudioData(buffer))
    .then(decodedData => {
      pageTurnSound = decodedData;
      console.log('Page turn sound loaded successfully');
    });
}

// Play the page turn sound
function playPageTurnSound() {
  // Check if audio is enabled
  if (window.audioEnabled === false) {
    console.log('Audio disabled, not playing sound');
    return;
  }
  
  try {
    console.log('Playing page turn sound');
    const audio = new Audio('/audio/page-turn.mp3');
    audio.volume = 0.7;
    audio.play().catch(function(error) {
      console.warn('Could not play audio:', error);
    });
  } catch (e) {
    console.warn('Error playing sound:', e);
  }
}

// Initialize with default sound
document.addEventListener('DOMContentLoaded', () => {
  // We'll wait for user interaction before initializing audio
  // to avoid autoplay restrictions
  console.log('Audio system ready to initialize on first user interaction');
  
  // Initialize on first click/touch anywhere in the document
  document.addEventListener('click', function initOnFirstInteraction() {
    initAudio();
    // Remove this listener after first interaction
    document.removeEventListener('click', initOnFirstInteraction);
  }, { once: true });
});

// Export functions for use by turn.js
window.playPageTurnSound = playPageTurnSound;
window.initAudio = initAudio;
