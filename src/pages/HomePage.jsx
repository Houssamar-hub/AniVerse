// pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopAnime, getUpcomingAnime } from '../api/homeApi';
import { FaArrowRight, FaStar, FaFire, FaClock, FaSync } from 'react-icons/fa';
import Hero from '../components/HeroSection';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Homepage.css';

function HomePage() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Fetch trending anime
      try {
        const trendingRes = await getTopAnime(1, 6);
        if (trendingRes && trendingRes.data) {
          setTrending(trendingRes.data);
        } else {
          setTrending([]);
        }
      } catch (err) {
        console.error('Error fetching trending:', err);
        setTrending([]);
      }
      
      // Fetch upcoming anime
      try {
        const upcomingRes = await getUpcomingAnime(1, 6);
        if (upcomingRes && upcomingRes.data) {
          setUpcoming(upcomingRes.data);
        } else {
          setUpcoming([]);
        }
      } catch (err) {
        console.error('Error fetching upcoming:', err);
        setUpcoming([]);
      }
      
      // Check if we have any data
      if (trending.length === 0 && upcoming.length === 0) {
        // Try to get from localStorage
        const cachedTrending = localStorage.getItem('trending_cache');
        const cachedUpcoming = localStorage.getItem('upcoming_cache');
        
        if (cachedTrending) {
          try {
            const parsed = JSON.parse(cachedTrending);
            setTrending(parsed);
          } catch (e) {}
        }
        
        if (cachedUpcoming) {
          try {
            const parsed = JSON.parse(cachedUpcoming);
            setUpcoming(parsed);
          } catch (e) {}
        }
        
        // If still no data, show error
        if (trending.length === 0 && upcoming.length === 0) {
          setError('Unable to load anime data. Please check your connection.');
        }
      }
      
    } catch (err) {
      setError('Failed to load anime data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    clearCache();
    fetchData();
  };

  const handleRefresh = () => {
    clearCache();
    fetchData(true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading amazing anime..." size="large" />;
  }

  if (error && trending.length === 0 && upcoming.length === 0) {
    return (
      <div className="home-error-container">
        <div className="home-error-icon">🌐</div>
        <h2>Connection Issue</h2>
        <p className="home-error-message">{error}</p>
        <p className="home-error-hint">
          {retryCount > 2 
            ? 'The API might be temporarily unavailable. Please try again later.'
            : 'Click the button below to try again.'}
        </p>
        <div className="home-error-actions">
          <button onClick={handleRetry} className="home-retry-btn">
            <FaSync className={retryCount > 0 ? 'spin' : ''} />
            {retryCount > 0 ? 'Try Again' : 'Retry'}
          </button>
          <button onClick={() => window.location.reload()} className="home-refresh-btn">
            Refresh Page
          </button>
        </div>
        {retryCount > 1 && (
          <p className="home-error-tip">
            💡 Tip: You can also try again in a few minutes.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="homepage">
    

      <Hero />
      
      {trending.length > 0 && (
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
                    src={anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url} 
                    alt={anime.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400/1a1a2e/666?text=No+Image';
                    }}
                  />
                  <div className="anime-card-score">
                    <FaStar className="star-icon" />
                    <span>{anime.score?.toFixed(1) || 'N/A'}</span>
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
      )}

      {upcoming.length > 0 && (
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
          <div className="anime-grid">
            {upcoming.map(anime => (
              <div 
                key={anime.mal_id}
                onClick={() => navigate(`/anime/${anime.mal_id}`)}
                className="anime-card"
              >
                <div className="anime-card-image">
                  <img 
                    src={anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url} 
                    alt={anime.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400/1a1a2e/666?text=No+Image';
                    }}
                  />
                  <div className="anime-card-score">
                    <FaStar className="star-icon" />
                    <span>{anime.score?.toFixed(1) || 'N/A'}</span>
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
      )}

      {trending.length === 0 && upcoming.length === 0 && (
        <div className="home-empty-state">
          <span className="home-empty-icon">📺</span>
          <h3>No anime available</h3>
          <p>Please try again later or check your connection.</p>
          <button onClick={handleRetry} className="home-empty-btn">
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;