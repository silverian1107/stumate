/* eslint-disable jsx-a11y/no-static-element-interactions */

'use client';

import { UndoIcon } from 'lucide-react';
import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';

type FlipCardContextType = {
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
};

const FlipCardContext = React.createContext<FlipCardContextType | undefined>(
  undefined
);

const useFlipCardContext = () => {
  const context = React.useContext(FlipCardContext);
  if (!context) {
    throw new Error(
      'FlipCard compound components cannot be rendered outside the FlipCard component'
    );
  }
  return context;
};

interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

const FlipCard = React.forwardRef<HTMLDivElement, FlipCardProps>(
  ({ className, children, isFlipped = false, setIsFlipped, ...props }, ref) => {
    const value = useMemo(
      () => ({ isFlipped, setIsFlipped }),
      [isFlipped, setIsFlipped]
    );

    return (
      <FlipCardContext.Provider value={value}>
        <div
          ref={ref}
          className={cn('flip-card', isFlipped && 'flipped', className)}
          {...props}
        >
          <div className="flip-card-inner">{children}</div>
        </div>
      </FlipCardContext.Provider>
    );
  }
);
FlipCard.displayName = 'FlipCard';

interface FlipCardSideProps extends React.HTMLAttributes<HTMLDivElement> {
  side: 'front' | 'back';
}

const FlipCardSide = React.forwardRef<HTMLDivElement, FlipCardSideProps>(
  ({ className, children, side, ...props }, ref) => {
    const { setIsFlipped } = useFlipCardContext();
    const isFront = side === 'front';

    const handleClick = () => {
      if (isFront) {
        setIsFlipped(true);
      }
    };

    const handleBackClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsFlipped(false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flip-card-side relative bg-white border border-primary-200 shadow-sm',
          isFront
            ? 'flip-card-front text-primary-950 text-2xl font-semibold rounded-2xl'
            : 'flip-card-back text-primary-950 text-2xl font-semibold rounded-2xl cursor-default',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {!isFront && (
          <div className="absolute top-3 left-3" onClick={handleBackClick}>
            <UndoIcon className="size-6  cursor-pointer text-primary-600" />
          </div>
        )}
        {children}
      </div>
    );
  }
);
FlipCardSide.displayName = 'FlipCardSide';

const Front = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <FlipCardSide ref={ref} side="front" {...props} />);
Front.displayName = 'FlipCard.Front';

const Back = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => <FlipCardSide ref={ref} side="back" {...props} />);
Back.displayName = 'FlipCard.Back';

export { FlipCard, Back as FlipCardBack, Front as FlipCardFront };

export default FlipCard;
