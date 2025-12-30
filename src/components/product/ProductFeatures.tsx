import { Check } from 'lucide-react';

interface Props {
  features?: string[];
}

export default function ProductFeatures({ features }: Props) {
  if (!features || features.length === 0) return null;

  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <span className="text-sm md:text-base text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
  );
}