// App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Anime from "./pages/Anime";
import AnimeDetail from "./pages/AnimeDetail";
import Characters from "./pages/Characters";
import CharacterDetail from "./pages/CharacterDetail";
import Favorites from "./pages/Favorites";
import Mylibrary from "./pages/MyLibrary";
import Myratings from "./pages/MyRating";
import Dashboard from "./pages/Dashboard";
import { CharacterProvider } from "./context/CharacterContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import {LibraryProvider} from './context/LibraryContext'

function App() {
  return (
    <div className="app-content">
      <Navbar />
      <LibraryProvider>
      <CharacterProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/characters/:id" element={<CharacterDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/my-library" element={<Mylibrary />} />
            <Route path="/my-ratings" element={<Myratings />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </FavoritesProvider>
      </CharacterProvider>
      </LibraryProvider>
    </div>
  );
}

export default App;
