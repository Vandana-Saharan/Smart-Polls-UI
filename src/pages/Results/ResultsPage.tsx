import type { Payload } from 'recharts/types/component/DefaultTooltipContent';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CopyButton from '../../components/shared/CopyButton';
import Button from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { getPoll } from '../../lib/pollsRepo';
import { getResults } from '../../lib/resultsRepo';
import type { Poll, PollResults } from '../../types/poll';

export default function ResultsPage() {
  const { pollId } = useParams();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pollId) return;
    let cancelled = false;
    async function load() {
      try {
        const [pollData, resultsData] = await Promise.all([getPoll(pollId), getResults(pollId)]);
        if (!cancelled) {
          setPoll(pollData);
          setResults(resultsData);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load results';
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

  if (!pollId) return <div className="text-[var(--smart-secondary)]">Invalid poll.</div>;

  if (loading) {
    return <div className="text-[var(--smart-secondary)]">Loading results…</div>;
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
        <Link to="/">
          <Button variant="secondary">Go home</Button>
        </Link>
      </div>
    );
  }

  if (!results) return null;

  const totalVotes = Object.values(results.votes).reduce((sum, v) => sum + v, 0);
  const chartData = poll.options.map((opt) => {
    const count = results.votes[opt.id] ?? 0;
    const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

    return {
      name: opt.text.length > 18 ? `${opt.text.slice(0, 18)}…` : opt.text,
      fullName: opt.text,
      votes: count,
      pct,
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Results</h1>
        <p className="mt-1 text-[var(--smart-secondary)]">Poll ID: {pollId}</p>
      </div>

      <Card>
        <CardTitle>{poll.question}</CardTitle>

        <p className="mt-2 text-sm text-[var(--smart-secondary)]">Total votes: {totalVotes}</p>

        <div className="mt-4 space-y-3">
          {poll.options.map((opt) => {
            const count = results.votes[opt.id] ?? 0;
            const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

            return (
              <div key={opt.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{opt.text}</span>
                  <span className="text-[var(--smart-secondary)]">
                    {count} ({pct}%)
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-[var(--smart-secondary)]/20">
                  <div className="h-2 rounded-full bg-[var(--smart-accent)]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--smart-secondary)]/20 bg-white p-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--smart-primary)]">Share results</p>
            <p className="mt-1 truncate text-sm text-[var(--smart-secondary)]">{window.location.href}</p>
          </div>

          <CopyButton text={window.location.href} label="Copy results link" />
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--smart-secondary)]/20 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--smart-primary)]">Votes distribution</p>
            <p className="text-sm text-[var(--smart-secondary)]">Bar chart</p>
          </div>

          <div className="mt-3 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number | undefined) => [value ?? 0, 'Votes']}
                  labelFormatter={(
                    label: unknown,
                    payload: ReadonlyArray<Payload<number, 'Votes'>>,
                  ) => {
                    const first = payload[0]?.payload as { fullName?: string } | undefined;
                    return first?.fullName ?? String(label);
                  }}
                />

                <Bar dataKey="votes" fill="#1d546c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link to={`/poll/${pollId}`}>
            <Button variant="secondary">Back to vote</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost">Go to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
