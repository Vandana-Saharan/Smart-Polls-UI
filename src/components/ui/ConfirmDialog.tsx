import * as Dialog from '@radix-ui/react-dialog';

import Button from './Button';

type Props = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  trigger: React.ReactNode;
};

export default function ConfirmDialog({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  trigger,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[var(--smart-primary)]/40" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--smart-secondary)]/20 bg-white p-5 shadow-lg">
          <Dialog.Title className="text-lg font-semibold text-[var(--smart-primary)]">{title}</Dialog.Title>

          {description ? (
            <Dialog.Description className="mt-2 text-sm text-[var(--smart-secondary)]">
              {description}
            </Dialog.Description>
          ) : null}

          <div className="mt-5 flex items-center justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="secondary" type="button">
                {cancelText}
              </Button>
            </Dialog.Close>

            <Dialog.Close asChild>
              <Button variant="danger" type="button" onClick={onConfirm}>
                {confirmText}
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
