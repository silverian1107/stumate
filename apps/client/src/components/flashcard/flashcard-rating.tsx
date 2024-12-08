import { FrownIcon, LaughIcon, MehIcon, SmileIcon } from 'lucide-react';

const FlashcardRating = ({ onRate }: { onRate: (value: number) => void }) => {
  const ratings = [
    {
      label: 'Forget',
      icon: FrownIcon,
      color: 'text-red-500',
      hover: 'hover:bg-red-100',
      value: 1
    },
    {
      label: 'Hard',
      icon: MehIcon,
      color: 'text-orange-500',
      hover: 'hover:bg-orange-100',
      value: 2
    },
    {
      label: 'Good',
      icon: SmileIcon,
      color: 'text-green-500',
      hover: 'hover:bg-green-100',
      value: 3
    },
    {
      label: 'Easy',
      icon: LaughIcon,
      color: 'text-primary-500',
      hover: 'hover:bg-primary-100',
      value: 4
    }
  ];

  return (
    <div className="flex w-full h-16 bg-white shadow-sm rounded-lg">
      {ratings.map((rating) => (
        <button
          key={rating.value}
          type="button"
          onClick={() => onRate(rating.value)}
          className={`size-full font-bold ${rating.hover} ${rating.color} transition-all duration-600 flex items-center justify-center gap-2`}
        >
          <rating.icon className="size-6" />
          {rating.label}
        </button>
      ))}
    </div>
  );
};

export default FlashcardRating;
