import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { decks } from '../data/decks';
import { Card, DeckId } from '../types';
import FlipableCard from '../components/FlipableCard';
import RightWrongButtons from '../components/RightWrongButtons';
import { updateStatsForAnswer } from '../utils/storage';
import { useSession } from '../context/SessionContext';

// Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function StudyPage() {
  const { deckId } = useParams<{ deckId: DeckId }>();
  const navigate = useNavigate();
  const { wrongIds, addWrongCard } = useSession();
  
  if (!deckId || !decks[deckId]) {
    navigate('/');
    return null;
  }

  const deck = decks[deckId];
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    // Shuffle cards when component mounts or deck changes
    setShuffledCards(shuffle(deck.cards));
    setCurrentIndex(0);
    setFlipped(false);
  }, [deckId, deck.cards]);

  const currentCard = shuffledCards[currentIndex];
  const isFinished = currentIndex >= shuffledCards.length;

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleRight = () => {
    if (currentCard) {
      updateStatsForAnswer(deckId, true);
    }
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      // Finished all cards
      setCurrentIndex(shuffledCards.length);
    }
  };

  const handleWrong = () => {
    if (currentCard) {
      addWrongCard(currentCard.id);
      updateStatsForAnswer(deckId, false);
    }
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      // Finished all cards
      setCurrentIndex(shuffledCards.length);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center mx-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            🎉 Study Session Complete!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            You've finished all {shuffledCards.length} cards in the {deck.title} deck.
          </p>
          {wrongIds.size > 0 && (
            <p className="text-red-600 mb-6 font-semibold text-sm sm:text-base">
              Cards to review: {wrongIds.size}
            </p>
          )}
          <div className="flex flex-col gap-3 sm:gap-4 items-center">
            {wrongIds.size > 0 && (
              <button
                onClick={() => navigate('/redo')}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full sm:w-auto min-h-[44px] text-sm sm:text-base"
              >
                🔄 Redo Wrong Cards ({wrongIds.size})
              </button>
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  setShuffledCards(shuffle(deck.cards));
                  setCurrentIndex(0);
                  setFlipped(false);
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
              >
                Study Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 sm:p-6 md:p-8 page-transition">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between gap-2">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
          >
            ← Back
          </button>
          <div className="text-center flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{deck.title}</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Card {currentIndex + 1} of {shuffledCards.length}
            </p>
          </div>
          <div className="w-16 sm:w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Card */}
        <div className="mb-4 sm:mb-6">
          <FlipableCard card={currentCard} flipped={flipped} onFlip={handleFlip} />
        </div>

        {/* Right/Wrong buttons - only show after flipping */}
        {flipped && (
          <RightWrongButtons onRight={handleRight} onWrong={handleWrong} />
        )}

        {/* Hint if not flipped */}
        {!flipped && (
          <p className="text-center text-gray-500 mt-4 text-sm sm:text-base px-4">
            Click the card to reveal the answer
          </p>
        )}
      </div>
    </div>
  );
}

