import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { toast } from 'sonner';
import { getVoterId } from '../../lib/voter';
import { ensureResults, submitVote } from '../../lib/resultsRepo';

import CopyButton from '../../components/shared/CopyButton';
import Button from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { getPoll } from '../../lib/pollsRepo';

export default function VotePage() {
  const { pollId } = useParams();

  const poll = useMemo(() => (pollId ? getPoll(pollId) : null), [pollId]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');

  if (!pollId) {
    return <div className="text-black/60">Invalid poll.</div>;
  }

  if (!poll) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">Poll not found</h1>
        <p className="text-black/60">This poll ID doesn’t exist (or was deleted).</p>
        <Link to="/">
          <Button variant="secondary">Go home</Button>
        </Link>
      </div>
    );
  }
  // make sure results object exists
  ensureResults(poll);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vote</h1>
        <p className="mt-1 text-black/60">Poll ID: {pollId}</p>
      </div>

      <Card>
        <CardTitle>{poll.question}</CardTitle>
        <div className="mt-3 space-y-2">
          {poll.options.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 bg-white p-3 hover:bg-black/5"
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
              const voterId = getVoterId();
              const result = submitVote({
                poll,
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
            }}
          >
            Submit vote
          </Button>

          <Link to={`/poll/${pollId}/results`}>
            <Button variant="secondary">View results</Button>
          </Link>
        </div>{' '}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/10 bg-white p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium">Share poll</p>
            <p className="mt-1 truncate text-sm text-black/60">{window.location.href}</p>
          </div>

          <CopyButton text={window.location.href} label="Copy poll link" />
        </div>
      </Card>
    </div>
  );
}
