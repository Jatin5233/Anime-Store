interface PriceBoxProps {
  price: number;
  originalPrice?: number;
  discount?: number;
  inStock: boolean;
}

export default function PriceBox({ 
  price, 
  originalPrice, 
  discount, 
  inStock 
}: PriceBoxProps) {
  return (
    <div className="flex flex-col">
      <div className="text-3xl md:text-4xl font-bold text-white">
        ₹{price.toFixed(2)}
      </div>
      {originalPrice && discount && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-base md:text-lg text-gray-400 line-through">
            ₹{originalPrice.toFixed(2)}
          </span>
          <span className="px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-md text-xs md:text-sm font-bold">
            Save ₹{(originalPrice - price).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}