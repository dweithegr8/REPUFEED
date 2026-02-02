import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, setRating, size = 'md', readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = (value) => {
    if (!readonly && setRating) {
      setRating(value);
    }
  };

  return (
    <div className="star-rating flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readonly && setHoverRating(value)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          className={`star transition-transform duration-150 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              (hoverRating || rating) >= value
                ? 'fill-primary-orange text-primary-orange'
                : 'fill-neutral-lightGray text-neutral-lightGray'
            } transition-colors duration-150`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
