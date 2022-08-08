import { MdMenuBook } from 'react-icons/md';
import { FaEdit, FaUserEdit, FaTrash } from 'react-icons/fa';

function Deck({ name }) {
  return (
    <li>
      <div className="border"></div>
      <label className="flex items-center space-x-5 p-8 cursor-pointer hover:bg-gray-100 relative group">
        <input type="checkbox" className="w-6 h-6 shrink-0" />
        <span>{name}</span>
        <div className="hidden group-hover:flex space-x-4 absolute right-8">
          <button className="rounded p-3 text-lg drop-shadow bg-sky-500 hover:bg-sky-300">
            <FaEdit />
          </button>
          <button className="rounded p-3 text-lg drop-shadow bg-purple-500 hover:bg-purple-300">
            <FaUserEdit />
          </button>
          <button className="rounded p-3 text-lg drop-shadow bg-red-500 hover:bg-red-300">
            <FaTrash />
          </button>
        </div>
      </label>
    </li>
  );
}

function DecksPage() {
  return (
    <section className="container mx-auto p-4 flex flex-col">
      <h1 className="text-3xl font-semibold text-center py-3">
        Your Decks
      </h1>
      <button className="rounded-full drop-shadow-lg flex items-center space-x-2 px-6 py-4 my-6 text-xl font-semibold bg-slate-400 self-center md:self-start hover:bg-slate-300">
        <span className="text-3xl">
          <MdMenuBook />
        </span>
        <span>study selected decks</span>
      </button>
      <ul>
        <li>
          <label className="flex items-center space-x-5 p-8 cursor-pointer hover:bg-gray-100">
            <input type="checkbox" className="w-6 h-6" />
            <span>all decks</span>
          </label>
       </li>
        <Deck name="chem" />
        <Deck name="maths flashcards for some reason?" />
        <Deck name="Physics is shit" />
      </ul>
      <button className="w-full max-w-md drop-shadow-lg flex justify-center py-4 my-6 text-3xl font-medium bg-slate-400 self-center md:self-start md:ml-16 hover:bg-slate-300">
        +
      </button>
    </section>
  );
}

export default DecksPage;
