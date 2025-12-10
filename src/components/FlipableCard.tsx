import { Card } from '../types';

interface FlipableCardProps {
  card: Card;
  flipped: boolean;
  onFlip: () => void;
}

export default function FlipableCard({ card, flipped, onFlip }: FlipableCardProps) {
  return (
    <div
      className="w-full max-w-sm sm:max-w-md md:w-96 h-56 sm:h-64 mx-auto cursor-pointer perspective-1000"
      onClick={onFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onFlip();
        }
      }}
      aria-label={flipped ? `English: ${card.english}` : `Hindi: ${card.hindi}`}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          flipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Hindi side (front) */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div className="text-center p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-blue-200 mb-2">Hindi</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{card.hindi}</h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-3 sm:mt-4">Click to flip</p>
          </div>
        </div>

        {/* English side (back) */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-2xl flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 text-white"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-green-200 mb-2">English</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{card.english}</h2>
            <p className="text-xs sm:text-sm text-green-200 mt-3 sm:mt-4">Click to flip back</p>
          </div>
        </div>
      </div>
    </div>
  );
}

