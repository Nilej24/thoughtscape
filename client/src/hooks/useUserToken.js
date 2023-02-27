import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserToken } from '../features/users/usersSlice';

const useUserToken = () => {
  const navigate = useNavigate();

  // gets token from redux
  const token = useSelector(selectUserToken);

  // check token is in state (basically check the user is logged in)
  useEffect(() => {
    if(!token)
      navigate('/signin');
  }, []);

  // return token
  return token;
};

export { useUserToken };
