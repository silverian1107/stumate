import type { InputHTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputWithEndInlineProps
  extends InputHTMLAttributes<HTMLInputElement> {
  inlineText: string;
  className?: string;
}

export default function InputWithEndInline({
  inlineText,
  type,
  className,
  min,
  max,
  ...props
}: InputWithEndInlineProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    if (max !== undefined && value > (max as number)) {
      event.target.value = String(max);
    }
  };
  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <Input
          className="pe-12 text-right pr-16"
          type={type}
          min={min}
          max={max}
          onInput={handleInputChange}
          {...props}
        />
        <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-[10px] text-muted-foreground peer-disabled:opacity-50 text-end">
          {inlineText}
        </span>
      </div>
    </div>
  );
}
