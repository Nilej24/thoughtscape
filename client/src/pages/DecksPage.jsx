import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaEdit, FaUserEdit, FaTrash } from 'react-icons/fa';

import { useGetUserDecksQuery } from '../features/api/apiSlice';
import { selectUser, selectUserToken } from '../features/users/usersSlice';
import Modal from '../components/Modal';

// display for each deck
function Deck({ deck, selected=false, changeSelection, onUserPermsClick, onDeleteClick }) {

  // for displaying buttons based on user permissions
  const user = useSelector(selectUser);

  const navigate = useNavigate();

  const onEditClick = () => {
    // load the deck editor page
    navigate(`/edit?deck=${deck._id}`);
  };

  return (
    <li>
      <div className="border"></div>
      <label className="flex items-center space-x-5 p-8 cursor-pointer hover:bg-gray-100 relative group">
        <input type="checkbox" checked={selected} onChange={changeSelection} className="w-6 h-6 shrink-0" />
        <span>{deck.name}</span>
        <div className="hidden group-hover:flex space-x-4 absolute right-8">
          { (deck.owner === user._id || deck.editors.includes(user._id)) && // shows for editors and owners
            <button onClick={onEditClick} className="rounded p-3 text-lg drop-shadow bg-sky-500 hover:bg-sky-300">
              <FaEdit />
            </button>
          }
          { deck.owner === user._id && // shows only for owners
            <>
              <button onClick={onUserPermsClick} className="rounded p-3 text-lg drop-shadow bg-purple-500 hover:bg-purple-300">
                <FaUserEdit />
              </button>
              <button onClick={onDeleteClick} className="rounded p-3 text-lg drop-shadow bg-red-500 hover:bg-red-300">
                <FaTrash />
              </button>
            </>
          }
        </div>
      </label>
    </li>
  );
}

// modal for creating a new deck
function CreateNewDeckModal({ closeModal }) {

  // for focusing the text box
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();
      console.log('created deck');
      closeModal();
    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col items-center gap-y-5">
        <h2 className="text-3xl font-semibold text-center">Create New Deck</h2>
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-y-5 items-center">
          <input ref={inputRef} type="text" required placeholder="title (e.g. Cell Division, Capitals of Asia)" className="border-2 border-black px-4 py-3 my-2 focus:outline-none w-full max-w-md" />
          <button className="rounded flex items-center space-x-2 px-6 py-4 text-xl font-semibold bg-slate-400 hover:bg-slate-300">
            continue
          </button>
        </form>
      </div>
    </Modal>
  );
}

// modal for changing a user's permissions on a deck
function ChangeDeckPermsModal({ modalDeck, closeModal }) {

  // for focusing the text box
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();
      console.log('changed deck permissions');
      closeModal();
    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-center">Change Deck Permissions</h2>
        <h3 className="text-xl text-center mb-5">deck: {modalDeck.name}</h3>
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-y-5 items-center">
          <input ref={inputRef} type="email" required placeholder="enter user's email" className="border-2 border-black px-4 py-3 focus:outline-none w-full max-w-md" />
          <select required className="w-full max-w-md border-2 border-black focus:outline-none px-4 py-3">
            <option value="">select user's new permissions</option>
            <option value="none">remove access to deck</option>
            <option value="student">student</option>
            <option value="editor">editor</option>
            <option value="owner">owner (WARNING: removes you as the owner)</option>
          </select>
          <button className="rounded flex items-center space-x-2 px-6 py-4 text-xl font-semibold bg-slate-400 hover:bg-slate-300">
            confirm
          </button>
        </form>
      </div>
    </Modal>
  );
}

// modal for confirming deletion of a deck
function DeleteDeckModal({ modalDeck, closeModal }) {
  
  const onClick = async (ev) => {
    try {
      ev.preventDefault();
      console.log('deleted deck');
      closeModal();
    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-semibold text-center">Delete Deck</h2>
        <h3 className="text-xl text-center">deck: {modalDeck.name}</h3>
        <p className="text-2xl font-bold text-center mt-5 mb-7">are you sure you want to delete this deck?</p>
        <button onClick={onClick} className="rounded flex items-center space-x-2 px-6 py-4 text-xl font-semibold bg-slate-400 hover:bg-slate-300">
          confirm
        </button>
      </div>
    </Modal>
  );
}

// the whole page
function DecksPage() {

  const [creatingNewDeck, setCreatingNewDeck] = useState(false);
  const [modalDeck, setModalDeck] = useState(null);
  const [changingDeckPermissions, setChangingDeckPermissions] = useState(false);
  const [deletingDeck, setDeletingDeck] = useState(false);
  const [deckSelections, setDeckSelections] = useState([]);
  const token = useSelector(selectUserToken);

  // fetch decks from database
  const { data: decks, isSuccess } = useGetUserDecksQuery({ token });

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    decks.map((deck, index) => {

      const onUserPermsClick = () => {
        setModalDeck(deck);
        setChangingDeckPermissions(true);
      };

      const onDeleteClick = () => {
        setModalDeck(deck);
        setDeletingDeck(true);
      };

      return (
        <Deck key={deck._id} deck={deck} selected={deckSelections[index]} changeSelection={createChangeSelection(index)} onUserPermsClick={onUserPermsClick} onDeleteClick={onDeleteClick} />
      );
    })
  ) : (
    'loading decks...'
  );
  
  // to see if all decks are selected
  const allSelected = deckSelections.every(deck => deck === true);

  // to select / unselect all decks
  const onAllDecksClick = () => {
    if(allSelected) {
      setAllSelectionsTo(false);
    } else {
      setAllSelectionsTo(true);
    }
  };

  /* 'study selected decks' button click handler */
  const onStudyClick = () => {

    /* get string of ids (separated by ',') for the selected decks */
    const studyDeckIds = decks.reduce((str, deck, index) => {
      if (deckSelections[index] == false) return str;
      return str + (str === '' ? '' : ',') + deck._id;
    }, '');

    /* popup error thing if none are selected */
    if (studyDeckIds.length === 0) {
      console.log('popup -> please select some decks to study');
      return;
    }

    /* go to study page */
    navigate('/study?decks=' + encodeURIComponent(studyDeckIds));
  };

  return (
    <>
      <section className="container mx-auto p-4 flex flex-col">
        <h1 onClick={() => console.log(deckSelections)} className="text-3xl font-semibold text-center py-3">
          Your Decks
        </h1>
        <button onClick={onStudyClick} className="rounded-full drop-shadow-lg flex items-center space-x-2 px-6 py-4 my-6 text-xl font-semibold bg-slate-400 self-center md:self-start hover:bg-slate-300">
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
        <button onClick={() => setCreatingNewDeck(true)} className="w-full max-w-md drop-shadow-lg flex justify-center py-4 my-6 text-3xl font-medium bg-slate-400 self-center md:self-start md:ml-16 hover:bg-slate-300">
          +
        </button>
      </section>
      {creatingNewDeck && <CreateNewDeckModal closeModal={() => setCreatingNewDeck(false)} />}
      {changingDeckPermissions && <ChangeDeckPermsModal modalDeck={modalDeck} closeModal={() => setChangingDeckPermissions(false)} />}
      {deletingDeck && <DeleteDeckModal modalDeck={modalDeck} closeModal={() => setDeletingDeck(false)} />}
    </>
  );
}

export default DecksPage;
