import React from 'react';

import { cn } from '@/lib/utils';

interface BackdropProps {
  show: boolean;
  onClick: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ show, onClick }) => {
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={cn(
        'fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40',
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      onClick={onClick}
    />
  );
};

export default Backdrop;
