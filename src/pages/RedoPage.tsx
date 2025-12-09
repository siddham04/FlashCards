import { useState, useEffect } from 'react';
import { decks } from '../data/decks';
import { Card } from '../types';
import FlipableCard from '../components/FlipableCard';
import RightWrongButtons from '../components/RightWrongButtons';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';

// Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function RedoPage() {
  const navigate = useNavigate();
  const { wrongIds, clearWrongCards } = useSession();
  const [wrongCards, setWrongCards] = useState<Card[]>([]);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    // Redirect to home if no wrong cards
    if (wrongIds.size === 0) {
      navigate('/');
      return;
    }

    // Get all cards from all decks
    const allCards = Object.values(decks).flatMap((deck) => deck.cards);
    
    // Filter to only wrong cards
    const wrongCardsList = allCards.filter((card) => wrongIds.has(card.id));
    setWrongCards(wrongCardsList);
    
    // Shuffle wrong cards
    setShuffledCards(shuffle(wrongCardsList));
    setCurrentIndex(0);
    setFlipped(false);
  }, [wrongIds, navigate]);

  const currentCard = shuffledCards[currentIndex];
  const isFinished = currentIndex >= shuffledCards.length;

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleRight = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      // Finished all cards
      setCurrentIndex(shuffledCards.length);
    }
  };

  const handleWrong = () => {
    // Card stays in wrong list, just move to next
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      // Finished all cards
      setCurrentIndex(shuffledCards.length);
    }
  };

  if (wrongIds.size === 0) {
    return null; // Will redirect
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 Redo Session Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            You've reviewed all {shuffledCards.length} cards you got wrong.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                setShuffledCards(shuffle(wrongCards));
                setCurrentIndex(0);
                setFlipped(false);
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Redo Again
            </button>
            <button
              onClick={() => {
                clearWrongCards();
                navigate('/');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Clear Wrong Cards
            </button>
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
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8 page-transition">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Redo Wrong Cards</h2>
            <p className="text-gray-600">
              Card {currentIndex + 1} of {shuffledCards.length}
            </p>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Card */}
        <FlipableCard card={currentCard} flipped={flipped} onFlip={handleFlip} />

        {/* Right/Wrong buttons - only show after flipping */}
        {flipped && (
          <RightWrongButtons onRight={handleRight} onWrong={handleWrong} />
        )}

        {/* Hint if not flipped */}
        {!flipped && (
          <p className="text-center text-gray-500 mt-4">
            Click the card to reveal the answer
          </p>
        )}
      </div>
    </div>
  );
}

