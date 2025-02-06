let recognition;
let recognizing = false;
let currentStorylineVar = '';
let currentTranscript = '';

const initializeSpeechRecognition = (language = 'en-US') => {
  // Checking if the SpeechRecognition API is available in the browser
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!window.SpeechRecognition) {
    alert("Your browser does not support the Web Speech API. Please try with a different browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = language; // Set the language

  // Start event: Triggered when recognition starts
  recognition.addEventListener('start', () => {
    recognizing = true;
    console.log('Speech recognition started');
  });

  // End event: Triggered when recognition ends
  recognition.addEventListener('end', () => {
    recognizing = false;
    console.log('Speech recognition ended');
    updateStorylineVariable();
  });

  // Result event: When speech is detected
  recognition.addEventListener('result', (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        currentTranscript += transcript + ' ';  // Append final transcript
      } else {
        interimTranscript += transcript; // Append interim (non-final) transcript
      }
    }
    
    // Update the Storyline variable with interim text
    const player = GetPlayer();
    player.SetVar(currentStorylineVar, currentTranscript + interimTranscript);
    console.log(`Interim text: ${currentTranscript + interimTranscript}`);
  });

  // Error event: Handles errors during speech recognition
  recognition.addEventListener('error', (event) => {
    console.error('Speech recognition error:', event.error);
  });
};

const updateStorylineVariable = () => {
  const player = GetPlayer();
  
  // Trim and set only the final transcript
  const finalTranscript = currentTranscript.trim();
  player.SetVar(currentStorylineVar, finalTranscript);
  console.log(`Final text: ${finalTranscript}`);

  // Clear currentTranscript after setting the final transcript
  currentTranscript = '';
};

const speechtotext = (storylineVar, language = 'en-US') => {
  currentStorylineVar = storylineVar;

  // If recognition exists but the language is different, destroy and reinitialize
  if (recognition && recognition.lang !== language) {
    recognition.abort();
    recognition = null;
  }

  if (!recognition) {
    initializeSpeechRecognition(language);
  }

  // Start the speech recognition process
  recognition.start();
};
