import { useRef, useState } from "react";
import { assessRecordedAudio } from "./SpeechTest";
import {
  addGraphemePhonemeScores,
  aggregatePhonemeScores,
  averageScore,
  createGraphemePhonemeScores,
  sortByAccuracy,
  SOUND_SYSTEMS,
  SOUND_SYSTEM_TARGETS,
  type GraphemePhonemeScores,
  type SoundSystemId,
} from "./PronunciationAssessment";

function App() {
  const [selectedSystemId, setSelectedSystemId] = useState<SoundSystemId>(
    SOUND_SYSTEMS[0].id
  );
  const [passageIndex, setPassageIndex] = useState(0);
  const [scoresBySystem, setScoresBySystem] = useState<
    Record<SoundSystemId, GraphemePhonemeScores>
  >(() =>
    Object.fromEntries(
      SOUND_SYSTEMS.map((system) => [
        system.id,
        createGraphemePhonemeScores(SOUND_SYSTEM_TARGETS[system.id]),
      ])
    ) as Record<SoundSystemId, GraphemePhonemeScores>
  );
  const [spokenBySystem, setSpokenBySystem] = useState<
    Record<SoundSystemId, string[]>
  >(() =>
    Object.fromEntries(
      SOUND_SYSTEMS.map((system) => [system.id, []])
    ) as unknown as Record<SoundSystemId, string[]>
  );
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const selectedSystem = SOUND_SYSTEMS.find(
    (system) => system.id === selectedSystemId
  ) ?? SOUND_SYSTEMS[0];
  const currentPassage = selectedSystem.passages[passageIndex] ?? selectedSystem.passages[0];

  const handleStartRecording = async () => {
    try {
      setError("");
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
            currentPassage,
            recording
          );
          const json = assessment.properties.getProperty(
            "SpeechServiceResponse_JsonResult"
          );
          const passageScores = aggregatePhonemeScores(json, selectedSystem.id);
          setScoresBySystem((currentScoresBySystem) => ({
            ...currentScoresBySystem,
            [selectedSystem.id]: addGraphemePhonemeScores(
              currentScoresBySystem[selectedSystem.id],
              passageScores
            ),
          }));
          if (assessment.text.trim()) {
            setSpokenBySystem((currentSpokenBySystem) => ({
              ...currentSpokenBySystem,
              [selectedSystem.id]: [
                ...currentSpokenBySystem[selectedSystem.id],
                assessment.text.trim(),
              ],
            }));
          }
          setPassageIndex(
            (currentIndex) => (currentIndex + 1) % selectedSystem.passages.length
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
          onChange={(event) => {
            const nextSystemId = event.target.value as SoundSystemId;
            setSelectedSystemId(nextSystemId);
            setPassageIndex(0);
          }}
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
      <p className="max-w-2xl text-center text-2xl">{currentPassage}</p>

      {error && <p className="max-w-3xl text-red-600">{error}</p>}
      {scoresBySystem[selectedSystemId] && (
        <table>
          <thead>
            <tr>
              <th className="px-3 py-1 text-left">Grapheme</th>
              <th className="px-3 py-1 text-left">Phoneme</th>
              <th className="px-3 py-1 text-left">Average score</th>
              <th className="px-3 py-1 text-left">Count</th>
            </tr>
          </thead>
          <tbody>
            {sortByAccuracy(scoresBySystem[selectedSystemId]).map((score) => (
              <tr key={`${score.grapheme}-${score.phoneme}`}>
                <td className="px-3 py-1">{score.grapheme}</td>
                <td className="px-3 py-1">{score.phoneme}</td>
                <td className="px-3 py-1">
                  {averageScore(score)?.toFixed(1) ?? "Not detected"}
                </td>
                <td className="px-3 py-1">{score.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {spokenBySystem[selectedSystemId].length > 0 && (
        <section className="max-w-2xl">
          <h2 className="text-xl font-bold">Spoken sentences</h2>
          <ol className="list-decimal pl-6">
            {spokenBySystem[selectedSystemId].map((sentence, index) => (
              <li key={`${sentence}-${index}`}>{sentence}</li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}

export default App;