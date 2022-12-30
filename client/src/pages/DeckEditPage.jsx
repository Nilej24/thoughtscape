import { useState, useEffect, useRef } from 'react';
import { FaEdit, FaPlusSquare, FaShareSquare, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IoIosSave } from 'react-icons/io';
import { useGetDeckQuery, useGetDeckCardsQuery, useCreateEmptyCardMutation, useUpdateCardMutation } from '../features/api/apiSlice';
import { selectUserToken } from '../features/users/usersSlice';

function ListCard({ card, selected }) {
  // REMINDER FOR LATER you can use backticks
  return (
    <div className={`border-t border-gray-300 flex py-2 px-3 cursor-pointer ${selected ? 'bg-gray-300' :'hover:bg-gray-100'}`}>
      <p className="w-1/2 text-start pr-2">
        {card.front}
      </p>
      <p className="w-1/2 text-end pl-2">
        {card.back}
      </p>
    </div>
  );
}

// page shown on /edit/:deckId
function DeckEditPage() {

  // state
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [currentCard, setCurrentCard] = useState('');

  // ref for focusing text box
  const questionBoxRef = useRef(null);

  // get deck id from url
  const { deckId } = useParams();

  // get user token for fetching data
  const userToken = useSelector(selectUserToken);

  // fetch deck so we can display its name
  const { data: deck, isSuccess: deckLoaded } = useGetDeckQuery({ userToken, deckId });
  // fetch cards
  const { data: cards, isSuccess: cardsLoaded, isLoading: cardsLoading } = useGetDeckCardsQuery({ userToken, deckId });

  // mutations
  const [createCard, { isLoading: creatingCard }] = useCreateEmptyCardMutation();
  const [updateCard, { isLoading: updatingCard }] = useUpdateCardMutation();

  // typing handlers
  const onQuestionChange = (ev) => setQuestion(ev.target.value);
  const onAnswerChange = (ev) => setAnswer(ev.target.value);

  // for changing current card
  const changeCard = (card) => {
    setCurrentCard(card._id);
    setQuestion(card.front);
    setAnswer(card.back);
    questionBoxRef.current.focus();
  };

  // click handlers
  const onSaveCardClick = async () => {
    try {
      const newCard = await updateCard({
        userToken,
        cardId: currentCard,
        front: question,
        back: answer,
        newDeckId: deckId,
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
    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  const onDeleteCardClick = async () => {
    try {

    } catch (err) {
      console.log('popup -> ', err.data.message);
    }
  };

  // set name displayed in the ui
  const deckName = deckLoaded ? deck.name : 'loading...';

  // set currentCard on first load
  useEffect(() => {
    if (cardsLoading) return;

    if (cards[0]) {
      changeCard(cards[0]);
    } else {
      onNewCardClick();
    }
  }, [cardsLoading]);

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
        <button className="rounded-md text-xl p-2 bg-slate-400 drop-shadow-md hover:bg-slate-300">
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
            <textarea onChange={onQuestionChange} ref={questionBoxRef} placeholder="[ this is a new card, write your question here ]" rows="9" className="bg-gray-50 focus:outline-none" value={question}/>
          </div>
          <div className="w-3/4 h-64 mx-auto bg-gray-100 rounded drop-shadow-md mt-6 flex flex-col py-2 px-3">
            <div className="text-lg font-extralight self-start">
              answer
            </div>
            <textarea onChange={onAnswerChange} placeholder="[ and your answer here ]" rows="9" className="bg-gray-50 focus:outline-none" value={answer}/>
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
              <button className="ml-auto flex items-center space-x-1 p-3 rounded drop-shadow bg-amber-500 font-medium hover:bg-amber-200 active:bg-amber-200">
                <span className="text-xl">
                  <FaShareSquare />
                </span>
                <span>move</span>
              </button>
            </div>
            <div>
              <button className="flex items-center space-x-1 p-3 rounded drop-shadow bg-red-500 font-medium hover:bg-red-300 active:bg-red-300">
                <span className="text-xl">
                  <FaTrash />
                </span>
                <span>delete</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default DeckEditPage;
