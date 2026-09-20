import {
  SOUND_SYSTEM_TARGETS,
  type GraphemePhonemePair,
  type GraphemePhonemeScore,
  type GraphemePhonemeScores,
  type SoundSystemId,
} from "./soundSystems.ts"

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
  soundSystemId: SoundSystemId,
  targets: readonly GraphemePhonemePair[] = SOUND_SYSTEM_TARGETS[soundSystemId]
): GraphemePhonemeScores {
  const scores = createGraphemePhonemeScores(targets);
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