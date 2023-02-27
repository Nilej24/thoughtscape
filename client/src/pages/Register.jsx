import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setUser } from '../features/users/usersSlice';
import { useRegisterUserMutation } from '../features/api/apiSlice';
import { toastFuncs } from '../components/ToastManager';

function Register() {
  // boring state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');

  // boring nav function
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // boring change handlers
  const onNameChange = (ev) => setName(ev.target.value);
  const onEmailChange = (ev) => setEmail(ev.target.value);
  const onPwdChange = (ev) => setPwd(ev.target.value);
  const onPwd2Change = (ev) => setPwd2(ev.target.value);

  // for confirming pwd
  const pwd2Ref = useRef();
  useEffect(() => {
    pwd2Ref.current.setCustomValidity(''); // reset validity for confirming password
  }, [pwd, pwd2]);

  // cool api hook
  const [register, { isLoading }] = useRegisterUserMutation();

  // submit
  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();
      
      // check passwords match in both boxes
      if (pwd !== pwd2) {
        pwd2Ref.current.setCustomValidity('Please type the same password into both boxes.');
        pwd2Ref.current.reportValidity();
        return;
      }

      // get token from REST api
      const user = await register({ name, email, password: pwd }).unwrap();

      // save token and stuff in localStorage
      console.log(user);
      localStorage.setItem('user', JSON.stringify(user));
      // and in redux
      dispatch(setUser(user));

      toastFuncs.success(`registered and signed in as user '${user.name}'`);

      // redirect to 'your decks'
      navigate('/');

    } catch (err) {
      toastFuncs.defaultError(err);
    }
  };

  // page layout
  return (
    <section className={`flex flex-col items-center py-10 px-5 ${isLoading ? 'opacity-50' : ''}`}>
      <h1 className="text-5xl font-semibold">
        Register
      </h1>
      <p className="my-2 text-xl text-gray-800 text-center">
        and start making some <b>killer</b> flashcards
      </p>
      <form onSubmit={onSubmit} className="flex flex-col items-center w-full">
        <input type="text" placeholder="username" value={name} onChange={onNameChange} required className="border-2 border-black px-4 py-3 my-2 focus:outline-none w-full max-w-md" />
        <input type="email" placeholder="email" value={email} onChange={onEmailChange} required className="border-2 border-black px-4 py-3 my-2 focus:outline-none w-full max-w-md" />
        <input type="password" placeholder="password" value={pwd} onChange={onPwdChange} required className="border-2 border-black px-4 py-3 my-2 focus:outline-none w-full max-w-md" />
        <input ref={pwd2Ref} type="password" placeholder="confirm password" value={pwd2} onChange={onPwd2Change} required className="border-2 border-black px-4 py-3 my-2 focus:outline-none w-full max-w-md" />
        <button className="py-3 w-full mt-2 text-white bg-black font-medium hover:bg-gray-700 max-w-md">submit</button>
      </form>
    </section>
  );
}

export default Register;
