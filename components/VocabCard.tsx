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
            <div className="answer-kanji">{vocab.kanji || vocab.hiragana}</div>
            <div className="answer-reading">
                {vocab.hiragana} {vocab.romaji && `(${vocab.romaji})`}
            </div>
        </div>
    );
}
