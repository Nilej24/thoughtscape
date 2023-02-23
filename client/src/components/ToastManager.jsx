import { useState, useEffect } from 'react';
import './toastAnimations.css';

// toastFuncs is exported so we can add toasts from anywhere
const toastFuncs = {};

// toast colors
const toastColors = {
  info:  '#3498db',
  success: '#07bc0c',
  warning: '#f1c40f',
  error: '#e74c3c',
};

// set toast functions before toast manager mounts
for (const [key] of Object.entries(toastColors)) {
  toastFuncs[key] = () => console.error("toast manager hasn't loaded yet");
}

// toast component
function Toast({ message, onClose }) {

  return (
    <div
      style={{backgroundColor: toastColors[message.type]}}
      className="bg-gray-200 font-light rounded w-full p-5 cursor-pointer text-center toast"
      onClick={onClose}
    >
      {message.text}
    </div>
  );
}

// toast manager component
function ToastManager() {
  const [messages, setMessages] = useState([]);

  // state for auto deleting toasts
  const [msgToDelete, setMsgToDelete] = useState(null);

  // update toast functions when state changes
  useEffect(() => {
    for (const [key] of Object.entries(toastFuncs)) {
      toastFuncs[key] = (text) => setMessages([...messages, { text, type: key }]);
    }
  }, [messages]);

  // useEffects for auto delete
  useEffect(() => {
    if (messages.length === 0) return;
    setTimeout(() => setMsgToDelete(messages[messages.length - 1]), 5000);
  }, [messages]);
  useEffect(() => {
    if (!msgToDelete) return;
    // make into function later
    // gonna use ids instead of just object references
    setMessages(messages.filter(m => m !== msgToDelete));
  }, [msgToDelete]);

  // render
  return (
    <div className="fixed bottom-3 right-3 flex flex-col-reverse gap-y-3 w-full max-w-sm">
      {messages.map((message, index) => (
        <Toast
          key={index}
          message={message}
          onClose={() => setMessages(messages.filter((_, i) => i !== index))}
        />
      ))}
    </div>
  );
}

export default ToastManager;
export { toastFuncs };
