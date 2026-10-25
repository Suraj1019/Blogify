import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firstName, titleCase } from '../utils/format';
import { ProfileIcon } from './icons';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-nav">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/home" className="text-xl font-semibold text-black">
          Blogify
        </Link>
        <button
          type="button"
          onClick={() => navigate(user ? '/profile' : '/login')}
          className="flex items-center gap-2 rounded-full border border-gray-500 px-2 py-1 text-gray-900 transition-colors hover:bg-white/50"
        >
          <ProfileIcon className="h-6 w-6" />
          <span className="max-w-[8rem] truncate text-sm">{user ? titleCase(firstName(user.name)) : 'Log in'}</span>
        </button>
      </nav>
    </header>
  );
}
