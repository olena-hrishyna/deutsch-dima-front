export enum PART_OF_SPEECH {
  Noun = 'Noun',
  Verb = 'Verb',
  Adjective = 'Adjective',
  Adverb = 'Adverb',
  Preposition = 'Preposition',
  Conjunction = 'Conjunction',
  Interjection = 'Interjection',
  Phrase = 'Phrase',
}

export enum ARTICLE {
  der = 'der',
  die = 'die',
  das = 'das',
}

export enum KNOWLEDGE {
  perfect = 'отлично знаю',
  good = 'хорошо знаю',
  forgeting = 'забываю',
  bad = 'плохо знаю',
}

export enum LEVEL {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum AUXILIARY_VERB {
  sein = 'sein',
  haben = 'haben',
}

export interface Translation {
  en: string;
  de: string;
  ru: string;
}

export interface Translations {
  [key: string]: Translation;
}

export const PART_OF_SPEECH_TRANSLATIONS: Translations = {
  Noun: {
    en: 'Noun',
    de: 'Substantiv',
    ru: 'Существительное',
  },
  Verb: {
    en: 'Verb',
    de: 'Verb',
    ru: 'Глагол',
  },
  Adjective: {
    en: 'Adjective',
    de: 'Adjektiv',
    ru: 'Прилагательное',
  },
  Adverb: {
    en: 'Adverb',
    de: 'Adverb',
    ru: 'Наречие',
  },
  Preposition: {
    en: 'Preposition',
    de: 'Präposition',
    ru: 'Предлог',
  },
  Conjunction: {
    en: 'Conjunction',
    de: 'Konjunktion',
    ru: 'Союз',
  },
  Interjection: {
    en: 'Interjection',
    de: 'Interjektion',
    ru: 'Междометие',
  },
  Phrase: {
    en: 'Phrase',
    de: 'Phrase',
    ru: 'Фраза',
  },
};

export interface IWord {
  _id: string;
  createdAt: string;
  updadedAt: string;
  createdBy: IUser;
  titleRu: string[];
  titleDe: string;
  partOfSpeech: PART_OF_SPEECH;
  knowledge: KNOWLEDGE;
  level: LEVEL;
  exampleUsage?: string;
  audio?: Buffer | any;
  isInTraining: boolean;
  isKnown: boolean;
  // Nom
  article?: ARTICLE;
  titleDePl?: string;
  feminin?: string;
  // Adjektiv
  comparison?: string[]; // степени сравнения
  // verb
  isTrennbareVerben?: boolean;
  isReflexivVerb?: boolean;
  prefix?: string;
  auxiliaryVerb?: AUXILIARY_VERB;
  perfektForm?: string;
  präteritumFormIch?: string;
  präteritumFormDu?: string;
  präteritumFormEr?: string;
  präteritumFormWir?: string;
  präteritumFormIhr?: string;
  konjunktiv2FormIch?: string;
  konjunktiv2FormDu?: string;
  konjunktiv2FormEr?: string;
  konjunktiv2FormWir?: string;
  konjunktiv2FormIhr?: string;
}

export interface ITraining {
  _id: string;
  createdAt: Date;
  user: IUser;
  word: IWord;
  repeatLevel: number; // from 1 to 9
  nextRepeatDate: Date;
}

export interface ITestTask {
  trainingId: string;
  testWords?: ITestWord[];
  testLetters?: string[];
  testTitle: string;
  testAnswer: string[] | string;
  isCorrectAnswer?: boolean;
  article?: ARTICLE;
  exampleUsage?: string;
  audio?: Buffer | any;
  titleDePl?: string;
  isReflexivVerb?: boolean;
  prefix?: string;
  isTrennbareVerben?: boolean;
  pastForm?: string;
  level?: LEVEL;
}

export interface ITestWord {
  trainingId?: string;
  wordTitle: string;
  isCorrect?: boolean;
  isWrong?: boolean;
  audio?: any;
}

export interface IDialogData {
  title?: string;
  text?: string;
  confirmButton?: string;
  unConfirmButton?: string;
  confirmButtonColor?: string;
}

export interface IAuthData {
  token: string;
  user: IUser;
}

export interface IUser {
  login: string;
  password: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  lastVisit: string;
}

export interface IDeleteResponce {
  message: string;
  deletedItems?: { deletedCount: number; acknowledged: boolean };
}
