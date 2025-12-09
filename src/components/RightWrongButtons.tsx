interface RightWrongButtonsProps {
  onRight: () => void;
  onWrong: () => void;
}

export default function RightWrongButtons({ onRight, onWrong }: RightWrongButtonsProps) {
  return (
    <div className="flex gap-4 justify-center mt-8">
      <button
        onClick={onWrong}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg min-h-[44px]"
        aria-label="Mark as wrong"
      >
        ❌ Wrong
      </button>
      <button
        onClick={onRight}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg min-h-[44px]"
        aria-label="Mark as correct"
      >
        ✅ Right
      </button>
    </div>
  );
}

