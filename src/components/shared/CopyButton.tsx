import { useState } from 'react';
import { toast } from 'sonner';

import Button from '../ui/Button';

type Props = {
  text: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export default function CopyButton({ text, label = 'Copy link', variant = 'secondary' }: Props) {
  const [copying, setCopying] = useState(false);

  const onCopy = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Copy failed (browser blocked permission)');
    } finally {
      setCopying(false);
    }
  };

  return (
    <Button onClick={onCopy} disabled={copying} variant={variant}>
      {copying ? 'Copying…' : label}
    </Button>
  );
}
