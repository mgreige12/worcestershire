import {
	createContext,
	useContext,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { assessRecordedAudio } from "../speech/speechAssessment";
import {
	addGraphemePhonemeScores,
	aggregatePhonemeScores,
	createGraphemePhonemeScores,
} from "../soundSystems/scoring";
import {
	SOUND_SYSTEMS,
	SOUND_SYSTEM_TARGETS,
	type GraphemePhonemePair,
	type GraphemePhonemeScores,
	type SoundSystem,
	type SoundSystemId,
} from "../soundSystems/soundSystems";

interface AssessmentContextValue {
	assessmentMode: AssessmentMode;
	selectedSystem: SoundSystem;
	selectedSystemId: SoundSystemId;
	currentPassage: string;
	questionNumber: number;
	totalQuestions: number;
	progressPercent: number;
	scoresBySystem: Record<SoundSystemId, GraphemePhonemeScores>;
	scoresByGrapheme: Record<string, GraphemePhonemeScores>;
	spokenBySystem: Record<SoundSystemId, string[]>;
	isRecording: boolean;
	error: string;
	selectSoundSystem: (systemId: SoundSystemId) => void;
	startGeneralAssessment: (systemId: SoundSystemId) => void;
	startGraphemeAssessment: (systemId: SoundSystemId, grapheme: string) => void;
	startRecording: () => Promise<void>;
	stopRecording: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | undefined>(
	undefined
);

export type AssessmentMode =
  | {
      type: "general";
      systemId: SoundSystemId;
    }
  | {
      type: "grapheme";
      systemId: SoundSystemId;
      grapheme: string;
      phoneme: string;
    };

interface AssessmentQuestion {
  systemId: SoundSystemId;
  passage: string;
  grapheme?: string;
}

const GENERAL_QUESTIONS: readonly AssessmentQuestion[] =
  SOUND_SYSTEMS.flatMap((system) =>
    system.passages.map((passage) => ({
      systemId: system.id,
      passage,
    }))
  );

function getGraphemeQuestions(
  systemId: SoundSystemId,
  grapheme: string
): AssessmentQuestion[] {
  const system = SOUND_SYSTEMS.find(
    (candidate) => candidate.id === systemId
  );

  const assessment = system?.graphemeAssessments?.find(
    (candidate) => candidate.grapheme === grapheme
  );

  if (!assessment) {
    return [];
  }

  return assessment.passages.map((passage) => ({
    systemId,
    passage,
    grapheme: assessment.grapheme,
  }));
}

function getTargetsForQuestion(
	question: AssessmentQuestion
): readonly GraphemePhonemePair[] {
	if (!question.grapheme) {
		return SOUND_SYSTEM_TARGETS[question.systemId];
	}

	return SOUND_SYSTEM_TARGETS[question.systemId].filter(
		(target) => target.grapheme === question.grapheme
	);
}

function getGraphemeScoreKey(systemId: SoundSystemId, grapheme: string): string {
	return `${systemId}:${grapheme}`;
}

function createInitialScores(): Record<SoundSystemId, GraphemePhonemeScores> {
	return Object.fromEntries(
		SOUND_SYSTEMS.map((system) => [
			system.id,
			createGraphemePhonemeScores(SOUND_SYSTEM_TARGETS[system.id]),
		])
	) as Record<SoundSystemId, GraphemePhonemeScores>;
}

function createInitialSpoken(): Record<SoundSystemId, string[]> {
	return Object.fromEntries(
		SOUND_SYSTEMS.map((system) => [system.id, []])
	) as unknown as Record<SoundSystemId, string[]>;
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
	const [questionIndex, setQuestionIndex] = useState(0);
	const [completedQuestions, setCompletedQuestions] = useState(0);
	const [questions, setQuestions] =
		useState<readonly AssessmentQuestion[]>(GENERAL_QUESTIONS);
	const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>({
		type: "general",
		systemId: GENERAL_QUESTIONS[0].systemId,
	});
	const [scoresBySystem, setScoresBySystem] =
		useState<Record<SoundSystemId, GraphemePhonemeScores>>(createInitialScores);
	const [scoresByGrapheme, setScoresByGrapheme] = useState<
		Record<string, GraphemePhonemeScores>
	>({});
	const [spokenBySystem, setSpokenBySystem] =
		useState<Record<SoundSystemId, string[]>>(createInitialSpoken);
	const [isRecording, setIsRecording] = useState(false);
	const [error, setError] = useState("");
	const recorderRef = useRef<MediaRecorder | null>(null);
	const recordingChunksRef = useRef<Blob[]>([]);
	const currentQuestion = questions[questionIndex] ?? questions[0];
	const selectedSystem =
		SOUND_SYSTEMS.find((system) => system.id === currentQuestion?.systemId) ??
		SOUND_SYSTEMS[0];
	const selectedSystemId = selectedSystem.id;
	const currentPassage = currentQuestion?.passage ?? "";
	const questionNumber = questionIndex + 1;
	const totalQuestions = questions.length;
	const progressPercent = totalQuestions
		? (completedQuestions / totalQuestions) * 100
		: 0;
    
	const startGeneralAssessment = (systemId: SoundSystemId) => {
		setQuestions(GENERAL_QUESTIONS);
		setAssessmentMode({ type: "general", systemId });
		setQuestionIndex(0);
		setCompletedQuestions(0);
		setError("");
    };

	const startGraphemeAssessment = (
		systemId: SoundSystemId,
		grapheme: string
    ) => {
		const nextQuestions = getGraphemeQuestions(systemId, grapheme);
		const target = SOUND_SYSTEM_TARGETS[systemId].find(
			(candidate) => candidate.grapheme === grapheme
		);

		if (!target || nextQuestions.length === 0) {
			setError(`No targeted passages found for ${grapheme}.`);
			return;
		}

		setQuestions(nextQuestions);
		setAssessmentMode({
			type: "grapheme",
			systemId,
			grapheme,
			phoneme: target.phoneme,
		});
		setQuestionIndex(0);
		setCompletedQuestions(0);
		setError("");
    };

	const selectSoundSystem = (systemId: SoundSystemId) => {
		startGeneralAssessment(systemId);
	};

	const startRecording = async () => {
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
					const assessment = await assessRecordedAudio(currentPassage, recording);
					const json = assessment.properties.getProperty(
						"SpeechServiceResponse_JsonResult"
					);
					const targets = getTargetsForQuestion(currentQuestion);
					const passageScores = aggregatePhonemeScores(
						json,
						currentQuestion.systemId,
						targets
					);

					if (currentQuestion.grapheme) {
						const key = getGraphemeScoreKey(
							currentQuestion.systemId,
							currentQuestion.grapheme
						);
						setScoresByGrapheme((currentScoresByGrapheme) => ({
							...currentScoresByGrapheme,
							[key]: addGraphemePhonemeScores(
								currentScoresByGrapheme[key] ??
									createGraphemePhonemeScores(targets),
								passageScores
							),
						}));
					} else {
						setScoresBySystem((currentScoresBySystem) => ({
							...currentScoresBySystem,
							[currentQuestion.systemId]: addGraphemePhonemeScores(
								currentScoresBySystem[currentQuestion.systemId],
								passageScores
							),
						}));
					}

					if (assessment.text.trim()) {
						setSpokenBySystem((currentSpokenBySystem) => ({
							...currentSpokenBySystem,
							[selectedSystem.id]: [
								...currentSpokenBySystem[selectedSystem.id],
								assessment.text.trim(),
							],
						}));
					}

					setQuestionIndex((currentIndex) =>
						Math.min(currentIndex + 1, questions.length - 1)
					);
					setCompletedQuestions((currentCompleted) =>
						Math.min(currentCompleted + 1, questions.length)
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
		} catch (recordingError) {
			console.error(recordingError);
			setError(
				recordingError instanceof Error
					? recordingError.message
					: "Could not access the microphone."
			);
		}
	};

	const stopRecording = () => {
		recorderRef.current?.stop();
		recorderRef.current = null;
		setIsRecording(false);
	};

	return (
		<AssessmentContext.Provider
			value={{
				assessmentMode,
				selectedSystem,
				selectedSystemId,
				currentPassage,
				questionNumber,
				totalQuestions,
				progressPercent,
				scoresBySystem,
				scoresByGrapheme,
				spokenBySystem,
				isRecording,
				error,
				selectSoundSystem,
				startGeneralAssessment,
				startGraphemeAssessment,
				startRecording,
				stopRecording,
			}}
		>
			{children}
		</AssessmentContext.Provider>
	);
}

export function useAssessment() {
	const context = useContext(AssessmentContext);

	if (!context) {
		throw new Error("useAssessment must be used within an AssessmentProvider");
	}

	return context;
}
