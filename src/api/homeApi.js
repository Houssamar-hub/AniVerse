// src/api/homeApi.js
import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4/";

// Helper function for delay (to avoid rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// ANIME ENDPOINTS
// ============================================

// Get trending/top anime
export const getTopAnime = async (page = 1, limit = 6) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}top/anime`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get seasonal anime (current season)
export const getSeasonalAnime = async (page = 1, limit = 6) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}seasons/now`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get upcoming anime (future seasons)
export const getUpcomingAnime = async (page = 1, limit = 6) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}seasons/upcoming`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get currently airing anime
export const getAiringAnime = async (page = 1, limit = 6) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime`, {
      params: { 
        status: 'airing',
        page, 
        limit,
        order_by: 'score',
        sort: 'desc'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get most popular anime
export const getPopularAnime = async (page = 1, limit = 6) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime`, {
      params: { 
        order_by: 'popularity',
        sort: 'asc',
        page, 
        limit
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get highest rated anime
export const getHighestRatedAnime = async (page = 1, limit = 6) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime`, {
      params: { 
        order_by: 'score',
        sort: 'desc',
        page, 
        limit
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime by ID (detail)
export const getAnimeById = async (id) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}anime/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Search anime by query
export const searchAnime = async (query, page = 1, limit = 20) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime`, {
      params: { q: query, page, limit }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime by genre
export const getAnimeByGenre = async (genreId, page = 1, limit = 6) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime`, {
      params: { 
        genres: genreId, 
        page, 
        limit,
        order_by: 'score',
        sort: 'desc'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get all genres list
export const getGenres = async () => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}genres/anime`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime by type (TV, Movie, OVA, etc.)
export const getAnimeByType = async (type, page = 1, limit = 6) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime`, {
      params: { 
        type: type,
        page, 
        limit,
        order_by: 'score',
        sort: 'desc'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime by season and year
export const getAnimeBySeason = async (year, season, page = 1, limit = 6) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}seasons/${year}/${season}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// ============================================
// CHARACTERS ENDPOINTS
// ============================================

// Get anime characters by anime ID
export const getAnimeCharacters = async (id) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}anime/${id}/characters`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get character by ID (detail)
export const getCharacterById = async (id) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}characters/${id}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Search characters by query
export const searchCharacters = async (query, page = 1) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}characters`, {
      params: { q: query, page }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get all characters (paginated)
export const getCharacters = async (page = 1) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}characters`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get character voice actors
export const getCharacterVoiceActors = async (id) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}characters/${id}/voices`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get character pictures
export const getCharacterPictures = async (id) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}characters/${id}/pictures`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// ============================================
// OTHER ENDPOINTS
// ============================================

// Get random anime
export const getRandomAnime = async () => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}random/anime`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get random manga
export const getRandomManga = async () => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}random/manga`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime recommendations by ID
export const getAnimeRecommendations = async (id) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime/${id}/recommendations`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime reviews by ID
export const getAnimeReviews = async (id, page = 1) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime/${id}/reviews`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime staff by ID
export const getAnimeStaff = async (id) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime/${id}/staff`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime episodes by ID
export const getAnimeEpisodes = async (id, page = 1) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime/${id}/episodes`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime news by ID
export const getAnimeNews = async (id) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime/${id}/news`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime forum topics by ID
export const getAnimeForum = async (id) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime/${id}/forum`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime videos (trailers, etc.) by ID
export const getAnimeVideos = async (id) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime/${id}/videos`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime pictures by ID
export const getAnimePictures = async (id) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime/${id}/pictures`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get anime statistics by ID
export const getAnimeStatistics = async (id) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}anime/${id}/statistics`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// ============================================
// SCHEDULE ENDPOINTS
// ============================================

// Get anime schedule by day
export const getSchedule = async (day) => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}schedules`, {
      params: { day }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// Get today's schedule
export const getTodaySchedule = async () => {
  try {
    await delay(500);
    const response = await axios.get(`${BASE_URL}schedules`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment.');
    }
    throw error;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error:', error.response.status, error.response.data);
    return {
      status: error.response.status,
      message: error.response.data?.message || 'An error occurred',
      data: error.response.data
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response:', error.request);
    return {
      status: 0,
      message: 'No response from server',
      data: null
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request error:', error.message);
    return {
      status: 0,
      message: error.message,
      data: null
    };
  }
};

// Format anime data
export const formatAnimeData = (anime) => {
  if (!anime) return null;
  
  return {
    id: anime.mal_id,
    title: anime.title,
    titleEnglish: anime.title_english,
    titleJapanese: anime.title_japanese,
    image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
    synopsis: anime.synopsis,
    score: anime.score,
    scoredBy: anime.scored_by,
    rank: anime.rank,
    popularity: anime.popularity,
    members: anime.members,
    favorites: anime.favorites,
    episodes: anime.episodes,
    status: anime.status,
    year: anime.year,
    season: anime.season,
    duration: anime.duration,
    rating: anime.rating,
    genres: anime.genres?.map(g => ({ id: g.mal_id, name: g.name })),
    studios: anime.studios?.map(s => ({ id: s.mal_id, name: s.name })),
    producers: anime.producers?.map(p => ({ id: p.mal_id, name: p.name })),
    themes: anime.themes?.map(t => ({ id: t.mal_id, name: t.name })),
    demographics: anime.demographics?.map(d => ({ id: d.mal_id, name: d.name })),
    trailer: anime.trailer?.url,
    source: anime.source,
    aired: anime.aired,
    broadcast: anime.broadcast
  };
};

// Format character data
export const formatCharacterData = (character) => {
  if (!character) return null;
  
  return {
    id: character.mal_id,
    name: character.name,
    nameKanji: character.name_kanji,
    nicknames: character.nicknames,
    image: character.images?.jpg?.image_url,
    about: character.about,
    favorites: character.favorites,
    anime: character.anime,
    manga: character.manga,
    voices: character.voices
  };
};

export default {
  // Anime
  getTopAnime,
  getSeasonalAnime,
  getUpcomingAnime,
  getAiringAnime,
  getPopularAnime,
  getHighestRatedAnime,
  getAnimeById,
  searchAnime,
  getAnimeByGenre,
  getGenres,
  getAnimeByType,
  getAnimeBySeason,
  
  // Characters
  getAnimeCharacters,
  getCharacterById,
  searchCharacters,
  getCharacters,
  getCharacterVoiceActors,
  getCharacterPictures,
  
  // Other
  getRandomAnime,
  getRandomManga,
  getAnimeRecommendations,
  getAnimeReviews,
  getAnimeStaff,
  getAnimeEpisodes,
  getAnimeNews,
  getAnimeForum,
  getAnimeVideos,
  getAnimePictures,
  getAnimeStatistics,
  
  // Schedule
  getSchedule,
  getTodaySchedule,
  
  // Utilities
  handleApiError,
  formatAnimeData,
  formatCharacterData
};