import { Link } from 'react-router-dom';

import Button from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';

const steps = [
  {
    title: 'Create a poll',
    description: 'Add your question and up to 6 options in seconds.',
  },
  {
    title: 'Share the link',
    description: 'Send the poll link to anyone—no sign-up required.',
  },
  {
    title: 'See results live',
    description: 'View votes and charts as they come in.',
  },
];

export default function WelcomePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 pb-8">
      {/* Hero */}
      <section className="space-y-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--smart-primary)] sm:text-5xl">
          Create polls in seconds.
        </h1>
        <p className="mx-auto max-w-xl text-lg text-[var(--smart-secondary)]">
          Ask a question, share a link, and get real-time results. Simple, fast, and free.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to="/create">
            <Button className="min-w-[160px] px-6 py-3 text-base">
              Create a poll
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" className="min-w-[160px] px-6 py-3 text-base">
              View dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="mb-6 text-center text-xl font-semibold tracking-tight text-[var(--smart-primary)]">
          How it works
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title} className="flex flex-col">
              <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--smart-accent)]/20 text-sm font-bold text-[var(--smart-primary)]">
                {i + 1}
              </span>
              <CardTitle className="mt-0">{step.title}</CardTitle>
              <p className="mt-1 flex-1 text-sm text-[var(--smart-secondary)]">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA card */}
      <section>
        <Card className="border-[var(--smart-secondary)]/25 bg-[var(--smart-accent)]/10 text-center">
          <p className="text-lg font-medium text-[var(--smart-primary)]">Ready to get started?</p>
          <p className="mt-1 text-sm text-[var(--smart-secondary)]">
            Create your first poll and share it with your audience.
          </p>
          <Link to="/create" className="mt-4 inline-block">
            <Button className="px-6 py-2.5">Create a poll</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
