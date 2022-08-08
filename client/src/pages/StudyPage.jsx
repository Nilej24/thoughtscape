import { FaEdit } from 'react-icons/fa';

function StudyPage() {
  const answered = false;

  const confidenceColor = '#ef4444';

  return (
    <div className="container mx-auto flex p-6 md:mt-24">
      <section className="hidden md:flex w-1/4 flex-col items-center">
        score
      </section>
      <section className="flex flex-col justify-center items-center w-full md:w-3/4">
        <div style={{borderBottomColor: confidenceColor}} className="bg-gray-100 rounded w-full max-w-xl border-x-8 border-x-gray-100 border-t-8 border-t-gray-100 border-b-8 border-b-black">
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
          hi
        ) : (
          <button style={{backgroundColor: confidenceColor}} className="rounded bg-slate-400 hover:bg-slate-300 w-full max-w-xl p-5 mt-4 font-semibold drop-shadow-lg">
            show answer
          </button>
        )}
      </section>
    </div>
  );
}

export default StudyPage;
