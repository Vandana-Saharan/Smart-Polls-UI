import type { InputHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-[var(--smart-secondary)]/20 bg-white px-3 py-2 text-sm text-[var(--smart-primary)] outline-none',
        'focus:border-[var(--smart-accent)] focus:ring-2 focus:ring-[var(--smart-accent)]/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
