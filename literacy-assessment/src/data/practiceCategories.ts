export type VowelModule = {
    id: string;
    grapheme: string;
    example: string;
    ipa: string;
};

export type VowelTeamModule = {
    id: string;
    grapheme: string;
    example: string;
    definition: string;
};

export type VowelTeamGroup = {
    id: string;
    name: string;
    ipa: string;
    modules: VowelTeamModule[];
};

export type VowelCategory = {
    slug: "cvc" | "silent-e";
    title: string;
    definition: string;
    layout: "vowels";
    modules: VowelModule[];
};

export type VowelTeamsCategory = {
    slug: "vowel-teams";
    title: string;
    definition: string;
    layout: "teams";
    groups: VowelTeamGroup[];
};

export type PracticeCategory = VowelCategory | VowelTeamsCategory;

export const practiceCategories: Record<string, PracticeCategory> = {
    cvc: {
        slug: "cvc",
        title: "CVC modules",
        definition:
            "The vowel between the consonants makes the short vowel sound.",
        layout: "vowels",
        modules: [
            { id: "short-a", grapheme: "a", example: "cat", ipa: "æ" },
            { id: "short-e", grapheme: "e", example: "pet", ipa: "ɛ" },
            { id: "short-i", grapheme: "i", example: "lip", ipa: "ɪ" },
            { id: "short-o", grapheme: "o", example: "rod", ipa: "ɑ" },
            { id: "short-u", grapheme: "u", example: "sum", ipa: "ʌ" },
        ],
    },

    "silent-e": {
        slug: "silent-e",
        title: "Silent E (long) modules",
        definition:
            "Bossy e makes the vowel say its name. The vowel before e should make the long vowel sound.",
        layout: "vowels",
        modules: [
            { id: "long-a", grapheme: "a", example: "same", ipa: "eɪ" },
            { id: "long-e", grapheme: "e", example: "Pete", ipa: "i" },
            { id: "long-i", grapheme: "i", example: "kite", ipa: "aɪ" },
            { id: "long-o", grapheme: "o", example: "note", ipa: "oʊ" },
            { id: "long-u", grapheme: "u", example: "cute", ipa: "ju / u" },
        ],
    },

    "vowel-teams": {
        slug: "vowel-teams",
        title: "Vowel Teams modules",
        definition:
            "Trick: the second vowel usually makes the first vowel say its name! → long vowel sound",
        layout: "teams",
        groups: [
            {
                id: "long-a",
                name: "Long a vowel teams",
                ipa: "eɪ",
                modules: [
                    {
                        id: "ai",
                        grapheme: "ai",
                        example: "pail",
                        definition:
                            "ai makes the long a sound in the middle of a word.",
                    },
                    {
                        id: "ay",
                        grapheme: "ay",
                        example: "day",
                        definition:
                            "ay makes the long a sound at the end of a word.",
                    },
                ],
            },
            {
                id: "long-e",
                name: "Long e vowel teams",
                ipa: "i",
                modules: [
                    {
                        id: "ea",
                        grapheme: "ea",
                        example: "beach",
                        definition:
                            "ea can make the long e sound anywhere in a word. It can sometimes make the short e sound, usually before a final consonant d.",
                    },
                    {
                        id: "ee",
                        grapheme: "ee",
                        example: "seed",
                        definition:
                            "ee makes the long e sound anywhere in a word.",
                    },
                    {
                        id: "ie",
                        grapheme: "ie",
                        example: "piece",
                        definition:
                            "ie makes the long e sound usually in the middle of a word.",
                    },
                    {
                        id: "ei",
                        grapheme: "ei",
                        example: "receive",
                        definition: "ei makes the long e sound after c.",
                    },
                    {
                        id: "ey",
                        grapheme: "ey",
                        example: "honey",
                        definition:
                            "ey makes the long e sound usually in an unstressed syllable.",
                    },
                ],
            },
            {
                id: "long-o",
                name: "Long o vowel teams",
                ipa: "oʊ",
                modules: [
                    {
                        id: "oa",
                        grapheme: "oa",
                        example: "boat",
                        definition:
                            "oa makes the long o sound usually in the middle of a word.",
                    },
                    {
                        id: "ow",
                        grapheme: "ow",
                        example: "snow",
                        definition:
                            "ow makes the long o sound usually at the end of a word.",
                    },
                ],
            },
            {
                id: "long-u",
                name: "Long u vowel teams",
                ipa: "u",
                modules: [
                    {
                        id: "oo-long",
                        grapheme: "oo",
                        example: "room",
                        definition: "oo can make the long u sound, u.",
                    },
                    {
                        id: "ue",
                        grapheme: "ue",
                        example: "blue",
                        definition: "ue makes the long u sound, ju / u.",
                    },
                    {
                        id: "ui",
                        grapheme: "ui",
                        example: "fruit",
                        definition: "ui makes the long u sound, u.",
                    },
                    {
                        id: "ew",
                        grapheme: "ew",
                        example: "crew",
                        definition: "ew can make the long u sound, u.",
                    },
                ],
            },
        ],
    },
};
