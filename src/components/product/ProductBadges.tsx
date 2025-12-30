import { Sparkles, Clock, Zap } from 'lucide-react';

interface ProductBadgesProps {
  badges: string[];
}

export default function ProductBadges({ badges }: ProductBadgesProps) {
  const getBadgeIcon = (badge: string) => {
    switch(badge) {
      case 'Limited Edition':
        return <Sparkles className="w-3 h-3" />;
      case 'Pre-Order':
        return <Clock className="w-3 h-3" />;
      case 'On Sale':
        return <Zap className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch(badge) {
      case 'Limited Edition':
        return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white';
      case 'Pre-Order':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
      case 'On Sale':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-700 to-gray-800 text-white';
    }
  };

  if (!badges || badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {badges.map((badge, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${getBadgeColor(badge)}`}
        >
          {getBadgeIcon(badge)}
          <span>{badge}</span>
        </span>
      ))}
    </div>
  );
}