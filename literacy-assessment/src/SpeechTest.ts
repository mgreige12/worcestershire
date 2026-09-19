import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
const speechRegion = import.meta.env.VITE_AZURE_SPEECH_REGION;

export function assessWord(word: string): Promise<SpeechSDK.SpeechRecognitionResult> {
  return new Promise((resolve, reject) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );

    speechConfig.speechRecognitionLanguage = "en-US";

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

   const recognizer = new SpeechSDK.SpeechRecognizer(
  speechConfig,
  audioConfig
);

    const pronunciationConfig =
      new SpeechSDK.PronunciationAssessmentConfig(
        word,
        SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
        SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
        false
      );

    pronunciationConfig.phonemeAlphabet = "IPA";

    pronunciationConfig.applyTo(recognizer);

    recognizer.recognizeOnceAsync(
      (result) => {
        console.log("Azure result:", result);
        console.log("Raw JSON:", result.properties.getProperty(
          SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
        ));

        recognizer.close();
        resolve(result);
      },
      (error) => {
        recognizer.close();
        reject(error);
      }
    );
  });
}