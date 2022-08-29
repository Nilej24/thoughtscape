import { useState, useRef, useEffect } from 'react';
import { useRegisterUserMutation } from '../features/api/apiSlice';

function Register() {
  // boring state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');

  // boring change handlers
  const onNameChange = (ev) => setName(ev.target.value);
  const onEmailChange = (ev) => setEmail(ev.target.value);
  const onPwdChange = (ev) => setPwd(ev.target.value);
  const onPwd2Change = (ev) => setPwd2(ev.target.value);

  // cool api hook
  const [register, { isLoading }] = useRegisterUserMutation();

  // for confirming pwd
  const pwd2Ref = useRef();

  // reset validity for confirming password
  useEffect(() => {
    pwd2Ref.current.setCustomValidity('');
  }, [pwd, pwd2]);

  // submit
  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();
      
      if (pwd !== pwd2) {
        pwd2Ref.current.setCustomValidity('Please type the same password into both boxes.');
        pwd2Ref.current.reportValidity();
        return;
      }

      const user = await register({ name, email, password: pwd }).unwrap();
      console.log(user);
    } catch (err) {
      // toast later
      console.log('lollllllll', err.data.message);
    }
  };

  return (
    <section className={`flex flex-col items-center py-10 px-5 ${isLoading ? 'opacity-50' : ''}`}>
      <h1 className="text-5xl font-semibold">
        Register
      </h1>
      <p className="my-2 text-xl text-gray-800 text-center">
        and start making some killer flashcards
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
