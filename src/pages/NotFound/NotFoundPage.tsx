import { Link } from 'react-router-dom';

import Button from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';

export default function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>

      <Card>
        <CardTitle>404</CardTitle>
        <p className="mt-2 text-sm text-black/60">
          The page you’re looking for doesn’t exist.
        </p>
        <div className="mt-3">
          <Link to="/">
            <Button variant="secondary">Go home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
