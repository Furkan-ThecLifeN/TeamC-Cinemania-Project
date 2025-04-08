
const API_KEY = '0ce25b1b3df50695af6eae55a386f147'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export async function getTrendingToday() {
  const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

export { IMAGE_BASE_URL };

