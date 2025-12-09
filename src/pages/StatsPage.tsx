import { loadStats, resetStats } from '../utils/storage';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decks } from '../data/decks';

export default function StatsPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(loadStats());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Refresh stats when component mounts or when returning from quiz
  useEffect(() => {
    setStats(loadStats());
  }, []);

  const handleReset = () => {
    resetStats();
    setStats(loadStats());
    setShowResetConfirm(false);
  };

  const overallAccuracy = stats.overall.studied > 0
    ? Math.round((stats.overall.correct / stats.overall.studied) * 100)
    : 0;

  const formatDate = (dateISO: string) => {
    const date = new Date(dateISO);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8 page-transition">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            📊 Statistics
          </h1>

          {/* Overall Stats */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.overall.studied}</p>
                <p className="text-blue-100">Cards Studied</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.overall.correct}</p>
                <p className="text-green-200">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.overall.incorrect}</p>
                <p className="text-red-200">Incorrect</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-4xl font-bold">{overallAccuracy}%</p>
              <p className="text-blue-100">Accuracy</p>
            </div>
          </div>

          {/* Quiz History */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz History</h2>
            {stats.quizHistory && stats.quizHistory.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stats.quizHistory.map((attempt) => {
                  const deck = decks[attempt.deckId];
                  return (
                    <div
                      key={attempt.id}
                      className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-800">{deck.title}</span>
                            <span className="text-sm text-gray-500">
                              {attempt.mode === 'multiple-choice' ? '📝 Multiple Choice' : '✍️ Fill-in-Blank'}
                            </span>
                            <span className="text-sm text-gray-400">
                              {formatDate(attempt.dateISO)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-gray-600">
                              Score: <span className="font-bold">{attempt.correct}/{attempt.total}</span>
                            </span>
                            <span className={`font-bold ${
                              attempt.percentage >= 80 ? 'text-green-600' :
                              attempt.percentage >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {attempt.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">No quiz attempts yet. Complete a quiz to see your history here!</p>
              </div>
            )}
          </div>

          {/* Per-Deck Stats */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Deck Statistics</h2>
            {Object.values(decks).map((deck) => {
              const deckStats = stats.perDeck[deck.id];
              const accuracy = deckStats.studied > 0
                ? Math.round((deckStats.correct / deckStats.studied) * 100)
                : 0;

              return (
                <div
                  key={deck.id}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{deck.title}</h3>
                    <span className="text-lg font-semibold text-blue-600">
                      {accuracy}% accuracy
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Studied</p>
                      <p className="text-2xl font-bold text-gray-800">{deckStats.studied}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Correct</p>
                      <p className="text-2xl font-bold text-green-600">{deckStats.correct}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Incorrect</p>
                      <p className="text-2xl font-bold text-red-600">{deckStats.incorrect}</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  {deckStats.studied > 0 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all"
                          style={{
                            width: `${accuracy}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset Button */}
          <div className="mt-8 text-center">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Reset All Statistics
              </button>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <p className="text-gray-800 mb-4 font-semibold">
                  Are you sure you want to reset all statistics? This cannot be undone.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleReset}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

