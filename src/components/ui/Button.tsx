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
        'focus:outline-none focus:ring-2 focus:ring-[var(--smart-accent)]/30 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' &&
          'bg-[var(--smart-primary)] text-white hover:opacity-90',
        variant === 'secondary' &&
          'bg-white text-[var(--smart-primary)] border border-[var(--smart-secondary)]/30 hover:bg-[var(--smart-accent)]/10',
        variant === 'ghost' &&
          'bg-transparent text-[var(--smart-primary)] border border-[var(--smart-secondary)]/20 hover:bg-[var(--smart-accent)]/10',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',

        className,
      )}
      {...props}
    />
  );
}
