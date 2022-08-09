import { FaEdit } from 'react-icons/fa';

function EndScreen() {
  return (
    <div className="flex flex-col container mx-auto">
      <div className="flex">

      </div>
    </div>
  );
}

function StudyPage() {
  const answered = true;

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

  const count = 4;

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
          backgroundColor: index <= count ? color : '#d4d4d4',
        }}
        className={`px-2 md:px-16 py-10 drop-shadow-md md:py-4 ${index === count ? 'border-2 border-black translate-y-1 md:translate-y-0 md:translate-x-2' : ''}`}
      />
    );
  }

  return (
    <section className="container mx-auto px-6 py-10 md:py-40">
      <div className="xl:scale-125 flex flex-col md:flex-row justify-center items-center gap-10">
        <div className="flex flex-row md:flex-col-reverse gap-3">
          {cards.map(mapCardsToProgressBar)}
        </div>
        <div className="w-full max-w-xl">
          <div style={{borderBottomColor: confidenceColor}} className="bg-gray-100 rounded w-full border-x-8 border-x-gray-100 border-t-8 border-t-gray-100 border-b-8 border-b-black drop-shadow-lg">
            <div className="flex justify-between items-center pl-2 pr-1">
              <span className="text-4xl">
                {answered ? "A" : "Q"}
              </span>
              <button className="text-2xl hover:bg-gray-300 rounded p-1">
                <FaEdit />
              </button>
            </div>
            <p className="flex justify-center text-center text-xl font-medium h-64 py-3 px-10 mb-5 overflow-auto">
              explain induced nuclear fission
            </p>
          </div>
          {answered ? (
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
