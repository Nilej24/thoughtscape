import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSigninUserMutation } from '../features/api/apiSlice';
import { setUser } from '../features/users/usersSlice';

function SignIn() {
  // state
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // change handlers
  const onEmailChange = (ev) => setEmail(ev.target.value);
  const onPwdChange = (ev) => setPwd(ev.target.value);

  // high tech rtk hooks for the REST api
  const [signin, { isLoading }] = useSigninUserMutation();

  // submit function
  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();

      // get user
      const user = await signin({ email, password: pwd }).unwrap();
      
      // save in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      // and in redux
      dispatch(setUser(user));

      // redirect to decks page
      navigate('/');

    } catch (err) {
      // gonna make it do a popup or whatever later
      console.log('popup -> ', err.data.message);
    }
  };

  // the ui
  return (
    <section className={`flex flex-col items-center py-10 px-5 ${isLoading ? 'opacity-50' : ''}`}>
      <h1 className="text-5xl font-semibold">
        Sign In
      </h1>
      <p className="my-2 text-xl text-gray-800 text-center">
        and keep doing what you're doing champ
      </p>
      <form onSubmit={onSubmit} className="flex flex-col items-center w-full">
        <input type="email" placeholder="email" value={email} onChange={onEmailChange} required className="border-2 border-black px-4 py-3 my-2 focus:outline-none w-full max-w-md" />
        <input type="password" placeholder="password" value={pwd} onChange={onPwdChange} required className="border-2 border-black px-4 py-3 my-2 focus:outline-none w-full max-w-md" />
        <button className="py-3 w-full mt-2 text-white bg-black font-medium hover:bg-gray-700 max-w-md">submit</button>
      </form>
    </section>
  );
}

export default SignIn;
