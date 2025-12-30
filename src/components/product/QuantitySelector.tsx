import { Minus, Plus } from 'lucide-react';

interface Props {
  quantity: number;
  onQuantityChange: (n: number) => void;
  maxQuantity: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  maxQuantity,
}: Props) {
  const isMinDisabled = quantity <= 1;
  const isMaxDisabled = quantity >= maxQuantity;

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm md:text-base text-gray-400 font-medium">Quantity:</span>
      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1 border border-gray-700">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={isMinDisabled}
          className={`p-2 rounded-md transition-all ${
            isMinDisabled
              ? 'text-gray-600 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="font-bold text-white min-w-[2rem] text-center text-sm md:text-base">
          {quantity}
        </span>

        <button
          onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
          disabled={isMaxDisabled}
          className={`p-2 rounded-md transition-all ${
            isMaxDisabled
              ? 'text-gray-600 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {maxQuantity < 10 && (
        <span className="text-xs text-gray-500">
          (Max: {maxQuantity})
        </span>
      )}
    </div>
  );
}