import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';

import DeckEditPage from './pages/DeckEditPage';
import DecksPage from './pages/DecksPage';
import StudyPage from './pages/StudyPage';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<DecksPage />} />
        <Route path="/edit/:deckId" element={<DeckEditPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
