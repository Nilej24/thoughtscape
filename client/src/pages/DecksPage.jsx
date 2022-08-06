import { MdMenuBook, MdDelete } from 'react-icons/md';
import { FaEdit, FaUserEdit } from 'react-icons/fa';

function DeckButton({ iconElement, hoverText }) {
  return (
    <button class="rounded bg-cyan-600 p-3 text-lg hover:bg-cyan-700">
      {iconElement}
    </button>
  );
}

function Deck({ name }) {
  return (
    <li>
      <label className="flex items-center space-x-5 p-8 cursor-pointer hover:bg-gray-100 relative group">
        <input type="checkbox" className="w-6 h-6 shrink-0" />
        <span>{name}</span>
        <div className="hidden group-hover:flex space-x-4 absolute right-8">
          <DeckButton iconElement={<FaEdit />} />
          <DeckButton iconElement={<FaUserEdit />} />
          <DeckButton iconElement={<MdDelete />} />
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
      <button className="rounded-full drop-shadow-lg flex items-center space-x-2 px-6 py-4 my-6 text-xl font-semibold bg-red-500 self-center md:self-start hover:bg-red-600">
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
        <Deck name="the longest flashcard deck name in recorded history btw, if you really have to know (i'm doing this to test multiple lines)" />
      </ul>
      <button className="w-full max-w-md drop-shadow-lg flex justify-center py-4 my-6 text-3xl font-medium bg-red-500 text-white self-center md:self-start md:ml-16 hover:bg-red-600">
        +
      </button>
    </section>
  );
}

export default DecksPage;
