import { type ClassValue, clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatShortDistanceToNow = (date: string | number | Date) => {
  const distance = formatDistanceToNow(date, { addSuffix: true });

  if (distance.includes('less than a minute')) {
    return 'just now';
  }

  return distance
    .replace('about ', '')
    .replace('less than ', '<')
    .replace(' minute', ' min')
    .replace(' hour', ' hr')
    .replace(' day', ' d')
    .replace(' month', ' mo')
    .replace(' year', ' yr');
};

export default formatShortDistanceToNow;
