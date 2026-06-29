// src/api/homeApi.js
import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4/";

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

// Get seasonal anime
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

// Search anime
export const searchAnime = async (query, page = 1, limit = 20) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}anime`, {
      params: { q: query, page, limit }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get anime by ID
export const getAnimeById = async (id) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}anime/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get anime characters
export const getAnimeCharacters = async (id) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}anime/${id}/characters`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get character by ID
export const getCharacterById = async (id) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}characters/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search characters
export const searchCharacters = async (query, page = 1) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}characters`, {
      params: { q: query, page }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all characters from API (paginated)
export const getCharacters = async (page = 1) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}characters`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get anime by genre
export const getAnimeByGenre = async (genreId, page = 1) => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}anime`, {
      params: { genres: genreId, page }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get genres list
export const getGenres = async () => {
  try {
    await delay(300);
    const response = await axios.get(`${BASE_URL}genres/anime`);
    return response.data;
  } catch (error) {
    throw error;
  }
};