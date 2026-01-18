'use client';

import { useState, useEffect } from 'react';
import { Vocab } from '@/types/vocab';

const FAVORITES_KEY = 'japanese-vocab-favorites';

/**
 * Custom hook để quản lý danh sách từ yêu thích
 * Sử dụng localStorage để lưu trữ dữ liệu
 */
export function useFavorites() {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites từ localStorage khi component mount
    useEffect(() => {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error('Error loading favorites:', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Lưu favorites vào localStorage mỗi khi thay đổi
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    }, [favorites, isLoaded]);

    /**
     * Thêm từ vào danh sách yêu thích
     */
    const addFavorite = (vocabId: number) => {
        setFavorites(prev => {
            if (!prev.includes(vocabId)) {
                return [...prev, vocabId];
            }
            return prev;
        });
    };

    /**
     * Xóa từ khỏi danh sách yêu thích
     */
    const removeFavorite = (vocabId: number) => {
        setFavorites(prev => prev.filter(id => id !== vocabId));
    };

    /**
     * Toggle trạng thái yêu thích
     */
    const toggleFavorite = (vocabId: number) => {
        if (favorites.includes(vocabId)) {
            removeFavorite(vocabId);
        } else {
            addFavorite(vocabId);
        }
    };

    /**
     * Kiểm tra từ có trong danh sách yêu thích không
     */
    const isFavorite = (vocabId: number): boolean => {
        return favorites.includes(vocabId);
    };

    /**
     * Lọc danh sách từ vựng chỉ lấy những từ yêu thích
     */
    const getFavoriteVocabs = (allVocab: Vocab[]): Vocab[] => {
        return allVocab.filter(v => favorites.includes(v.id));
    };

    return {
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        getFavoriteVocabs,
        isLoaded,
    };
}
