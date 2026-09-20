export type SoundSystemId = "cvc" | "silent-e" | "vowel-teams";

export interface SoundSystem {
  id: SoundSystemId;
  label: string;
  description: string;
  passages: readonly string[];
}

export interface GraphemePhonemePair {
  grapheme: string;
  phoneme: string;
}

export interface GraphemePhonemeScore extends GraphemePhonemePair {
  score: number;
  count: number;
}

export type GraphemePhonemeScores = readonly GraphemePhonemeScore[];

export const SOUND_SYSTEM_TARGETS: Record<
  SoundSystemId,
  readonly GraphemePhonemePair[]
> = {
  "cvc": [
    { grapheme: "a", phoneme: "æ" },
    { grapheme: "e", phoneme: "ɛ" },
    { grapheme: "i", phoneme: "ɪ" },
    { grapheme: "o", phoneme: "ɑ" },
    { grapheme: "u", phoneme: "ʌ" },
  ],
  "silent-e": [
    { grapheme: "a", phoneme: "eɪ" },
    { grapheme: "e", phoneme: "i" },
    { grapheme: "i", phoneme: "aɪ" },
    { grapheme: "o", phoneme: "oʊ" },
    { grapheme: "u", phoneme: "u" },
    { grapheme: "u", phoneme: "ju" },
  ],
  "vowel-teams": [
    { grapheme: "ai", phoneme: "eɪ" },
    { grapheme: "ay", phoneme: "eɪ" },
    { grapheme: "ee", phoneme: "i" },
    { grapheme: "ie", phoneme: "i" },
    { grapheme: "ei", phoneme: "i" },
    { grapheme: "ey", phoneme: "i" },
    { grapheme: "oa", phoneme: "oʊ" },
    { grapheme: "ow", phoneme: "oʊ" },
    { grapheme: "oo", phoneme: "u" },
    { grapheme: "ue", phoneme: "u" },
    { grapheme: "ui", phoneme: "u" },
    { grapheme: "ew", phoneme: "u" },
    { grapheme: "oo", phoneme: "ʊ" },
    { grapheme: "ea", phoneme: "ɛ" },
  ],
};

export const SOUND_SYSTEMS: readonly SoundSystem[] = [
  {
    id: "cvc",
    label: "Short vowel CVC words",
    description: "Short a, e, i, o, and u in consonant-vowel-consonant words.",
    passages: [
      "Ben is the pen pal of Bob. My pal wants a bed.",
      "Ben got Bob a bag of hats. A hat fell in the hot tub.",
      "My pet bit my mug. I ate a tin of fish with a pin."
    ],
  },
  {
    id: "silent-e",
    label: "Silent e patterns",
    description: "Words ending with a vowel, consonant, and an e",
    passages: [
      "Pete lives in a cave.",
      "His home is next to mine.",
      "I live near a lake  and pine tree. I hope you like my tune.",
      "The mule stole the lion’s mane. Here these things are rude."
    ],
  },
  {
    id: "vowel-teams",
    label: "Vowel teams patterns",
    description: "Sounds of two vowels together",
    passages: [
      "We play in the rain.",
      "The green sheep sleep.",
    ],
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

export function createGraphemePhonemeScores(
  targets: readonly GraphemePhonemePair[]
): GraphemePhonemeScores {
  return targets.map(({ grapheme, phoneme }) => ({
    grapheme,
    phoneme,
    score: 0,
    count: 0,
  }));
}

export function addGraphemePhonemeScores(
  current: GraphemePhonemeScores,
  next: GraphemePhonemeScores
): GraphemePhonemeScores {
  return current.map((score, index) => ({
    ...score,
    score: score.score + (next[index]?.score ?? 0),
    count: score.count + (next[index]?.count ?? 0),
  }));
}

export function isCvcWord(word: string): boolean {
  return /^[^aeiou][aeiou][^aeiou]$/i.test(word.trim());
}

export function isSilentEWord(word: string): boolean {
  return /[aeiou][^aeiou]e$/i.test(word.trim());
}

export function aggregatePhonemeScores(
  json: string,
  soundSystemId: SoundSystemId
): GraphemePhonemeScores {
  const scores = createGraphemePhonemeScores(SOUND_SYSTEM_TARGETS[soundSystemId]);
  const payload = JSON.parse(json) as AzureAssessmentPayload;
  const words = payload.NBest?.[0]?.Words;

  if (!Array.isArray(words)) {
    return scores;
  }

  for (const word of words as AzureWord[]) {
    if (typeof word.Word !== "string") {
      continue;
    }

    const normalizedWord = word.Word.toLowerCase().replace(/[^a-z]/g, "");
    if (
      !normalizedWord ||
      (soundSystemId === "cvc" && !isCvcWord(normalizedWord)) ||
      (soundSystemId === "silent-e" && !isSilentEWord(normalizedWord)) ||
      !Array.isArray(word.Phonemes)
    ) {
      continue;
    }

    for (const phoneme of word.Phonemes as AzurePhoneme[]) {
      const phonemeName = typeof phoneme.Phoneme === "string"
        ? phoneme.Phoneme.trim()
        : "";
      const score = phoneme.PronunciationAssessment?.AccuracyScore;

      if (!phonemeName || typeof score !== "number") {
        continue;
      }

      for (const target of scores) {
        if (
          normalizedWord.includes(target.grapheme) &&
          phonemeName === target.phoneme
        ) {
          target.score += score;
          target.count += 1;
        }
      }
    }
  }

  return scores;
}

export function averageScore({ score, count }: GraphemePhonemeScore): number | null {
  return count === 0 ? null : score / count;
}

export function sortByAccuracy(
  scores: GraphemePhonemeScores
): GraphemePhonemeScores {
  return [...scores].sort((left, right) => {
    const leftAverage = averageScore(left) ?? -1;
    const rightAverage = averageScore(right) ?? -1;

    return rightAverage - leftAverage || right.count - left.count;
  });
}