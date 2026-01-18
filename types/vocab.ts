// Vocab data structure
export interface Vocab {
  id: number;
  kanji: string;
  hiragana: string;
  romaji: string;
  meaning: string;
}

// Practice session state
export interface PracticeState {
  vocabList: Vocab[];
  currentIndex: number;
  totalDays: number;
  currentDay: number;
  isFavoritesMode: boolean;
}

// Answer choice with state
export interface AnswerOption {
  vocab: Vocab;
  isCorrect: boolean;
  state: 'default' | 'correct' | 'incorrect';
}
