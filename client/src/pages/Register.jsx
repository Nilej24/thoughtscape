function FormInput({ type, text }) {
  return <input type={type} placeholder={text} className="border-2 border-black px-4 py-3 my-2 focus:outline-none w-full max-w-md" />
}

function Register() {

  return (
    <section className="flex flex-col items-center py-10 px-5">
      <h1 className="text-5xl font-semibold">
        Register
      </h1>
      <p className="my-2 text-xl text-gray-800 text-center">
        and start making some killer flashcards
      </p>
      <form className="flex flex-col items-center w-full">
        <FormInput type="text" text="username"/>
        <FormInput type="email" text="email"/>
        <FormInput type="password" text="password"/>
        <FormInput type="password" text="confirm password"/>
        <button className="py-3 w-full mt-2 text-white bg-black font-medium hover:bg-gray-700 max-w-md">submit</button>
      </form>
    </section>
  );
}

export default Register;
