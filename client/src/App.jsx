import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';

import DeckEditPage from './pages/DeckEditPage';
import DecksPage from './pages/DecksPage';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<DecksPage />} />
        <Route path="/:deckId" element={<DeckEditPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
