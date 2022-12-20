import { useState } from 'react';
import { FaEdit, FaPlusSquare, FaShareSquare, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IoIosSave } from 'react-icons/io';
import { useGetDeckQuery } from '../features/api/apiSlice';
import { selectUserToken } from '../features/users/usersSlice';

function ListCard({ question, answer }) {
  return (
    <li className="border-t border-gray-300 flex py-2 px-3 cursor-pointer hover:bg-gray-100">
      <p className="w-1/2 text-start pr-2">
        {question}
      </p>
      <p className="w-1/2 text-end pl-2">
        {answer}
      </p>
    </li>
  );
}

// page shown on /edit/:deckId
function DeckEditPage() {

  // get deck id from url
  const { deckId } = useParams();

  // get user token for fetching data
  const userToken = useSelector(selectUserToken);

  // fetch deck so we can display its name
  const { data: deck, isSuccess: deckLoaded } = useGetDeckQuery({ userToken, deckId });

  // set name displayed in the ui
  const deckName = deckLoaded ? deck.name : 'loading...';

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
            <ListCard
              question="isnt that so cool"
              answer="Ipsum odio quia aspernatur esse quia magnam corporis, molestias Repellendus"
            />
            <ListCard
              question="another question?"
              answer="another answer."
            />
            <ListCard
              question="Elit ad consequatur voluptate ea fugiat Odio veniam commodi provident facilis omnis! Neque nostrum deleniti nulla hic modi Sapiente id"
              answer="shush"
            />
            <ListCard
              question="Elit ad consequatur voluptate ea fugiat Odio veniam commodi provident facilis omnis! Neque nostrum deleniti nulla hic modi Sapiente id"
              answer="Consectetur accusamus vitae dignissimos sapiente suscipit at Cum dicta rem in laboriosam eveniet Rerum vel fugit debitis natus saepe? Repudiandae"
            />
            <ListCard
              question="Elit ad consequatur voluptate ea fugiat Odio veniam commodi provident facilis omnis! Neque nostrum deleniti nulla hic modi Sapiente id"
              answer="Consectetur accusamus vitae dignissimos sapiente suscipit at Cum dicta rem in laboriosam eveniet Rerum vel fugit debitis natus saepe? Repudiandae"
            />
            <ListCard
              question="Elit ad consequatur voluptate ea fugiat Odio veniam commodi provident facilis omnis! Neque nostrum deleniti nulla hic modi Sapiente id"
              answer="Consectetur accusamus vitae dignissimos sapiente suscipit at Cum dicta rem in laboriosam eveniet Rerum vel fugit debitis natus saepe? Repudiandae"
            />
            <div className="border-b border-gray-300" />
          </ul>
          <div className="px-7 py-5">
            <button className="w-full drop-shadow-lg flex justify-center py-4 text-3xl font-medium bg-green-500 self-center hover:bg-green-300">
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
            <textarea rows="9" className="bg-gray-50 focus:outline-none" value="how do I edit a card" />
          </div>
          <div className="w-3/4 h-64 mx-auto bg-gray-100 rounded drop-shadow-md mt-6 flex flex-col py-2 px-3">
            <div className="text-lg font-extralight self-start">
              answer
            </div>
            <textarea rows="9" className="bg-gray-50 focus:outline-none" value="select one first, you idiot (scroll down on mobile)" />
          </div>
          <div className="grid grid-rows-2 grid-cols-2 gap-3 pt-8 pb-12 lg:flex lg:justify-center">
            <div>
              <button className="ml-auto flex items-center space-x-1 p-3 rounded drop-shadow bg-sky-500 font-medium hover:bg-sky-300 active:bg-sky-300">
                <span className="text-xl">
                  <IoIosSave />
                </span>
                <span>save</span>
              </button>
            </div>
            <div>
              <button className="flex items-center space-x-1 p-3 rounded drop-shadow bg-green-500 font-medium hover:bg-green-300 active:bg-green-300">
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
