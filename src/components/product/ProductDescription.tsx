import { MessageSquare } from 'lucide-react';

interface ProductDescriptionProps {
  description: string;
  title?: string;
}

export default function ProductDescription({ 
  description, 
  title = "Product Description" 
}: ProductDescriptionProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-cyan-500/20 overflow-hidden shadow-xl">
      <div className="p-4 md:p-6 border-b border-gray-800">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
          <MessageSquare className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-cyan-400 flex-shrink-0" />
          <span>{title}</span>
        </h2>
      </div>
      
      <div className="p-4 md:p-6">
        <div className="text-sm md:text-base text-gray-300 whitespace-pre-line leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}