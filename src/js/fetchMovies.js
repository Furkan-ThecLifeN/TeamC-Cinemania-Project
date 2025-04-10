const API_KEY = 'f1a0a8dd870a150fcd20cd47eff55f54';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Genel API fetch fonksiyonu
 * @param {string} baseURL
 * @param {string} endpoint
 * @param {object} params
 */
export async function fetchMovies(baseURL, endpoint, params = {}) {
  const url = new URL(baseURL + endpoint);

  // Temel parametreler
  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('language', 'en-US');

  // Ekstra parametreler
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('fetchMovies error:', error);
    return { results: [] };
  }
}

export { BASE_URL };
