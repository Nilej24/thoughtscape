import { useState, useRef, useEffect } from 'react';
import { FaEdit, FaPlusSquare, FaShareSquare, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { IoIosSave } from 'react-icons/io';
import {
  useGetUserDecksQuery,
  useGetDeckQuery,
  useGetDeckCardsQuery,
  useCreateEmptyCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} from '../features/api/apiSlice';
import { selectUser, selectUserToken } from '../features/users/usersSlice';
import Modal from '../components/Modal';

function ListCard({ card, selected }) {
  // REMINDER FOR LATER you can use backticks
  return (
    <div className={`border-t border-gray-300 flex py-2 px-3 cursor-pointer ${selected ? 'bg-gray-300' :'hover:bg-gray-100'}`}>
      <p className="w-1/2 text-start pr-2 whitespace-pre-line">
        {card.front}
      </p>
      <p className="w-1/2 text-end pl-2 whitespace-pre-line">
        {card.back}
      </p>
    </div>
  );
}

// modal for renaming current deck
function RenameDeckModal({ deck, closeModal }) {

  // for focusing the text box
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();
      console.log('renamed deck');
      closeModal();
    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col items-center gap-y-5">
        <h2 className="text-3xl font-semibold text-center">Rename Deck</h2>
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-y-5 items-center">
          <input ref={inputRef} type="text" required placeholder="title (e.g. Cell Division, Capitals of Asia)" className="border-2 border-black px-4 py-3 my-2 focus:outline-none w-full max-w-md" />
          <button className="rounded flex items-center space-x-2 px-6 py-4 text-xl font-semibold bg-slate-400 hover:bg-slate-300">
            confirm
          </button>
        </form>
      </div>
    </Modal>
  );
}

// modal for moving a card to another deck
function MoveCardModal({ card, closeModal, userToken }) {

  const user = useSelector(selectUser);
  const token = user.token;

  const { data: decks, isSuccess } = useGetUserDecksQuery({ token });

  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();
      console.log('moved card');
      closeModal();
    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  const editableDecks = decks?.filter((deck) => deck.owner === user._id || deck.editors.includes(user._id));
  const options = editableDecks?.map((deck) => {
    return (
      <option key={deck._id} value={deck._id}>{deck.name}</option>
    );
  });

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col items-center gap-5">
        <h2 className="text-3xl font-semibold text-center">Move Card to Another Deck</h2>
        <form onSubmit={onSubmit} className="flex flex-col items-center gap-5 w-full">
          <select required className="w-full max-w-md border-2 border-black focus:outline-none px-4 py-3">
            <option value="">select this card's new deck</option>
            {options}
          </select>
          <button className="rounded flex items-center space-x-2 px-6 py-4 text-xl font-semibold bg-slate-400 hover:bg-slate-300">
            confirm
          </button>
        </form>
      </div>
    </Modal>
  );
}

