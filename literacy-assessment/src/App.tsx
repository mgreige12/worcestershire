import { useRef, useState } from "react";
import { assessRecordedAudio } from "./SpeechTest";
import {
  aggregatePhonemeScores,
  averageScore,
  SOUND_SYSTEMS,
  type PhonemeScoreMap,
  type SoundSystemId,
} from "./PronunciationAssessment";

function App() {
  const [selectedSystemId, setSelectedSystemId] = useState<SoundSystemId>(
    SOUND_SYSTEMS[0].id
  );
  const [scores, setScores] = useState<PhonemeScoreMap | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const selectedSystem = SOUND_SYSTEMS.find(
    (system) => system.id === selectedSystemId
  ) ?? SOUND_SYSTEMS[0];

  const handleStartRecording = async () => {
    try {
      setError("");
      setScores(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordingChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());

        try {
          const recording = new Blob(recordingChunksRef.current, {
            type: recorder.mimeType,
          });
          const assessment = await assessRecordedAudio(
            selectedSystem.passage,
            recording
          );
          const json = assessment.properties.getProperty(
            "SpeechServiceResponse_JsonResult"
          );
          setScores(
            aggregatePhonemeScores(
              json,
              selectedSystem.phonemes,
              selectedSystem.id
            )
          );
        } catch (recordingError) {
          console.error(recordingError);
          setError(
            recordingError instanceof Error
              ? recordingError.message
              : "Could not assess the recording."
          );
        }
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Could not access the microphone.");
    }
  };

  const handleStopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setIsRecording(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">Pronunciation practice</h1>

      <p className="text-xl font-bold">{selectedSystem.label}</p>

      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white"
      >
        {isRecording ? "Stop recording" : "Start recording"}
      </button>

      <label className="flex flex-col gap-2">
        <span>Sound system</span>
        <select
          value={selectedSystemId}
          onChange={(event) => setSelectedSystemId(event.target.value as SoundSystemId)}
          disabled={isRecording}
          className="rounded border px-3 py-2"
        >
          {SOUND_SYSTEMS.map((system) => (
            <option key={system.id} value={system.id}>
              {system.label}
            </option>
          ))}
        </select>
      </label>

      <p>{selectedSystem.description}</p>
      <p className="max-w-2xl text-center text-2xl">{selectedSystem.passage}</p>

      {error && <p className="max-w-3xl text-red-600">{error}</p>}
      {scores && (
        <table>
          <thead>
            <tr>
              <th className="px-3 py-1 text-left">Phoneme</th>
              <th className="px-3 py-1 text-left">Average score</th>
              <th className="px-3 py-1 text-left">Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(scores).map(([phoneme, phonemeScore]) => (
              <tr key={phoneme}>
                <td className="px-3 py-1">{phoneme}</td>
                <td className="px-3 py-1">
                  {averageScore(phonemeScore)?.toFixed(1) ?? "Not detected"}
                </td>
                <td className="px-3 py-1">{phonemeScore.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default App;