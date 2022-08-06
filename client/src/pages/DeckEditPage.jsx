import { FaEdit } from 'react-icons/fa';

function Card({ question, answer }) {
  return (
    <li class="border-t border-gray-300 flex py-2 px-3 cursor-pointer hover:bg-gray-100">
      <div className="w-1/2 text-start pr-2">
        {question}
      </div>
      <div className="w-1/2 text-end pl-2">
        {answer}
      </div>
    </li>
  );
}

function DeckEditPage() {
  const deckName = 'really long deck name like really this is a long deck name';

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
          <ul className="py-2 px-5">
            <Card
              question="isnt that so cool"
              answer="Ipsum odio quia aspernatur esse quia magnam corporis, molestias Repellendus"
            />
            <Card
              question="another question?"
              answer="another answer."
            />
            <Card
              question="Elit ad consequatur voluptate ea fugiat Odio veniam commodi provident facilis omnis! Neque nostrum deleniti nulla hic modi Sapiente id"
              answer="shush"
            />
            <Card
              question="Elit ad consequatur voluptate ea fugiat Odio veniam commodi provident facilis omnis! Neque nostrum deleniti nulla hic modi Sapiente id"
              answer="Consectetur accusamus vitae dignissimos sapiente suscipit at Cum dicta rem in laboriosam eveniet Rerum vel fugit debitis natus saepe? Repudiandae"
            />
            <Card
              question="Elit ad consequatur voluptate ea fugiat Odio veniam commodi provident facilis omnis! Neque nostrum deleniti nulla hic modi Sapiente id"
              answer="Consectetur accusamus vitae dignissimos sapiente suscipit at Cum dicta rem in laboriosam eveniet Rerum vel fugit debitis natus saepe? Repudiandae"
            />
            <Card
              question="Elit ad consequatur voluptate ea fugiat Odio veniam commodi provident facilis omnis! Neque nostrum deleniti nulla hic modi Sapiente id"
              answer="Consectetur accusamus vitae dignissimos sapiente suscipit at Cum dicta rem in laboriosam eveniet Rerum vel fugit debitis natus saepe? Repudiandae"
            />
            <div className="border-b border-gray-300" />
          </ul>
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
