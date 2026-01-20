import { useNavigate } from 'react-router-dom';
import { createPoll } from '../../lib/pollsRepo';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import Button from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import FieldError from '../../components/ui/FieldError';
import Input from '../../components/ui/Input';
import Label from '../../components/ui/Label';

// 1) Schema = single source of truth for validation
const createPollSchema = z.object({
  question: z.string().min(5, 'Question should be at least 5 characters'),
  options: z
    .array(
      z.object({
        text: z.string().min(1, 'Option cannot be empty'),
      }),
    )
    .min(2, 'Add at least 2 options')
    .max(6, 'Maximum 6 options'),
});

type CreatePollForm = z.infer<typeof createPollSchema>;

export default function CreatePollPage() {
  // 2) useForm manages form state + validation
  const navigate = useNavigate();

  const form = useForm<CreatePollForm>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      question: '',
      options: [{ text: '' }, { text: '' }],
    },
    mode: 'onTouched',
  });

  // 3) useFieldArray manages dynamic option inputs
  const optionsArray = useFieldArray({
    control: form.control,
    name: 'options',
  });
  const onSubmit = (values: CreatePollForm) => {
    const poll = createPoll({
      question: values.question,
      options: values.options.map((o) => o.text),
    });

    // reset (optional)
    form.reset({
      question: '',
      options: [{ text: '' }, { text: '' }],
    });

    // go to vote page
    navigate(`/poll/${poll.id}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Poll</h1>
        <p className="mt-1 text-black/60">Build a question, add options, share the link.</p>
      </div>

      <Card>
        <CardTitle>Poll details</CardTitle>

        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Question */}
          <div>
            <Label htmlFor="question">Question</Label>
            <div className="mt-2">
              <Input
                id="question"
                placeholder="e.g. Which feature should we build next?"
                {...form.register('question')}
              />
              <FieldError message={form.formState.errors.question?.message} />
            </div>
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between">
              <Label>Options</Label>

              <Button
                type="button"
                variant="secondary"
                onClick={() => optionsArray.append({ text: '' })}
                disabled={optionsArray.fields.length >= 6}
              >
                + Add option
              </Button>
            </div>

            <div className="mt-2 space-y-2">
              {optionsArray.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      {...form.register(`options.${index}.text` as const)}
                    />
                    <FieldError message={form.formState.errors.options?.[index]?.text?.message} />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => optionsArray.remove(index)}
                    disabled={optionsArray.fields.length <= 2}
                    title="Remove option"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>

            {/* Array-level error (min/max options) */}
            <FieldError message={form.formState.errors.options?.message as string | undefined} />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit">Create poll</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
              disabled={!form.formState.isDirty}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
