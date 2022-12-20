import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaEdit, FaUserEdit, FaTrash } from 'react-icons/fa';

import { useGetUserDecksQuery } from '../features/api/apiSlice';
import { selectUser, selectUserToken } from '../features/users/usersSlice';

// display for each deck
function Deck({ deck, selected=false, changeSelection }) {

  // for displaying buttons based on user permissions
  const user = useSelector(selectUser);

  const navigate = useNavigate();

  const onClick = (ev) => {
    // load the deck editor page
    navigate(`/edit/${deck._id}`);
  };

  return (
    <li>
      <div className="border"></div>
      <label className="flex items-center space-x-5 p-8 cursor-pointer hover:bg-gray-100 relative group">
        <input type="checkbox" checked={selected} onChange={changeSelection} className="w-6 h-6 shrink-0" />
        <span>{deck.name}</span>
        <div className="hidden group-hover:flex space-x-4 absolute right-8">
          { (deck.owner === user._id || deck.editors.includes(user._id)) && // shows for editors and owners
            <button onClick={onClick} className="rounded p-3 text-lg drop-shadow bg-sky-500 hover:bg-sky-300">
              <FaEdit />
            </button>
          }
          { deck.owner === user._id && // shows only for owners
            <>
              <button className="rounded p-3 text-lg drop-shadow bg-purple-500 hover:bg-purple-300">
                <FaUserEdit />
              </button>
              <button className="rounded p-3 text-lg drop-shadow bg-red-500 hover:bg-red-300">
                <FaTrash />
              </button>
            </>
          }
        </div>
      </label>
    </li>
  );
}

// the whole page
function DecksPage() {

  const [deckSelections, setDeckSelections] = useState([]);
  const token = useSelector(selectUserToken);

  // fetch decks from database
  const { data: decks, isSuccess } = useGetUserDecksQuery({ token });

  const navigate = useNavigate();

  // send to sign in page if not logged in
  useEffect(() => {
    if(!token)
      navigate('/signin');
  }, []);

  // set all values in deckSelections array
  const setAllSelectionsTo = (val) => {

    if(!decks)
      return;

    setDeckSelections([]);

    decks.forEach(() => {
      setDeckSelections(deckSelections => ([
        ...deckSelections,
        val,
      ]));
    });

  };

  // initialise deckSelections array as all false
  useEffect(() => setAllSelectionsTo(false), [decks]); // 'decks' only changes when loading data

  // creates function for changing state from within each deck component
  const createChangeSelection = (deckIndex) => () => {
    // clone array
    const newArr = [...deckSelections];
    // change value in clone
    newArr[deckIndex] = !newArr[deckIndex];
    // set new array
    setDeckSelections(newArr);
  };

  // create the list of decks using the deck component
  const listContent = isSuccess ? (
    decks.map((deck, index) => <Deck key={deck._id} deck={deck} selected={deckSelections[index]} changeSelection={createChangeSelection(index)} />)
  ) : (
    'loading xdddddddddd'
  )
  
  // to see if all decks are selected
  const allSelected = deckSelections.every(deck => deck === true);

  // to select / unselect all decks
  const onAllDecksClick = () => {
    if(allSelected) {
      setAllSelectionsTo(false);
    } else {
      setAllSelectionsTo(true);
    }
  }

  return (
    <section className="container mx-auto p-4 flex flex-col">
      <h1 onClick={() => console.log(deckSelections)} className="text-3xl font-semibold text-center py-3">
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
            <input type="checkbox" checked={allSelected} onChange={onAllDecksClick} className="w-6 h-6" />
            <span>all decks</span>
          </label>
       </li>
        {listContent}
      </ul>
      <button className="w-full max-w-md drop-shadow-lg flex justify-center py-4 my-6 text-3xl font-medium bg-slate-400 self-center md:self-start md:ml-16 hover:bg-slate-300">
        +
      </button>
    </section>
  );
}

export default DecksPage;
