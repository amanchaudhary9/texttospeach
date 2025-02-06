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

  // Always reset previous and current transcripts for a fresh start
  previousTranscript = '';  
  currentTranscript = '';

  recognition.start();
};

const updateStorylineVariable = () => {
  const player = GetPlayer();

  // Only use currentTranscript to avoid appending old data
  const finalTranscript = currentTranscript.trim();
  player.SetVar(currentStorylineVar, finalTranscript);
  console.log(`Final text: ${finalTranscript}`);

  previousTranscript = '';  // Ensure previousTranscript doesn't retain old data
  currentTranscript = '';
};
