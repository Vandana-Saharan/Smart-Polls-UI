import { Link } from 'react-router-dom';

import Button from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Polls</h1>
        <p className="mt-2 text-[var(--smart-secondary)]">Create a poll, share a link, and view results.</p>
      </div>

      <Card>
        <CardTitle>Quick actions</CardTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/create">
            <Button>Create a poll</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary">View dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
