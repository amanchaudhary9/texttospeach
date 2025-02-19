let recognition;
let recognizing = false;
let currentStorylineVar = '';
let currentTranscript = '';

const initializeSpeechRecognition = (language = 'en-US') => {
  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!window.SpeechRecognition) {
    alert("Your browser does not support the Web Speech API. Please try with a different browser.");
    return;
  }

  if (!recognition) { // 🔥 पहले से मौजूद recognition को बार-बार create नहीं करेंगे
    recognition = new SpeechRecognition();
    recognition.continuous = true; // Mic को हमेशा ऑन रखेगा
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.addEventListener('start', () => {
      recognizing = true;
      currentTranscript = '';
      console.log('Speech recognition started');
    });

    recognition.addEventListener('end', () => {
      recognizing = false;
      console.log('Speech recognition ended. Restarting...');
      updateStorylineVariable();

      setTimeout(() => {
        if (!recognizing) {
          recognition.start(); // 🔥 Mic खुद से फिर ऑन होगा, बिना परमिशन मांगे
        }
      }, 1000);
    });

    recognition.addEventListener('result', (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentTranscript = transcript;
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
  }
};

const updateStorylineVariable = () => {
  const player = GetPlayer();
  const finalTranscript = currentTranscript.trim();
  player.SetVar(currentStorylineVar, finalTranscript);
  console.log(`Final text: ${finalTranscript}`);
  currentTranscript = '';
};

const speechtotext = (storylineVar, language = 'en-US') => {
  currentStorylineVar = storylineVar;

  if (!recognition) {
    initializeSpeechRecognition(language);
  }

  if (!recognizing) { // 🔥 Mic पहले से ऑन नहीं है, तो ही स्टार्ट करें
    recognition.start();
  }
};

// 🔥 Mic को Auto Start करने के लिए
window.onload = () => {
  console.log("Auto-starting speech recognition...");
  speechtotext('TextEntry');
};