// page shown on /edit/:deckId
function DeckEditPage() {

  // state
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [currentCard, setCurrentCard] = useState('');
  const [renamingDeck, setRenamingDeck] = useState(false);
  const [movingCard, setMovingCard] = useState(false);

  // ref for focusing text box
  const questionBoxRef = useRef(null);

  // get deck id from url
  const { search } = useLocation();
  const deckId = new URLSearchParams(search).get('deck');

  // get user token for fetching data
  const userToken = useSelector(selectUserToken);

  // fetch deck so we can display its name
  const { data: deck, isSuccess: deckLoaded } = useGetDeckQuery({ userToken, deckId });
  // fetch cards
  const { data: cards, isSuccess: cardsLoaded } = useGetDeckCardsQuery({ userToken, deckId });

  // mutations
  const [createCard, { isLoading: creatingCard }] = useCreateEmptyCardMutation();
  const [updateCard, { isLoading: updatingCard }] = useUpdateCardMutation();
  const [deleteCard, { isLoading: deletingCard }] = useDeleteCardMutation();

  // typing handlers
  const onQuestionChange = (ev) => setQuestion(ev.target.value);
  const onAnswerChange = (ev) => setAnswer(ev.target.value);

  // for changing current card
  const changeCard = (card) => {
    setCurrentCard(card._id);
    setQuestion(card.front);
    setAnswer(card.back);
  };

  const unsetCard = () => {
    setCurrentCard('');
    setQuestion('');
    setAnswer('');
  }

  // click handlers
  const onSaveCardClick = async () => {
    if (!currentCard) {
      console.log('popup -> please select a card');
      return;
    }

    try {
      const newCard = await updateCard({
        userToken,
        cardId: currentCard,
        front: question,
        back: answer,
      }).unwrap();
      console.log(newCard);
    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  const onNewCardClick = async () => {
    try {
      const newCard = await createCard({ userToken, deckId }).unwrap();
      changeCard(newCard);
      questionBoxRef.current.focus();
    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  const onMoveCardClick = () => {
    if (!currentCard) {
      console.log('popup -> please select a card');
      return;
    }

    setMovingCard(true);
  }

  const onDeleteCardClick = async () => {
    if (!currentCard) {
      console.log('popup -> please select a card');
      return;
    }

    try {
      const deletedCard = await deleteCard({ userToken, cardId: currentCard }).unwrap();
      unsetCard();
      console.log(deletedCard);
    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  // set name displayed in the ui
  const deckName = deckLoaded ? deck.name : 'loading...';

  // card list displayed
  const cardList = cardsLoaded ? cards.map((card) => {

    // for changing appearance of the current selected card
    const selected = card._id === currentCard;

    // for setting current card when clicking
    const onClick = () => {
      if (selected) return;

      changeCard(card);
    }

    // ui for one card
    return (
      <li onClick={onClick} key={card._id}>
        <ListCard card={card} selected={selected} />
      </li>
    );
  }) : 'loading cards...';

  // the main ui thing
  return (
    <>
      <h1 className="text-3xl font-semibold flex justify-center items-center space-x-4 py-7 px-5 container mx-auto">
        <span>
          deck: {deckName}
        </span>
        <button onClick={() => setRenamingDeck(true)} className="rounded-md text-xl p-2 bg-slate-400 drop-shadow-md hover:bg-slate-300">
          <FaEdit />
        </button>
      </h1>
      <div className="container mx-auto flex flex-col-reverse md:flex-row pt-2">
        <section className="text-center w-full md:w-1/2 flex flex-col">
          <h2 className="text-xl font-medium text-center underline md:no-underline">
            select card
          </h2>
          <div className="flex font-light pt-2">
            <h3 className="text-lg text-center w-1/2">
              question
            </h3>
            <h3 className="text-lg text-center w-1/2">
              answer
            </h3>
          </div>
          <ul className="py-2 px-5">
            {cardList}
            <div className="border-b border-gray-300" />
          </ul>
          <div className="px-7 py-5">
            <button onClick={onNewCardClick} className="w-full drop-shadow-lg flex justify-center py-4 text-3xl font-medium bg-green-500 self-center hover:bg-green-300">
              +
            </button>
          </div>
        </section>
        <section className="text-center w-full md:w-1/2">
          <h2 className="text-xl font-medium text-center underline md:no-underline">
            edit card
          </h2>
          <div className="w-3/4 h-64 mx-auto bg-gray-100 rounded drop-shadow-md mt-6 flex flex-col py-2 px-3">
            <div className="text-lg font-extralight self-start">
              question
            </div>
            <textarea onChange={onQuestionChange} ref={questionBoxRef} placeholder={!!currentCard ? "[ this is a new card, write your question here ]" : "[ CURRENTLY NO CARD IS SELECTED ]"} rows="9" className="bg-gray-50 focus:outline-none" value={question}/>
          </div>
          <div className="w-3/4 h-64 mx-auto bg-gray-100 rounded drop-shadow-md mt-6 flex flex-col py-2 px-3">
            <div className="text-lg font-extralight self-start">
              answer
            </div>
            <textarea onChange={onAnswerChange} placeholder={!!currentCard ? "[ and write your answer here. make sure to save your card when you're done... ]" : "[ please select a card or create a new one before saving or deleting ]"} rows="9" className="bg-gray-50 focus:outline-none" value={answer}/>
          </div>
          <div className="grid grid-rows-2 grid-cols-2 gap-3 pt-8 pb-12 lg:flex lg:justify-center">
            <div>
              <button onClick={onSaveCardClick} className="ml-auto flex items-center space-x-1 p-3 rounded drop-shadow bg-sky-500 font-medium hover:bg-sky-300 active:bg-sky-300">
                <span className="text-xl">
                  <IoIosSave />
                </span>
                <span>save</span>
              </button>
            </div>
            <div>
              <button onClick={onNewCardClick} className="flex items-center space-x-1 p-3 rounded drop-shadow bg-green-500 font-medium hover:bg-green-300 active:bg-green-300">
                <span className="text-xl">
                  <FaPlusSquare />
                </span>
                <span>new</span>
              </button>
            </div>
            <div>
              <button onClick={onMoveCardClick} className="ml-auto flex items-center space-x-1 p-3 rounded drop-shadow bg-amber-500 font-medium hover:bg-amber-200 active:bg-amber-200">
                <span className="text-xl">
                  <FaShareSquare />
                </span>
                <span>move</span>
              </button>
            </div>
            <div>
              <button onClick={onDeleteCardClick} className="flex items-center space-x-1 p-3 rounded drop-shadow bg-red-500 font-medium hover:bg-red-300 active:bg-red-300">
                <span className="text-xl">
                  <FaTrash />
                </span>
                <span>delete</span>
              </button>
            </div>
          </div>
        </section>
      </div>
      {renamingDeck && <RenameDeckModal deck={deck} closeModal={() => setRenamingDeck(false)} />}
      {movingCard && <MoveCardModal card={currentCard} closeModal={() => setMovingCard(false)} />}
    </>
  );
}

export default DeckEditPage;
