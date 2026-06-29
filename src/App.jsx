// App.jsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import Anime from './pages/Anime'
import Characters from './pages/Characters'
import Favorites from './pages/Favorites'
import Mylibrary from './pages/MyLibrary'
import Myratings from './pages/MyRating'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="app-content">
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/my-library" element={<Mylibrary />} />
        <Route path="/my-ratings" element={<Myratings />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App;