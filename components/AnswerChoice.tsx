'use client';

import { Vocab } from '@/types/vocab';

interface AnswerChoiceProps {
    vocab: Vocab;
    state: 'default' | 'correct' | 'incorrect';
    onClick: () => void;
    disabled?: boolean;
}

/**
 * Component hiển thị 1 lựa chọn đáp án
 * State: default (trắng), correct (xanh), incorrect (đỏ)
 */
export default function AnswerChoice({
    vocab,
    state,
    onClick,
    disabled = false
}: AnswerChoiceProps) {
    return (
        <button
            className={`answer-choice ${state}`}
            onClick={onClick}
            disabled={disabled}
        >
            {/* <div className="answer-kanji">{vocab.kanji || vocab.hiragana}</div>
            <div className="answer-reading">
                {vocab.hiragana} {vocab.romaji && `(${vocab.romaji})`}
            </div> */}
            <div className="answer-meaning">{vocab.meaning}</div>
        </button>
    );
}
