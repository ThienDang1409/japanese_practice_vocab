'use client';

import { Vocab } from '@/types/vocab';

interface VocabCardProps {
    vocab: Vocab;
    showKanji?: boolean;
}

/**
 * Component hiển thị câu hỏi từ vựng
 * Hiển thị Kanji hoặc Hiragana tùy theo prop
 */
export default function VocabCard({ vocab, showKanji = true }: VocabCardProps) {
    return (
        <div className="vocab-card">
            <div className="vocab-question">
                {showKanji && vocab.kanji ? vocab.kanji : vocab.hiragana}
            </div>
            {showKanji && vocab.kanji && (
                <div className="vocab-reading">{vocab.hiragana}</div>
            )}
        </div>
    );
}
