import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { decks } from '../data/decks';
import { Card, DeckId } from '../types';
import { generateMCQOptions } from '../utils/mcq';
import { normalizeForCompare } from '../utils/normalize';
import { updateStatsForAnswer, addQuizAttempt } from '../utils/storage';

type QuizMode = 'multiple-choice' | 'fill-in-blank';

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizPage() {
  const { deckId: deckIdParam } = useParams<{ deckId: DeckId }>();
  const navigate = useNavigate();
  
  if (!deckIdParam || !decks[deckIdParam]) {
    navigate('/');
    return null;
  }
  
  const deckId = deckIdParam;
  const deck = decks[deckId];
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mcqOptions, setMcqOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [fillInAnswer, setFillInAnswer] = useState('');
  const [results, setResults] = useState<{ correct: number; total: number } | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    if (mode && shuffledCards.length > 0 && currentIndex < shuffledCards.length) {
      const currentCard = shuffledCards[currentIndex];
      if (mode === 'multiple-choice') {
        setMcqOptions(generateMCQOptions(deck.cards, currentCard));
      }
      setSelectedAnswer('');
      setFillInAnswer('');
      setAnswered(false);
      setIsCorrect(null);
    }
  }, [mode, currentIndex, shuffledCards, deck.cards]);

  // Reset quiz answers when starting new quiz
  useEffect(() => {
    if (mode && shuffledCards.length > 0 && currentIndex === 0) {
      setQuizAnswers([]);
    }
  }, [mode]);

  const startQuiz = (selectedMode: QuizMode) => {
    setMode(selectedMode);
    setShuffledCards(shuffle(deck.cards));
    setCurrentIndex(0);
    setResults(null);
    setQuizAnswers([]);
  };

  const currentCard = shuffledCards[currentIndex];

  const handleMCQAnswer = (answer: string) => {
    if (answered) return;
    const correct = answer === currentCard.english;
    setIsCorrect(correct);
    setSelectedAnswer(answer);
    setAnswered(true);
    setQuizAnswers([...quizAnswers, correct]);
  };

  const handleFillInSubmit = () => {
    if (answered || !fillInAnswer.trim()) return;
    const normalized = normalizeForCompare(fillInAnswer);
    const correct = normalized === normalizeForCompare(currentCard.english);
    setIsCorrect(correct);
    setAnswered(true);
    setQuizAnswers([...quizAnswers, correct]);
  };

  const handleNext = () => {
    if (currentCard && answered && isCorrect !== null) {
      // Update stats
      updateStatsForAnswer(deckId, isCorrect === true);
    }

    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz finished - calculate final score from all answers
      // quizAnswers already includes all answers since we add them when answering
      const correctCount = quizAnswers.filter(Boolean).length;
      const total = shuffledCards.length;
      const percentage = Math.round((correctCount / total) * 100);
      
      setResults({
        correct: correctCount,
        total: total
      });

      // Save quiz attempt to history
      if (mode) {
        const attempt = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          deckId: deckId,
          mode: mode,
          dateISO: new Date().toISOString(),
          correct: correctCount,
          total: total,
          percentage: percentage
        };
        addQuizAttempt(attempt);
      }
    }
  };

  const handleSaveAndFinish = () => {
    // Stats already saved during quiz
    navigate('/');
  };

  // Mode selection screen
  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 sm:p-6 md:p-8 page-transition">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 sm:mb-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base min-h-[44px]"
        >
          ← Back
        </button>
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center mx-4 sm:mx-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Quiz Mode: {deck.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              Choose your quiz mode
            </p>
            <div className="flex flex-col gap-3 sm:gap-4">
              <button
                onClick={() => startQuiz('multiple-choice')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors shadow-lg min-h-[44px]"
              >
                📝 Multiple Choice
              </button>
              <button
                onClick={() => startQuiz('fill-in-blank')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors shadow-lg min-h-[44px]"
              >
                ✍️ Fill in the Blank
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (results) {
    const percentage = Math.round((results.correct / results.total) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center mx-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            🎉 Quiz Complete!
          </h2>
          <div className="mb-6">
            <p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{percentage}%</p>
            <p className="text-sm sm:text-base text-gray-600">
              {results.correct} out of {results.total} correct
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={handleSaveAndFinish}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                setMode(null);
                setResults(null);
                setCurrentIndex(0);
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-lg sm:text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
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
              Question {currentIndex + 1} of {shuffledCards.length}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {mode === 'multiple-choice' ? 'Multiple Choice' : 'Fill in the Blank'}
            </p>
          </div>
          <div className="w-16 sm:w-20"></div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 mx-4 sm:mx-0">
          <p className="text-xs sm:text-sm text-gray-500 mb-2">Hindi word:</p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
            {currentCard.hindi}
          </h3>

          {mode === 'multiple-choice' && (
            <div className="space-y-2 sm:space-y-3">
              {mcqOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMCQAnswer(option)}
                  disabled={answered}
                  className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all min-h-[44px] text-sm sm:text-base ${
                    answered
                      ? option === currentCard.english
                        ? 'bg-green-100 border-green-500'
                        : selectedAnswer === option && option !== currentCard.english
                        ? 'bg-red-100 border-red-500'
                        : 'bg-gray-50 border-gray-300'
                      : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {mode === 'fill-in-blank' && (
            <div className="space-y-3 sm:space-y-4">
              <input
                type="text"
                value={fillInAnswer}
                onChange={(e) => setFillInAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !answered && fillInAnswer.trim()) {
                    handleFillInSubmit();
                  }
                }}
                disabled={answered}
                placeholder="Type the English translation..."
                className={`w-full p-3 sm:p-4 text-base sm:text-lg border-2 rounded-lg min-h-[44px] ${
                  answered
                    ? isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:outline-none'
                }`}
              />
              {!answered && (
                <button
                  onClick={handleFillInSubmit}
                  disabled={!fillInAnswer.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
                >
                  Submit Answer
                </button>
              )}
              {answered && (
                <div className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <p className="font-semibold">
                    {isCorrect ? '✅ Correct!' : `❌ Incorrect. The answer is: ${currentCard.english}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next button */}
        {answered && (
          <div className="text-center px-4 sm:px-0">
            <button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors min-h-[44px] w-full sm:w-auto"
            >
              {currentIndex < shuffledCards.length - 1 ? 'Next Question →' : 'Finish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

