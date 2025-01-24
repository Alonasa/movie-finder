import * as helpers from './helpers.js';
import { clearCurrentMovie, displayMovie, getRandomMovie, populateGenreDropdown } from "./helpers.js";

const tmdbBaseUrl = "https://api.themoviedb.org/3/";
const playBtn = document.getElementById("playBtn");
const spinner = document.getElementById("spinner");

// Function to fetch the TMDB API key
const fetchTmdbKey = async () => {
    try {
        const response = await fetch("https://alona.pythonanywhere.com/key");
        const data = await response.json();
        return data.key;
    } catch (error) {
        console.error('Error fetching TMDB key:', error);
    }
};

// Function to create request options for TMDB API calls
const createRequestOptions = async (method) => {
    const key = await fetchTmdbKey();
    return {
        method: method,
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${key}`,
        },
    };
};

// Function for making API requests
const baseRequest = async (url, options) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

// Function to fetch genres from TMDB
const getGenres = async () => {
    const genreRequestEndpoint = "genre/movie/list";
    const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}?language=en`;
    const options = await createRequestOptions('GET');
    const { genres } = await baseRequest(urlToFetch, options);
    return genres;
};

// Function to fetch movies by selected genre
const getMovies = async () => {
    const selectedGenre = helpers.getSelectedGenre();
    const genreRequestEndpoint = "discover/movie";
    const options = await createRequestOptions('GET');

    if (selectedGenre) {
        const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}?language=en&page=1&with_genres=${selectedGenre}`;
        return await baseRequest(urlToFetch, options);
    }
};

// Function to fetch movie details by movie object
const getMovieInfo = async (movie) => {
    const options = await createRequestOptions('GET');
    const urlToFetch = `${tmdbBaseUrl}movie/${movie.id}`;
    return await baseRequest(urlToFetch, options);
};

// Function to show a random movie
export const showRandomMovie = async () => {
    const movieInfo = document.getElementById("movieInfo");
    if (movieInfo.childNodes.length > 0) clearCurrentMovie();

    const movies = await getMovies();
    const randomMovie = getRandomMovie(movies);
    const info = await getMovieInfo(randomMovie);
    displayMovie(info);
};

// Function to wait for content and manage spinner visibility
const waitForContent = async () => {
    spinner.style.display = "block";
    const genres = await getGenres();
    if (genres) populateGenreDropdown(genres);
    spinner.style.display = "none";
};

// Initialize the content and set up event listeners
const init = async () => {
    await waitForContent();
    playBtn.onclick = showRandomMovie;
};

// Start the application
init().then();