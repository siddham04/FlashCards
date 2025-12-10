import { useNavigate } from 'react-router-dom';
import { decks } from '../data/decks';
import { useSession } from '../context/SessionContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { wrongIds } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 sm:p-6 md:p-8 page-transition">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-800 mb-3 sm:mb-4 px-4">
          Hindi Flashcards
        </h1>
        <p className="text-center text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg px-4">
          Choose a mode to start learning
        </p>

        {/* Mode Selection Buttons */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 flex-wrap px-4">
          <button
            onClick={() => navigate('/stats')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-colors shadow-lg min-h-[44px] text-sm sm:text-base"
          >
            📊 Statistics
          </button>
          {wrongIds.size > 0 && (
            <button
              onClick={() => navigate('/redo')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg transition-colors shadow-lg min-h-[44px] text-sm sm:text-base"
            >
              🔄 Redo Wrong Cards ({wrongIds.size})
            </button>
          )}
        </div>

        {/* Deck Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 px-4 sm:px-0">
          {Object.values(decks).map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border-2 border-gray-200 card-hover"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {deck.title}
                </h2>
                {deck.description && (
                  <p className="text-gray-600 mb-4 text-xs sm:text-sm">{deck.description}</p>
                )}
                <p className="text-blue-600 font-semibold text-sm sm:text-base">
                  {deck.cards.length} cards
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/study/${deck.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 sm:py-2 px-4 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
                >
                  📚 Study Mode
                </button>
                <button
                  onClick={() => navigate(`/quiz/${deck.id}`)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-2 px-4 rounded-lg transition-colors min-h-[44px] text-sm sm:text-base"
                >
                  🎯 Quiz Mode
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

