import { useEffect } from 'react';

// component for modals
// IMPORTANT -- use conditional mounting with &&
// (so it properly removes event listeners)
function Modal({ children, closeModal }) {

  // for closing when pressing esc
  const onEscPress = (ev) => {
    if (ev.key === 'Escape') {
      closeModal();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', onEscPress);
    return () => window.removeEventListener('keydown', onEscPress);
  }, [onEscPress]);

  return (
    <>
      <div onClick={closeModal} className="fixed inset-0 bg-black opacity-50 z-50">
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        className="rounded-lg bg-white z-50 p-10 w-full max-w-xl"
      >
        <button onClick={closeModal} className="cursor-pointer hover:bg-gray-300 text-2xl rounded px-2.5 absolute top-1 right-1">
          x
        </button>
        {children}
      </div>
    </>
  );
}

export default Modal;
