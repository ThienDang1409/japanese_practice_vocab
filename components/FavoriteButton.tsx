'use client';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onToggle: () => void;
}

/**
 * Component nút toggle yêu thích
 * Hiển thị ⭐ khi đã yêu thích, ☆ khi chưa
 */
export default function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
    return (
        <button
            className="favorite-button"
            onClick={onToggle}
            aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
            {isFavorite ? '⭐' : '☆'}
        </button>
    );
}
