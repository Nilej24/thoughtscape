import { useState } from 'react';
import { useSigninUserMutation } from '../features/api/apiSlice';

function SignIn() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');

  const onEmailChange = (ev) => setEmail(ev.target.value);
  const onPwdChange = (ev) => setPwd(ev.target.value);

  const [signin, { isLoading }] = useSigninUserMutation();

  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();
      const user = await signin({ email, password: pwd }).unwrap();
      console.log(user);
    } catch (err) {
      // gonna make it do a popup or whatever later
      console.log('error xddddd', err.data.message);
    }
  };

  return (
    <section className="flex flex-col items-center py-10 px-5">
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
