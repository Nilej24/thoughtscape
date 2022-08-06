import { FaEdit } from 'react-icons/fa';

function DeckEditPage() {
  const deckName = 'Physics is shit';

  return (
    <>
      <h1 className="text-3xl font-semibold flex justify-center items-center space-x-4 py-7 px-5">
        <span>
          deck: {deckName}
        </span>
        <button className="rounded-md text-xl p-2 bg-red-500 border-2 border-black hover:bg-red-600">
          <FaEdit />
        </button>
      </h1>
      <div className="container mx-auto flex flex-col-reverse md:flex-row">
        <section className="text-center w-full md:w-1/2">
          <h2 className="text-xl font-medium text-center">
            cards
          </h2>
          <div className="flex font-light">
            <h3 className="text-lg text-center w-1/2">
              question
            </h3>
            <h3 className="text-lg text-center w-1/2">
              answer
            </h3>
          </div>
        </section>
        <section className="text-center w-full md:w-1/2">
          <h2 className="text-xl font-medium text-center">
            edit card
          </h2>
        </section>
      </div>
    </>
  );
}

export default DeckEditPage;
