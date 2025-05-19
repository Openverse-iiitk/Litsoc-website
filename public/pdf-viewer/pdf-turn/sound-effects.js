/**
 * Audio manager for the page turning sound effect
 */

// Enable turn.js sound effects with Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let pageTurnSound = null;

// Preload sound
function preloadPageTurnSound(soundUrl) {
  return fetch(soundUrl)
    .then(response => response.arrayBuffer())
    .then(buffer => audioContext.decodeAudioData(buffer))
    .then(decodedData => {
      pageTurnSound = decodedData;
      console.log('Page turn sound loaded successfully');
    })
    .catch(error => console.error('Error loading sound:', error));
}

// Play the page turn sound
function playPageTurnSound() {
  // Check if audio is enabled (controlled by parent window)
  if (window.audioEnabled === false) {
    console.log('Audio is disabled, not playing sound');
    return;
  }

  if (!pageTurnSound) {
    console.warn('Page turn sound not loaded yet');
    return;
  }
  
  try {
    const source = audioContext.createBufferSource();
    source.buffer = pageTurnSound;
    
    // Create gain node for volume control
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // 50% volume
    
    // Connect source to gain, then to output
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play the sound
    source.start(0);
    console.log('Playing page turn sound');
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

// Initialize with default sound
document.addEventListener('DOMContentLoaded', () => {
  preloadPageTurnSound('/audio/page-turn.mp3')
    .catch(error => console.error('Could not preload page turn sound:', error));
});

// Export functions for use by turn.js
window.playPageTurnSound = playPageTurnSound;
