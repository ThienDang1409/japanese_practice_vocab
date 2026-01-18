import { Vocab } from '@/types/vocab';

/**
 * Chia danh sách từ vựng thành N phần bằng nhau theo số ngày
 * @param vocab Danh sách từ vựng đầy đủ
 * @param numDays Số ngày muốn chia
 * @returns Mảng các mảng từ vựng, mỗi mảng con là 1 ngày
 */
export function divideVocabByDays(vocab: Vocab[], numDays: number): Vocab[][] {
    const divided: Vocab[][] = [];
    const itemsPerDay = Math.ceil(vocab.length / numDays);

    for (let i = 0; i < numDays; i++) {
        const start = i * itemsPerDay;
        const end = Math.min(start + itemsPerDay, vocab.length);
        divided.push(vocab.slice(start, end));
    }

    return divided;
}

/**
 * Lấy N đáp án sai ngẫu nhiên từ danh sách (không bao gồm đáp án đúng)
 * @param vocab Danh sách từ vựng đầy đủ
 * @param correctAnswer Đáp án đúng cần loại trừ
 * @param count Số lượng đáp án sai cần lấy
 * @returns Mảng các đáp án sai
 */
export function getRandomWrongAnswers(
    vocab: Vocab[],
    correctAnswer: Vocab,
    count: number
): Vocab[] {
    // Lọc bỏ đáp án đúng
    const available = vocab.filter(v => v.id !== correctAnswer.id);

    // Shuffle và lấy N phần tử đầu
    const shuffled = shuffleArray([...available]);
    return shuffled.slice(0, count);
}

/**
 * Xáo trộn mảng (Fisher-Yates shuffle)
 * @param array Mảng cần xáo trộn
 * @returns Mảng đã được xáo trộn
 */
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Tạo danh sách 4 đáp án (1 đúng + 3 sai) đã được xáo trộn
 * @param vocab Danh sách từ vựng đầy đủ
 * @param correctAnswer Đáp án đúng
 * @returns Mảng 4 đáp án đã xáo trộn
 */
export function generateAnswerChoices(vocab: Vocab[], correctAnswer: Vocab): Vocab[] {
    const wrongAnswers = getRandomWrongAnswers(vocab, correctAnswer, 3);
    const allChoices = [correctAnswer, ...wrongAnswers];
    return shuffleArray(allChoices);
}
