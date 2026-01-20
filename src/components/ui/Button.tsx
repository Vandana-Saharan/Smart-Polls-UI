import type { ButtonHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';


type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({ className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition',
        'focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-black text-white hover:bg-black/90',
        variant === 'secondary' && 'bg-white text-black border border-black/15 hover:bg-black/5',
        variant === 'ghost' && 'bg-transparent text-black border border-black/10 hover:bg-black/5',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',

        className,
      )}
      {...props}
    />
  );
}
