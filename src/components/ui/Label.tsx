import type { LabelHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

export default function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('text-sm font-medium text-[var(--smart-primary)]', className)} {...props} />;
}
