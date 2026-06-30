// pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopAnime, getUpcomingAnime } from '../api/homeApi';
import { FaArrowRight, FaStar, FaFire, FaClock } from 'react-icons/fa';
import Hero from '../components/HeroSection';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/homepage.css';

function HomePage() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const trendingRes = await getTopAnime(1, 6);
      setTrending(trendingRes.data);
      
      setTimeout(async () => {
        try {
          const upcomingRes = await getUpcomingAnime(1, 6);
          setUpcoming(upcomingRes.data);
          setError(null);
        } catch (err) {
          console.error('Error fetching upcoming:', err);
          setUpcoming([]);
        }
        setLoading(false);
      }, 500);
      
    } catch (err) {
      setError('Failed to load anime data. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading amazing anime..." size="large" />;
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

      <section className="section">
        <div className="section-header">
          <div className="section-header-left">
            <FaClock className="section-icon" />
            <h2 className="section-title">Upcoming Anime</h2>
          </div>
          <button 
            onClick={() => navigate('/anime')}
            className="section-view-all"
          >
            View All
            <FaArrowRight className="section-view-icon" />
          </button>
        </div>
        {upcoming.length > 0 ? (
          <div className="anime-grid">
            {upcoming.map(anime => (
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
        ) : (
          <div className="empty-state">
            <p>No upcoming anime found at the moment.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;