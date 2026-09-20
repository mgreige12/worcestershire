export type SoundSystemId = "cvc" | "silent-e" | "vowel-teams";

export interface GraphemeAssessment {
  grapheme: string;
  passages: readonly string[];
}

export interface SoundSystem {
  id: SoundSystemId;
  label: string;
  description: string;
  passages: readonly string[];
  graphemeAssessments?: readonly GraphemeAssessment[];
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
    //{ grapheme: "oo", phoneme: "ʊ" },
    //{ grapheme: "ea", phoneme: "ɛ" },
    { grapheme: "ea", phoneme: "i" },
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
    graphemeAssessments: [
    {
      grapheme: "a",
      passages: [
        "The cat ran to Max.",
        "A dab of jam is on Sal.",
        "I nap on the pad.",
      ],
    },
    {
      grapheme: "e",
      passages: [
        "The men beg for a net.",
        "I fed the red hen.",
        "I get a jet.",
      ],
    },
    {
      grapheme: "i",
      passages: [
        "My bib can zip.",
        "The pig can’t fit in the wig.",
        "Kim has a bin and a lid.",
      ],
    },
    {
      grapheme: "o",
      passages: [
        "Mom and pop have a job.",
        "I see fog and a log.",
        "The sod is on the cot and the mop.",
      ],
    },
    {
      grapheme: "u",
      passages: [
        "The bug is on the rug.",
        "To run in the mud is fun.",
        "The cub cut the gum.",
      ],
    },
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
    graphemeAssessments: [
      {
        grapheme: "a",
        passages: [
          "Jane can bake a cake.",
          "I tape kale to the crane.",
          "Don’t wake the ape.",
        ],
      },
      {
        grapheme: "e",
        passages: [
          "Gene and Steve share a theme.",
          "On New Year’s Eve, they made a scene.",
        ],
      },
      {
        grapheme: "i",
        passages: [
          "The kite took time to fly.",
          "We ride the bike and smile.",
          "Let’s hide the file behind the pipe.",
        ],
      },
      {
        grapheme: "o",
        passages: [
          "The stone broke with a poke.",
          "He stole a phone and a stove.",
          "Vote and get a rose.",
        ],
      },
      {
        grapheme: "u",
        passages: [
          "The duke has a huge cube.",
          "It’s a cute flute to use.",
          "The sand dune is hot in June.",
        ],
      },
    ],
  },
  {
    id: "vowel-teams",
    label: "Vowel teams patterns",
    description: "Sounds of two vowels together",
    passages: [
      "We sail all day in the rain.",
      "The stray maid won’t go away.",
      "We eat beef, beans, and honey in the field.",
      "The thief climbed the chimney and the ceiling.",
      "I see a small receipt.",
      "The moon has a blue hue.",
      "We threw fruit at the roof.",
      "The dew fell on his suit",
      "The coach mows down the road.",
      "The goat rows along."
    ],
    graphemeAssessments: [
      {
        grapheme: "ai",
        passages: [
          "It’s a pain to wait with no aim.",
          "The snail stains the rail.",
          "The train brought our mail.",
        ],
      },
      {
        grapheme: "ay",
        passages: [
          "The clay by the bay is gray.",
          "The dogs play in the hay tray.",
          "The old subway decays.",
        ],
      },
      {
        grapheme: "ea",
        passages: [
          "The seals beat the heat by the sea.",
          "The peach fell by the stream.",
          "Music is a treat for the ear.",
        ],
      },
      {
        grapheme: "ee",
        passages: [
          "The bee lives in the green tree.",
          "We speed to greet the creek.",
          "Sheep have four feet.",
        ],
      },
      {
        grapheme: "ie",
        passages: [
          "We will achieve relief after the test.",
          "The shriek pierced the chief’s ear.",
          "Her niece felt a fierce grief.",
        ],
      },
      {
        grapheme: "ei",
        passages: [
          "I can’t perceive any deceit.",
          "She received the gift with conceit.",
          "He could not conceive the reason why.",
        ],
      },
      {
        grapheme: "ey",
        passages: [
          "The donkey and the monkey play volleyball.",
          "The turkey eats parsley in the valley.",
          "The abbey is past the alley.",
        ],
      },
      {
        grapheme: "oa",
        passages: [
          "The oak boat sails along the coast.",
          "The soap floats in the foam.",
          "I loaned him a load of cash.",
        ],
      },
      {
        grapheme: "ow",
        passages: [
          "Plants grow below the sun.",
          "The rainbow glows in the snow.",
          "The crow sits on the low window.",
        ],
      },
      {
        grapheme: "oo",
          passages: [ 
            "Flowers bloom in a hoop by the pool.",
            "A spoon is a cool tool.",
            "I see food and drool."
          ]
      },
       {
        grapheme: "ue",
          passages: [ 
            "I missed my true cue.",
            "Blue glue is sue soon.",
            "Sue rues the hue."
          ]
      },
      {
        grapheme: "ui",
          passages: [ 
            "Fruit juice is good on a cruise.",
            "The pursuit cost him a new bruise.",
            "Recruit them to ruin the suitcase."
          ]
      },
      {
        grapheme: "ew",
          passages: [ 
            "I drew a cat named mew.",
            "Chew the new beef stew.",
            "I grew beans for my brew."
          ]
      },
    ],
  }
];