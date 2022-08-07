import { Link } from 'react-router-dom';
import { FaSignOutAlt, FaSignInAlt, FaUser } from 'react-icons/fa';

function HeaderButton({ iconElement, text }) {
  return (
    <button className="flex items-center space-x-2 font-extrabold drop-shadow-md px-6 py-3 rounded bg-slate-400 hover:bg-slate-300">
      {iconElement}
      <span>{text}</span>
    </button>
  );
}

function Header() {
  const user = false;

  return (
    <nav className="bg-cyan-600 drop-shadow-xl border-b-4 border-black">
      <div className="container mx-auto px-10 py-4 flex justify-between items-center">
        <div>
          <Link to="/" className="text-4xl font-bold hover:text-gray-700 overline">
            ThoughtScape
          </Link>
        </div>
        <div className="hidden sm:flex space-y-0 flex-row space-x-2 md:space-x-5">
          {!!user ? (
            <HeaderButton iconElement={<FaSignOutAlt />} text='sign out' />
          ) : (
            <>
              <HeaderButton iconElement={<FaSignInAlt />} text='sign in' />
              <HeaderButton iconElement={<FaUser />} text='register' />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
