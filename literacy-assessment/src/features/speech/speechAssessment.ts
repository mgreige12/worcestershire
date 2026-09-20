import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
const speechRegion = import.meta.env.VITE_AZURE_SPEECH_REGION;

export function assessWord(word: string): Promise<SpeechSDK.SpeechRecognitionResult> {
  return assessAudio(word, SpeechSDK.AudioConfig.fromDefaultMicrophoneInput());
}

export async function assessWordFromWavFile(
  word: string,
  filePath = "/cat.wav"
): Promise<SpeechSDK.SpeechRecognitionResult> {
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`Could not load WAV file: ${response.status} ${response.statusText}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const fileName = filePath.split("/").pop() || "audio.wav";
  const audioFile = new File([audioBuffer], fileName, { type: "audio/wav" });
  return assessAudio(word, SpeechSDK.AudioConfig.fromWavFileInput(audioFile));
}

export async function assessRecordedAudio(
  word: string,
  recording: Blob
): Promise<SpeechSDK.SpeechRecognitionResult> {
  const audioContext = new AudioContext();

  try {
    const audioBuffer = await audioContext.decodeAudioData(
      await recording.arrayBuffer()
    );
    const wavFile = new File(
      [encodeWav(audioBuffer)],
      "recording.wav",
      { type: "audio/wav" }
    );

    return assessAudio(word, SpeechSDK.AudioConfig.fromWavFileInput(wavFile));
  } finally {
    await audioContext.close();
  }
}

function encodeWav(audioBuffer: AudioBuffer): ArrayBuffer {
  const channelCount = audioBuffer.numberOfChannels;
  const frameCount = audioBuffer.length;
  const bytesPerSample = 2;
  const wavBuffer = new ArrayBuffer(44 + frameCount * bytesPerSample);
  const view = new DataView(wavBuffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + frameCount * bytesPerSample, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, frameCount * bytesPerSample, true);

  const channels = Array.from({ length: channelCount }, (_, index) =>
    audioBuffer.getChannelData(index)
  );

  for (let frame = 0; frame < frameCount; frame += 1) {
    const mixedSample = channels.reduce(
      (sum, channel) => sum + channel[frame],
      0
    ) / channelCount;
    const clampedSample = Math.max(-1, Math.min(1, mixedSample));
    const pcmSample = clampedSample < 0
      ? clampedSample * 0x8000
      : clampedSample * 0x7fff;

    view.setInt16(44 + frame * bytesPerSample, pcmSample, true);
  }

  return wavBuffer;
}

function writeAscii(view: DataView, offset: number, value: string): void {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function assessAudio(
  word: string,
  audioConfig: SpeechSDK.AudioConfig
): Promise<SpeechSDK.SpeechRecognitionResult> {
  return new Promise((resolve, reject) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );

    speechConfig.speechRecognitionLanguage = "en-US";

    const recognizer = new SpeechSDK.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    const pronunciationConfig = new SpeechSDK.PronunciationAssessmentConfig(
      word,
      SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
      SpeechSDK.PronunciationAssessmentGranularity.Phoneme,
      true
    );

    pronunciationConfig.phonemeAlphabet = "IPA";
    pronunciationConfig.nbestPhonemeCount = 5;

console.log("PRON CONFIG:", pronunciationConfig.toJSON());

pronunciationConfig.applyTo(recognizer);

recognizer.recognizeOnceAsync(
  (result) => {
    console.log("PRONUNCIATION RESULT");
    console.log("Reason:", result.reason);
    console.log("Text:", result.text);

    console.log(
      "JSON:",
      result.properties.getProperty(
        SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
      )
    );

    recognizer.close();
    resolve(result);
  },
  (error) => {
    console.error("ERROR:", error);
    recognizer.close();
    reject(error);
  }
);
  });
}

export function testMicrophone(): Promise<SpeechSDK.SpeechRecognitionResult> {
  return new Promise((resolve, reject) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
  speechKey,
  speechRegion
);

speechConfig.speechRecognitionLanguage = "en-US";

const audioConfig =
  SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

const recognizer = new SpeechSDK.SpeechRecognizer(
  speechConfig,
  audioConfig
);

recognizer.recognizeOnceAsync(
  (result) => {
    console.log("NORMAL RESULT");
    console.log("Reason:", result.reason);
    console.log("Text:", result.text);
    console.log("JSON:",
      result.properties.getProperty(
        SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult
      )
    );

    recognizer.close();
    resolve(result);
  },
  (error) => {
    console.error(error);
    recognizer.close();
    reject(error);
  }
);
  });
}
