'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Vocab } from '@/types/vocab';
import { divideVocabByDays } from '@/lib/vocabUtils';
import { useFavorites } from '@/hooks/useFavorites';

/**
 * Trang chủ: Chọn số ngày học và ngày cụ thể để luyện tập
 */
export default function Home() {
  const [vocab, setVocab] = useState<Vocab[]>([]);
  const [numDays, setNumDays] = useState<number>(10);
  const [dividedVocab, setDividedVocab] = useState<Vocab[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites, isLoaded } = useFavorites();

  // Load vocab data từ JSON
  useEffect(() => {
    fetch('/vocab.json')
      .then(res => res.json())
      .then(data => {
        setVocab(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading vocab:', err);
        setIsLoading(false);
      });
  }, []);

  // Chia vocab theo số ngày khi vocab hoặc numDays thay đổi
  useEffect(() => {
    if (vocab.length > 0) {
      const divided = divideVocabByDays(vocab, numDays);
      setDividedVocab(divided);
    }
  }, [vocab, numDays]);

  if (isLoading || !isLoaded) {
    return (
      <div className="container">
        <div className="loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🇯🇵 Luyện Từ Vựng Tiếng Nhật N5</h1>
        <p>Tổng hợp {vocab.length} từ vựng</p>
      </header>

      <div className="card">
        <div className="input-group">
          <label htmlFor="numDays">Số ngày muốn học:</label>
          <input
            id="numDays"
            type="number"
            min="1"
            max="30"
            value={numDays}
            onChange={(e) => setNumDays(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>

        <div className="day-grid">
          {dividedVocab.map((dayVocab, index) => (
            <Link
              key={index}
              href={`/practice?day=${index + 1}&total=${numDays}`}
              className="day-button"
            >
              <div>Ngày {index + 1}</div>
              <div className="count">{dayVocab.length} từ</div>
            </Link>
          ))}
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
            ⭐ Từ Yêu Thích ({favorites.length} từ)
          </h2>
          <Link href="/practice?favorites=true" className="btn btn-primary" style={{ width: '100%' }}>
            Luyện Từ Yêu Thích
          </Link>
        </div>
      )}

      <div className="card" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Mỗi ngày là một vòng luyện tập không kết thúc</p>
        <p>Câu hỏi chạy tuần tự và lặp lại từ đầu khi hết</p>
      </div>
    </div>
  );
}
