import { useMemo, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import Button from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import { deletePoll, listPolls } from '../../lib/pollsRepo';
import { deleteResults, getResults } from '../../lib/resultsRepo';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState(() => listPolls());

  // votes are derived data -> compute with useMemo for cleanliness
  const pollsWithVotes = useMemo(() => {
    return polls.map((poll) => {
      const results = getResults(poll.id);
      const totalVotes = results ? Object.values(results.votes).reduce((s, v) => s + v, 0) : 0;
      return { poll, totalVotes };
    });
  }, [polls]);

  if (polls.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-black/60">Manage your polls.</p>
        </div>

        <Card>
          <CardTitle>No polls yet</CardTitle>
          <p className="mt-2 text-sm text-black/60">
            Create your first poll to see it listed here.
          </p>
          <div className="mt-3">
            <Link to="/create">
              <Button>Create a poll</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-black/60">Manage your polls.</p>
        </div>

        <Link to="/create">
          <Button>Create new</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {pollsWithVotes.map(({ poll, totalVotes }) => {
          return (
            <Card key={poll.id} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <CardTitle className="truncate">{poll.question}</CardTitle>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/60">
                    <span>
                      <span className="font-medium text-black/70">Poll ID:</span> {poll.id}
                    </span>
                    <span>
                      <span className="font-medium text-black/70">Votes:</span> {totalVotes}
                    </span>
                    <span>
                      <span className="font-medium text-black/70">Created:</span>{' '}
                      {formatDate(poll.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Button variant="secondary" onClick={() => navigate(`/poll/${poll.id}`)}>
                    Open
                  </Button>

                  <Button variant="ghost" onClick={() => navigate(`/poll/${poll.id}/results`)}>
                    Results
                  </Button>

                  <ConfirmDialog
                    title="Delete poll?"
                    description="This will permanently remove the poll and its results."
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={() => {
                      deletePoll(poll.id);
                      deleteResults(poll.id);
                      toast.success('Poll deleted');
                      setPolls((prev) => prev.filter((p) => p.id !== poll.id));
                    }}
                    trigger={<Button variant="danger">Delete</Button>}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
