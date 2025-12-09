import { useNavigate } from 'react-router-dom';
import { decks } from '../data/decks';
import { useSession } from '../context/SessionContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { wrongIds } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8 page-transition">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-4">
          Hindi Flashcards
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Choose a mode to start learning
        </p>

        {/* Mode Selection Buttons */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => navigate('/stats')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
          >
            📊 Statistics
          </button>
          {wrongIds.size > 0 && (
            <button
              onClick={() => navigate('/redo')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
            >
              🔄 Redo Wrong Cards ({wrongIds.size})
            </button>
          )}
        </div>

        {/* Deck Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.values(decks).map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 card-hover"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {deck.title}
                </h2>
                {deck.description && (
                  <p className="text-gray-600 mb-4 text-sm">{deck.description}</p>
                )}
                <p className="text-blue-600 font-semibold">
                  {deck.cards.length} cards
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/study/${deck.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  📚 Study Mode
                </button>
                <button
                  onClick={() => navigate(`/quiz/${deck.id}`)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
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

