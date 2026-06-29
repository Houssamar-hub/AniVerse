// pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopAnime, getSeasonalAnime } from '../api/homeApi';
import { FaArrowRight, FaStar, FaFire, FaCalendarAlt } from 'react-icons/fa';
import Hero from '../components/HeroSection';

function HomePage() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch trending anime first
      const trendingRes = await getTopAnime(1, 6);
      setTrending(trendingRes.data);
      
      // Then fetch seasonal anime with a small delay
      setTimeout(async () => {
        try {
          const seasonalRes = await getSeasonalAnime(1, 6);
          setSeasonal(seasonalRes.data);
          setError(null);
        } catch (err) {
          if (err.response?.status === 429) {
            setError('Too many requests. Please wait a moment and try again.');
          } else {
            setError('Failed to load seasonal anime.');
          }
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, 500); // 500ms delay between requests
      
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError('Failed to load anime data. Please try again.');
      }
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing anime...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>😕 {error}</h2>
        <button onClick={fetchData} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="homepage">
      <Hero />

      {/* ===== TRENDING SECTION ===== */}
      <section className="section">
        <div className="section-header">
          <div className="section-header-left">
            <FaFire className="section-icon" />
            <h2 className="section-title">Trending Anime</h2>
          </div>
          <button 
            onClick={() => navigate('/anime')}
            className="section-view-all"
          >
            View All
            <FaArrowRight className="section-view-icon" />
          </button>
        </div>
        <div className="anime-grid">
          {trending.map(anime => (
            <div 
              key={anime.mal_id}
              onClick={() => navigate(`/anime/${anime.mal_id}`)}
              className="anime-card"
            >
              <div className="anime-card-image">
                <img 
                  src={anime.images.jpg.image_url} 
                  alt={anime.title}
                />
                <div className="anime-card-score">
                  <FaStar className="star-icon" />
                  <span>{anime.score || 'N/A'}</span>
                </div>
              </div>
              <div className="anime-card-content">
                <h3 className="anime-card-title">{anime.title}</h3>
                <div className="anime-card-info">
                  <span className="anime-card-episodes">
                    {anime.episodes || '?'} eps
                  </span>
                  <span className="anime-card-year">
                    {anime.year || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SEASONAL SECTION ===== */}
      <section className="section">
        <div className="section-header">
          <div className="section-header-left">
            <FaCalendarAlt className="section-icon" />
            <h2 className="section-title">Seasonal Anime</h2>
          </div>
          <button 
            onClick={() => navigate('/anime')}
            className="section-view-all"
          >
            View All
            <FaArrowRight className="section-view-icon" />
          </button>
        </div>
        <div className="anime-grid">
          {seasonal.map(anime => (
            <div 
              key={anime.mal_id}
              onClick={() => navigate(`/anime/${anime.mal_id}`)}
              className="anime-card"
            >
              <div className="anime-card-image">
                <img 
                  src={anime.images.jpg.image_url} 
                  alt={anime.title}
                />
                <div className="anime-card-score">
                  <FaStar className="star-icon" />
                  <span>{anime.score || 'N/A'}</span>
                </div>
              </div>
              <div className="anime-card-content">
                <h3 className="anime-card-title">{anime.title}</h3>
                <div className="anime-card-info">
                  <span className="anime-card-episodes">
                    {anime.episodes || '?'} eps
                  </span>
                  <span className="anime-card-year">
                    {anime.year || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;