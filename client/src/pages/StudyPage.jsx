import { FaEdit, FaArrowCircleLeft, FaArrowCircleRight } from 'react-icons/fa';

function EndScreen({ score }) {
  return (
    <div className="container mx-auto pt-20 md:pt-44">
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
          <button className="px-6 py-4 gap-2 flex items-center rounded drop-shadow-lg font-semibold bg-slate-400 hover:bg-slate-300">
            <span className="text-2xl">
              <FaArrowCircleLeft />
            </span>
            <span>
              go back
            </span>
          </button>
          <button className="px-6 py-4 gap-2 flex items-center rounded drop-shadow-lg font-semibold bg-slate-400 hover:bg-slate-300">
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

function StudyPage() {
  let currentCardIsAnswered = true;
  let cardsAnswered = 10;
  let score = 7;

  const confidenceColor = '#ef4444';

  // get cards from api
  function Card(confidence) {
    this.confidence = confidence;
  }

  const cards = [
    new Card(3),
    new Card(2),
    new Card(3),
    new Card(3),
    new Card(1),
    new Card(1),
    new Card(1),
    new Card(2),
    new Card(1),
    new Card(3),
  ];
  // will replace this later ^^^^^


  // creates progress bar thingy from the cards selected
  const mapCardsToProgressBar = (card, index) => {
    let color;
    switch(card.confidence) {
      case 1:
        color = '#ef4444';
        break;
      case 2:
        color = '#f59e0b';
        break;
      case 3:
        color = '#22c55e';
        break;
      default:
        color = '#d4d4d4';
    }

    return (
      <div
        style={{
          backgroundColor: index <= cardsAnswered ? color : '#d4d4d4',
        }}
        className={`px-2 md:px-16 py-10 drop-shadow-md md:py-4 ${index === cardsAnswered ? 'border-2 border-black translate-y-1 md:translate-y-0 md:translate-x-2' : ''}`}
      />
    );
  }

  // render end screen instead
  // when user has done 10 cards
  if (cardsAnswered >= 10) return <EndScreen score={score} />

  // render page
  return (
    <section className="container mx-auto px-6 py-10 md:py-40 overflow-hidden">
      <div className="xl:scale-125 flex flex-col md:flex-row justify-center items-center gap-10">
        <div className="flex flex-row md:flex-col-reverse gap-3">
          {cards.map(mapCardsToProgressBar)}
        </div>
        <div className="w-full max-w-xl">
          <div style={{borderBottomColor: confidenceColor}} className="bg-gray-100 rounded w-full border-x-8 border-x-gray-100 border-t-8 border-t-gray-100 border-b-8 border-b-black drop-shadow-lg">
            <div className="flex justify-between items-center pl-2 pr-1">
              <span className="text-4xl">
                {currentCardIsAnswered ? "A" : "Q"}
              </span>
              <button className="text-2xl hover:bg-gray-300 rounded p-1">
                <FaEdit />
              </button>
            </div>
            <p className="flex justify-center text-center text-xl font-medium h-64 py-3 px-10 mb-5 overflow-auto">
              explain induced nuclear fission
            </p>
          </div>
          {currentCardIsAnswered ? (
            <div className="grid grid-cols-3 gap-3 w-full mt-5 relative">
              <p className="text-sm font-extralight absolute -top-5 left-1">
                did you get it right?
              </p>
              <div>
                <button className="w-full rounded p-5 font-semibold drop-shadow-lg bg-red-500 hover:bg-red-300">
                  no
                </button>
              </div>
              <div>
                <button className="w-full rounded p-5 font-semibold drop-shadow-lg bg-amber-500 hover:bg-amber-200">
                  kinda
                </button>
              </div>
              <div>
                <button className="w-full rounded p-5 font-semibold drop-shadow-lg bg-green-500 hover:bg-green-300">
                  yes
                </button>
              </div>
            </div>
          ) : (
            <button style={{backgroundColor: confidenceColor}} className="rounded bg-slate-400 hover:bg-slate-300 w-full p-5 mt-5 font-semibold drop-shadow-lg">
              show answer
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default StudyPage;
