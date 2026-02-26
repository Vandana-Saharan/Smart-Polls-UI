import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { toast } from 'sonner';

import CopyButton from '../../components/shared/CopyButton';
import Button from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { getPoll } from '../../lib/pollsRepo';
import { getVoterId } from '../../lib/voter';
import { submitVote } from '../../lib/resultsRepo';
import type { Poll } from '../../types/poll';

export default function VotePage() {
  const { pollId } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');

  useEffect(() => {
    const id = pollId;
    if (!id) return;
    const safeId: string = id;
    let cancelled = false;
    async function load() {
      try {
        const data = await getPoll(safeId);
        if (!cancelled) setPoll(data);
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load poll';
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [pollId]);

  if (!pollId) {
    return <div className="text-[var(--smart-secondary)]">Invalid poll.</div>;
  }

  if (loading) {
    return <div className="text-[var(--smart-secondary)]">Loading poll…</div>;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="text-[var(--smart-secondary)]">{error}</p>
        <Link to="/">
          <Button variant="secondary">Go home</Button>
        </Link>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Poll not found</h1>
        <p className="text-[var(--smart-secondary)]">This poll ID doesn’t exist (or was deleted).</p>
        <Link to="/">
          <Button variant="secondary">Go home</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vote</h1>
        <p className="mt-1 text-[var(--smart-secondary)]">Poll ID: {pollId}</p>
      </div>

      <Card>
        <CardTitle>{poll.question}</CardTitle>
        <div className="mt-3 space-y-2">
          {poll.options.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--smart-secondary)]/20 bg-white p-3 hover:bg-[var(--smart-accent)]/10"
            >
              <input
                type="radio"
                name="option"
                value={opt.id}
                checked={selectedOptionId === opt.id}
                onChange={() => setSelectedOptionId(opt.id)}
              />
              <span className="text-sm">{opt.text}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button
            disabled={!selectedOptionId}
            onClick={() => {
              if (!pollId) return;
              (async () => {
                try {
                  const voterId = getVoterId();
                  const result = await submitVote(pollId, {
                    optionId: selectedOptionId,
                    voterId,
                  });

                  if (!result.ok && result.reason === 'ALREADY_VOTED') {
                    toast.error('You already voted on this poll (on this device).');
                    return;
                  }

                  if (!result.ok) {
                    toast.error('Could not submit vote.');
                    return;
                  }

                  toast.success('Vote submitted!');
                } catch (err) {
                  const message = err instanceof Error ? err.message : 'Could not submit vote.';
                  toast.error(message);
                }
              })();
            }}
          >
            Submit vote
          </Button>

          <Link to={`/poll/${pollId}/results`}>
            <Button variant="secondary">View results</Button>
          </Link>
        </div>{' '}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--smart-secondary)]/20 bg-white p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--smart-primary)]">Share poll</p>
            <p className="mt-1 truncate text-sm text-[var(--smart-secondary)]">{window.location.href}</p>
          </div>

          <CopyButton text={window.location.href} label="Copy poll link" />
        </div>
      </Card>
    </div>
  );
}
