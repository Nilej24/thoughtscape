import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/users/usersSlice';
import { useUserToken } from '../hooks/useUserToken';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetStudyCardsQuery, useUpdateCardRatingMutation, useUpdateCardMutation } from '../features/api/apiSlice';
import Modal from '../components/Modal';
import { FaEdit, FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';
import { toastFuncs } from '../components/ToastManager';

// screen for when user has completed 10 cards
function EndScreen({ score, resetStudy }) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-20 md:py-44">
      <div className="flex flex-col items-center gap-10 xl:scale-125">
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-0">
          <p className="md:self-start">
            you got
          </p>
          <div className="rounded-full p-32 sm:p-48 bg-cyan-600 drop-shadow-xl relative">
            <div className="absolute left-32 sm:left-44 top-1 sm:top-16 p-1 h-64 rotate-45 bg-slate-300" />
            <div className={`absolute ${score % 1 === 0 ? 'sm:left-24 left-14' : 'sm:left-16 left-7'} top-7 sm:top-16 text-8xl font-bold`}>
              {score}
            </div>
            <div className="absolute right-7 sm:right-20 bottom-7 sm:bottom-20 text-8xl font-bold">
              10
            </div>
          </div>
          <p className="md:self-end">
            out of those 10 cards
          </p>
        </div>
        <div className="flex gap-5 sm:gap-10">
          <button onClick={() => navigate('/')} className="px-6 py-4 gap-2 flex items-center rounded drop-shadow-lg font-semibold bg-black text-white hover:bg-gray-500">
            <span className="text-2xl">
              <FaArrowCircleLeft />
            </span>
            <span>
              go back
            </span>
          </button>
          <button onClick={resetStudy} className="px-6 py-4 gap-2 flex items-center rounded drop-shadow-lg font-semibold bg-black text-white hover:bg-gray-500">
            <span className="text-2xl">
              <FaArrowCircleRight />
            </span>
            <span>
              continue
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// modal for editing current card
function EditCardModal({ card, closeModal, setUpdatingCurrentCard }) {

  // form state
  const [front, setFront] = useState('loading card...');
  const [back, setBack] = useState('loading card...');
  const onFrontChange = (ev) => setFront(ev.target.value);
  const onBackChange = (ev) => setBack(ev.target.value);

  // set initial state without crashing if card not loaded
  useEffect(() => {
    if (card) {
      setFront(card.front);
      setBack(card.back);
    } else {
      toastFuncs.warning('could not edit card: card not loaded');
      closeModal();
    }
  }, [card]);

  // get token for requests
  const userToken = useUserToken();

  // send req to server
  const [updateCard, setUpdateCard] = useUpdateCardMutation();
  const onSubmit = async (ev) => {
    try {
      ev.preventDefault();
      const updatedCard = await updateCard({ userToken, cardId: card._id, front, back }).unwrap();
      toastFuncs.success('updated current card!');
      setUpdatingCurrentCard(true);
      closeModal();
    } catch (err) {
      toastFuncs.defaultError(err);
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col items-center gap-y-10">
        <h2 className="text-3xl font-semibold text-center">Edit Current Card</h2>
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-y-10 items-center">
          <div className="w-full mx-auto bg-gray-100 rounded drop-shadow-md flex flex-col py-2 px-3">
            <div className="text-lg font-extralight self-start">
              question
            </div>
            <textarea rows="3" value={front} onChange={onFrontChange} placeholder="[ you should probably type something here ]" className="bg-gray-50 focus:outline-none" />
          </div>
          <div className="w-full mx-auto bg-gray-100 rounded drop-shadow-md flex flex-col py-2 px-3">
            <div className="text-lg font-extralight self-start">
              answer
            </div>
            <textarea rows="3" value={back} onChange={onBackChange} placeholder="[ this menu can save even empty cards btw ]" className="bg-gray-50 focus:outline-none" />
          </div>
          <button className="rounded flex items-center space-x-2 px-6 py-4 text-xl font-semibold bg-black text-white hover:bg-gray-500">
            confirm
          </button>
        </form>
      </div>
    </Modal>
  );
}

// 'pure' function for selecting the next card
// returns the selected card
const getNextCard = (cards, currentCard, user) => {
  // if there is only 1 card then return it ofc
  if (cards.length === 1) return cards[0];

  // return any unrated card
  for (const card of cards) {
    if (
      !card.hard.includes(user._id) &&
      !card.medium.includes(user._id) &&
      !card.easy.includes(user._id)
    ) {
      return card;
    }
  }

  // select a random card
  // return if it's not the same as the current card
  const randCard = cards[Math.floor(Math.random() * cards.length)];
  if (randCard._id !== currentCard?._id) return randCard;

  // for if current card is selected
  // return 'highest priority' card instead
  const orderedCards = [
    ...cards.filter(card => card.hard.includes(user._id)),
    ...cards.filter(card => card.medium.includes(user._id)),
    ...cards.filter(card => card.easy.includes(user._id)),
  ];
  return (orderedCards[0]._id !== currentCard?._id) ?  orderedCards[0] : orderedCards[1];
}

// actual page component
function StudyPage() {
  const [currentCard, setCurrentCard] = useState(null);
  const [cardsAnswered, setCardsAnswered] = useState(0);
  const [currentCardIsAnswered, setCurrentCardIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionRatings, setSessionRatings] = useState([]);
  const [editingCard, setEditingCard] = useState(false);

  // get user token for fetching data
  const user = useSelector(selectUser);
  const userToken = useUserToken();

  // get selected deck ids from url
  const { search } = useLocation();
  const deckIds = decodeURIComponent(new URLSearchParams(search).get('decks'));

  // get all cards in all selected decks
  // (get from server using deck ids)
  const { data: cards, isFetching: cardsFetching } = useGetStudyCardsQuery({ userToken, deckIds });

  // check cards array isn't empty
  const navigate = useNavigate();
  useEffect(() => {
    if (cards && cards.length === 0) {
      navigate('/');
      toastFuncs.warning("all decks empty: please select decks that contain more than 0 cards");
    }
  }, [cards]);

  // for updating a card's rating
  const [updateCardRating, { isLoading: updatingRating }] = useUpdateCardRatingMutation();

  // function for switching between sides of the card
  // with related stuff for doing the same on space press
  const flipCard = () => {
    if (currentCard && !updatingRating && !cardsFetching)
      setCurrentCardIsAnswered(!currentCardIsAnswered);
  };
  const onSpacePress = (ev) => {
    if (ev.key !== ' ') return;
    flipCard();
  }
  useEffect(() => {
    window.addEventListener('keydown', onSpacePress);
    return () => window.removeEventListener('keydown', onSpacePress);
  }, [onSpacePress]);

  // state used to update the current card on the page after editing it
  const [updatingCurrentCard, setUpdatingCurrentCard] = useState(false);

  // set initial card
  // also get next card each time a card is completed
  // also update current card after editing
  // this works because setting a card's rating (completing the card) causes all cards to refetch
  useEffect(() => {
    if (updatingCurrentCard) {
      setCurrentCard(cards.find((card) => card._id === currentCard._id));
      setUpdatingCurrentCard(false);
    } else if (cards && cards.length > 0) {
      setCurrentCard(getNextCard(cards, currentCard, user));
    }
  }, [cards]);

  // make the text shown on the card
  const cardText = currentCard && !updatingRating && !cardsFetching ? (currentCardIsAnswered ? currentCard.back : currentCard.front) : 'loading card...';

  // get rating as a number
  // for changing color shown on the card in ui
  const currentRating = currentCard?.easy.includes(user._id) ? 3 : currentCard?.medium.includes(user._id) ? 2 : currentCard?.hard.includes(user._id) ? 1 : 0;

  // function called in each rating button's onClick
  // with related stuff for doing it when 1, 2, or 3 are pressed on keyboard
  const funcForRatingClick = async (newRating) => {
    if (updatingRating) return;
    try {
      const updatedCard = await updateCardRating({ userToken, cardId: currentCard._id, newRating }).unwrap();
      setCurrentCardIsAnswered(false);
      setCardsAnswered(cardsAnswered + 1);
      setScore(score + 0.5 * (newRating - 1));
      setSessionRatings([...sessionRatings, newRating]);
    } catch (err) {
      toastFuncs.defaultError(err);
    }
  };
  const onNumPress = (ev) => {
    if ((ev.key === '1' || ev.key === '2' || ev.key === '3') && currentCardIsAnswered) {
      funcForRatingClick(Number(ev.key));
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', onNumPress);
    return () => window.removeEventListener('keydown', onNumPress);
  }, [onNumPress]);

  // create progress bar for ui
  const progressBarItems = [];
  for (let i = 0; i < 10; i++) {
    const progressBarRating = sessionRatings[i] || 0;

    progressBarItems[i] = (
      <li key={i} className={`px-2 md:px-16 py-10 drop-shadow-md md:py-4 ${i >= cardsAnswered ? 'bg-neutral-300 ' : progressBarRating === 3 ? 'bg-green-500' : progressBarRating === 2 ? 'bg-amber-500' : progressBarRating === 1 ? 'bg-red-500' : ''} ${i === cardsAnswered ? 'border-2 border-black translate-y-1 md:translate-y-0 md:translate-x-2' : ''}`} />
    );
  }

  // function for resetting from the end screen
  const resetStudy = () => {
    setCardsAnswered(0);
    setCurrentCardIsAnswered(false);
    setScore(0);
    setSessionRatings([]);
  };

  // render end screen instead
  // when user has done 10 cards
  if (cardsAnswered >= 10) return <EndScreen score={score} resetStudy={resetStudy} />

  // render page
  return (
    <>
      <section onKeyDown={onSpacePress} className="container mx-auto px-6 py-10 md:py-40">
        <div className="xl:scale-125 flex flex-col md:flex-row justify-center items-center gap-10">
          <ul className="flex flex-row md:flex-col-reverse gap-3">
            {progressBarItems}
          </ul>
          <div className="w-full max-w-xl">
            <div className={`bg-gray-100 rounded w-full border-x-8 border-x-gray-100 border-t-8 border-t-gray-100 border-b-8 drop-shadow-lg ${(currentRating === 3) ? 'border-b-green-500' : (currentRating === 2) ? 'border-b-amber-500' : (currentRating === 1) ? 'border-b-red-500' : 'border-b-gray-400'}`}>
              <div className="flex justify-between items-center pl-2 pr-1">
                <span className="text-4xl">
                  {currentCardIsAnswered ? "A" : "Q"}
                </span>
                <button onClick={() => setEditingCard(true)} className="text-2xl hover:bg-gray-300 rounded p-1">
                  <FaEdit />
                </button>
              </div>
              <p className="flex justify-center text-center text-xl font-medium h-64 py-3 px-10 mb-5 overflow-auto whitespace-pre-line">
                {cardText}
              </p>
            </div>
            {currentCardIsAnswered ? (
              <div className="grid grid-cols-3 gap-3 w-full mt-5 relative">
                <p className="text-sm font-extralight absolute -top-5 left-1">
                  did you get it right?
                </p>
                <div>
                  <button onClick={() => funcForRatingClick(1)} className="w-full rounded p-5 font-semibold drop-shadow-lg bg-red-500 hover:bg-red-300">
                    no
                  </button>
                </div>
                <div>
                  <button onClick={() => funcForRatingClick(2)} className="w-full rounded p-5 font-semibold drop-shadow-lg bg-amber-500 hover:bg-amber-200">
                    kinda
                  </button>
                </div>
                <div>
                  <button onClick={() => funcForRatingClick(3)} className="w-full rounded p-5 font-semibold drop-shadow-lg bg-green-500 hover:bg-green-300">
                    yes
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={flipCard} className={`rounded w-full p-5 mt-5 font-semibold drop-shadow-lg ${(currentRating === 3) ? 'bg-green-500 hover:bg-green-300' : (currentRating === 2) ? 'bg-amber-500 hover:bg-amber-200' : (currentRating === 1) ? 'bg-red-500 hover:bg-red-300' : 'bg-gray-400 hover:bg-gray-300'}`}>
                show answer
              </button>
            )}
          </div>
        </div>
      </section>
      {editingCard && <EditCardModal card={currentCard} setUpdatingCurrentCard={setUpdatingCurrentCard} closeModal={() => setEditingCard(false)} />}
    </>
  );
}

export default StudyPage;
