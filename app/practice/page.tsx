'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Vocab } from '@/types/vocab';
import { divideVocabByDays, generateAnswerChoices } from '@/lib/vocabUtils';
import { useFavorites } from '@/hooks/useFavorites';
import VocabCard from '@/components/VocabCard';
import AnswerChoice from '@/components/AnswerChoice';
import FavoriteButton from '@/components/FavoriteButton';

function PracticeContent() {
    const searchParams = useSearchParams();
    const day = searchParams.get('day');
    const total = searchParams.get('total');
    const isFavoritesMode = searchParams.get('favorites') === 'true';

    const [allVocab, setAllVocab] = useState<Vocab[]>([]);
    const [practiceVocab, setPracticeVocab] = useState<Vocab[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answerChoices, setAnswerChoices] = useState<Vocab[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answerStates, setAnswerStates] = useState<('default' | 'correct' | 'incorrect')[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { isFavorite, toggleFavorite, getFavoriteVocabs, isLoaded } = useFavorites();

    // Load vocab data
    useEffect(() => {
        fetch('/vocab.json')
            .then(res => res.json())
            .then(data => {
                setAllVocab(data);

                // Xác định danh sách vocab cần luyện
                let vocabToUse: Vocab[] = [];

                if (isFavoritesMode) {
                    // Mode yêu thích
                    vocabToUse = getFavoriteVocabs(data);
                } else if (day && total) {
                    // Mode theo ngày
                    const divided = divideVocabByDays(data, parseInt(total));
                    const dayIndex = parseInt(day) - 1;
                    vocabToUse = divided[dayIndex] || [];
                }

                setPracticeVocab(vocabToUse);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error loading vocab:', err);
                setIsLoading(false);
            });
    }, [day, total, isFavoritesMode]);

    // Generate answer choices khi câu hỏi thay đổi
    useEffect(() => {
        if (practiceVocab.length > 0 && allVocab.length > 0) {
            const currentVocab = practiceVocab[currentIndex];
            const choices = generateAnswerChoices(allVocab, currentVocab);
            setAnswerChoices(choices);
            setAnswerStates(choices.map(() => 'default'));
            setSelectedAnswer(null);
        }
    }, [currentIndex, practiceVocab, allVocab]);

    // Xử lý khi user chọn đáp án
    const handleAnswer = (choiceIndex: number) => {
        if (selectedAnswer !== null) return; // Đã chọn rồi

        const currentVocab = practiceVocab[currentIndex];
        const selectedVocab = answerChoices[choiceIndex];
        const isCorrect = selectedVocab.id === currentVocab.id;

        // Update states
        const newStates = answerChoices.map((choice, idx) => {
            if (choice.id === currentVocab.id) return 'correct';
            if (idx === choiceIndex && !isCorrect) return 'incorrect';
            return 'default';
        });

        setAnswerStates(newStates as any);
        setSelectedAnswer(choiceIndex);

        // Tự động chuyển câu sau 1 giây
        setTimeout(() => {
            setCurrentIndex((prev) => {
                // Loop về đầu khi hết
                return (prev + 1) % practiceVocab.length;
            });
        }, 1000);
    };

    if (isLoading || !isLoaded) {
        return (
            <div className="container">
                <div className="loading">Đang tải...</div>
            </div>
        );
    }

    if (practiceVocab.length === 0) {
        return (
            <div className="container">
                <div className="card" style={{ textAlign: 'center' }}>
                    <h2>Không có từ vựng để luyện</h2>
                    <p style={{ margin: '1rem 0', color: 'var(--text-secondary)' }}>
                        {isFavoritesMode
                            ? 'Bạn chưa đánh dấu từ nào là yêu thích'
                            : 'Không tìm thấy từ vựng cho ngày này'}
                    </p>
                    <Link href="/" className="btn btn-primary">
                        Quay về trang chủ
                    </Link>
                </div>
            </div>
        );
    }

    const currentVocab = practiceVocab[currentIndex];

    return (
        <div className="container">
            <div className="practice-controls">
                <Link href="/" className="btn btn-secondary">
                    ← Quay lại
                </Link>
                <div className="progress-text">
                    {isFavoritesMode ? (
                        <span>⭐ Từ yêu thích</span>
                    ) : (
                        <span>Ngày {day}</span>
                    )}
                    {' '} • Câu {currentIndex + 1}/{practiceVocab.length}
                </div>
                <FavoriteButton
                    isFavorite={isFavorite(currentVocab.id)}
                    onToggle={() => toggleFavorite(currentVocab.id)}
                />
            </div>

            <div className="card">
                <VocabCard vocab={currentVocab} showKanji={true} />

                <div className="answers-grid">
                    {answerChoices.map((choice, index) => (
                        <AnswerChoice
                            key={choice.id}
                            vocab={choice}
                            state={answerStates[index]}
                            onClick={() => handleAnswer(index)}
                            disabled={selectedAnswer !== null}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Trang luyện tập
 * Nhận params: day, total (cho mode theo ngày) hoặc favorites=true (cho mode yêu thích)
 */
export default function PracticePage() {
    return (
        <Suspense fallback={
            <div className="container">
                <div className="loading">Đang tải...</div>
            </div>
        }>
            <PracticeContent />
        </Suspense>
    );
}
