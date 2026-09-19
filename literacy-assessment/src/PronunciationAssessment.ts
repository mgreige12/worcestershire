export type SoundSystemId = "short-cvc" | "long-vowels" | "vowel-team-ea";

export interface SoundSystem {
  id: SoundSystemId;
  label: string;
  description: string;
  phonemes: readonly string[];
  passage: string;
}

export interface PhonemeScore {
  score: number;
  count: number;
}

export type PhonemeScoreMap = Record<string, PhonemeScore>;

export const SOUND_SYSTEMS: readonly SoundSystem[] = [
  {
    id: "short-cvc",
    label: "Short vowel CVC words",
    description: "Short a, e, i, o, and u in consonant-vowel-consonant words.",
    phonemes: ["æ", "ɛ", "ɪ", "ɑ", "ʌ"],
    //passage: "The cat sat on a red bed. Tim hid the big pig. Tom got a hot cup.",
    passage: "cats bat",
  },
  {
    id: "long-vowels",
    label: "Long vowel patterns",
    description: "Long vowel sounds in common words with silent-e and vowel teams.",
    phonemes: ["eɪ", "i", "aɪ", "oʊ", "u", "ju"],
    passage: "Jake rides a bike home. The green goat sees five white mice.",
  },
  {
    id: "vowel-team-ea",
    label: "ea vowel team",
    description: "sounds of ea.",
    phonemes: ["ɛ", "i"],
    //passage: "Jake rides a bike home. The green goat sees five white mice.",
    passage: "bread bead",
  }
];

interface AzurePhoneme {
  Phoneme?: unknown;
  PronunciationAssessment?: {
    AccuracyScore?: unknown;
  };
}

interface AzureWord {
  Word?: unknown;
  Phonemes?: unknown;
}

interface AzureAssessmentPayload {
  NBest?: Array<{
    Words?: unknown;
  }>;
}

export function createPhonemeScoreMap(
  phonemes: readonly string[]
): PhonemeScoreMap {
  return Object.fromEntries(
    phonemes.map((phoneme) => [phoneme, { score: 0, count: 0 }])
  );
}

export function isCvcWord(word: string): boolean {
  return /^[^aeiou][aeiou][^aeiou]$/i.test(word.trim());
}

export function aggregatePhonemeScores(
  json: string,
  phonemes: readonly string[],
  soundSystemId?: SoundSystemId
): PhonemeScoreMap {
  const scores = createPhonemeScoreMap(phonemes);
  const payload = JSON.parse(json) as AzureAssessmentPayload;
  const words = payload.NBest?.[0]?.Words;

  if (!Array.isArray(words)) {
    return scores;
  }

  for (const word of words as AzureWord[]) {
    if (
      soundSystemId === "short-cvc" &&
      (typeof word.Word !== "string" || !isCvcWord(word.Word))
    ) {
      continue;
    }

    if (!Array.isArray(word.Phonemes)) {
      continue;
    }

    for (const phoneme of word.Phonemes as AzurePhoneme[]) {
      const key = typeof phoneme.Phoneme === "string"
        ? phoneme.Phoneme.trim()
        : "";
      const score = phoneme.PronunciationAssessment?.AccuracyScore;

      if (!key || !Object.hasOwn(scores, key) || typeof score !== "number") {
        continue;
      }

      scores[key].score += score;
      scores[key].count += 1;
    }
  }

  return scores;
}

export function averageScore({ score, count }: PhonemeScore): number | null {
  return count === 0 ? null : score / count;
}