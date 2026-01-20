import type { TextareaHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className, ...props }: Props) {
  return (
    <textarea
      className={cn(
        'w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none',
        'focus:border-black/20 focus:ring-2 focus:ring-black/10',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
