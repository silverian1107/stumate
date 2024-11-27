import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    // {text}
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded border border-input bg-transparent px-3 py-1 text-sm font-medium shadow-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-primary-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-primary-800 focus-visible:ring-offset-2 focus-visible:border-primary-500 ring-offset-0 transition-all duration-400 ease-in',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
