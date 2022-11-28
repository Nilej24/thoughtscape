import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSignOutAlt, FaSignInAlt, FaUser } from 'react-icons/fa';

import { unsetUser, selectUser } from '../features/users/usersSlice';

function HeaderButton({ iconElement, text }) {
  return (
    <button className="flex items-center space-x-2 font-extrabold drop-shadow-md px-6 py-3 rounded bg-slate-400 hover:bg-slate-300">
      {iconElement}
      <span>{text}</span>
    </button>
  );
}

function Header() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);

  // click handler for signout button
  const onSignoutClick = () => {

    // remove user from local storage
    localStorage.removeItem('user');
    // and from redux
    dispatch(unsetUser());

    // navigate to sign in page
    navigate('/signin');
  }

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
            <div onClick={onSignoutClick}>
              <HeaderButton iconElement={<FaSignOutAlt />} text='sign out' />
            </div>
          ) : (
            <>
              <Link to="/signin">
                <HeaderButton iconElement={<FaSignInAlt />} text='sign in' />
              </Link>
              <Link to="/register">
                <HeaderButton iconElement={<FaUser />} text='register' />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
