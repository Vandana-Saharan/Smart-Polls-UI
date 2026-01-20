import { Link, NavLink, Outlet } from 'react-router-dom';

import { cn } from '../../lib/cn';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-xl px-3 py-2 text-sm transition',
    isActive ? 'bg-black text-white' : 'text-black/70 hover:bg-black/5 hover:text-black',
  );

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-black">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="font-extrabold tracking-tight">
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

      <footer className="border-t border-black/10 bg-white py-4 text-center text-sm text-black/60">
        © {new Date().getFullYear()} SmartPolls
      </footer>
    </div>
  );
}
