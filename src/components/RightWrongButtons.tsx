interface RightWrongButtonsProps {
  onRight: () => void;
  onWrong: () => void;
}

export default function RightWrongButtons({ onRight, onWrong }: RightWrongButtonsProps) {
  return (
    <div className="mt-6 md:mt-8">
      <p className="text-center text-sm text-gray-600 mb-4 px-4">
        Did you know this? Mark your answer to track progress and review wrong cards later.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
        <button
          onClick={onWrong}
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all shadow-lg min-h-[44px] transform active:scale-95"
          aria-label="Mark as wrong - this card will be added to review list"
        >
          ❌ Wrong
        </button>
        <button
          onClick={onRight}
          className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-all shadow-lg min-h-[44px] transform active:scale-95"
          aria-label="Mark as correct"
        >
          ✅ Right
        </button>
      </div>
    </div>
  );
}

