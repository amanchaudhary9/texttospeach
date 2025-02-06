let recognition;
let recognizing = false;
let currentStorylineVar = '';
let currentTranscript = '';
let previousTranscript = '';

const initializeSpeechRecognition = (language = 'en-US') => {
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!window.SpeechRecognition) {
    alert("Your browser does not support the Web Speech API. Please try with a different browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = language; // Set the language

  recognition.addEventListener('start', () => {
    recognizing = true;
    console.log('Speech recognition started');
  });

  recognition.addEventListener('end', () => {
    recognizing = false;
    console.log('Speech recognition ended');
    updateStorylineVariable();
  });

  recognition.addEventListener('result', (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        currentTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    const player = GetPlayer();
    player.SetVar(currentStorylineVar, currentTranscript + interimTranscript);
    console.log(`Interim text: ${currentTranscript + interimTranscript}`);
  });

  recognition.addEventListener('error', (event) => {
    console.error('Speech recognition error:', event.error);
  });
};

const updateStorylineVariable = () => {
  const player = GetPlayer();
  const finalTranscript = (currentTranscript.trim()).trim();
  player.SetVar(currentStorylineVar, finalTranscript);
  console.log(`Final text: ${finalTranscript}`);
  previousTranscript = finalTranscript;
  currentTranscript = '';
};

const speechtotext = (storylineVar, language = 'en-US') => {
  currentStorylineVar = storylineVar;

  // If recognition exists but language is different, destroy and reinitialize
  if (recognition && recognition.lang !== language) {
    recognition.abort();
    recognition = null;
  }

  if (!recognition) {
    initializeSpeechRecognition(language);
  }

  const player = GetPlayer();
  previousTranscript = player.GetVar(currentStorylineVar) || '';

  recognition.start();
};
