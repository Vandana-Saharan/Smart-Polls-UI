import { Link, NavLink, Outlet } from 'react-router-dom';

import { cn } from '../../lib/cn';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-xl px-3 py-2 text-sm transition',
    isActive
      ? 'bg-[var(--smart-primary)] text-white'
      : 'text-[var(--smart-secondary)] hover:bg-[var(--smart-accent)]/10 hover:text-[var(--smart-primary)]',
  );

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--smart-bg)] text-[var(--smart-primary)]">
      <header className="border-b border-[var(--smart-secondary)]/20 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="font-extrabold tracking-tight text-[var(--smart-primary)]">
            SmartPolls
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/create" className={navLinkClass}>
              Create
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--smart-secondary)]/20 bg-white py-4 text-center text-sm text-[var(--smart-secondary)]">
        © {new Date().getFullYear()} SmartPolls
      </footer>
    </div>
  );
}
