import * as helpers from './helpers.js'
import {clearCurrentMovie, displayMovie, getRandomMovie, populateGenreDropdown} from "./helpers.js";

const tmdbBaseUrl = "https://api.themoviedb.org/3/";
const playBtn = document.getElementById("playBtn");

const tmdbKey = async () => {
    try {
        const res = await fetch("https://alona.pythonanywhere.com/key", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data.key
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

const getMovieOptions = async (method) => {
    let key = await tmdbKey();
    return {
        method: method,
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${key}`,
        },
    }
}


const baseRequest = async (urlToFetch, options) => {
    try {
        let result = await fetch(urlToFetch, options);
        if (result.ok) {
            const jsonResponse = await result.json();
            return jsonResponse
        } else {
            console.log('Something wrong');
        }
    } catch (error) {
        console.log(error);
    }
}

const getGenres = async () => {
    const genreRequestEndpoint = "genre/movie/list";
    const requestParams = "?language=en";
    const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;
    let options = await getMovieOptions('GET');
    let genres = await baseRequest(urlToFetch, options);
    return genres.genres
};

const getMovies = async () => {
    const selectedGenre = helpers.getSelectedGenre();

    const genreRequestEndpoint = "discover/movie";
    let options = await getMovieOptions('GET');

    const playBtn = document.getElementById("playBtn");
    if (selectedGenre) {
        const requestParams = `?language=en&page=1&with_genres=${selectedGenre}`;
        const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;
        return await baseRequest(urlToFetch, options)
    }
};


const getMovieInfo = async (movie) => {
    let options = await getMovieOptions('GET');
    const movieId = movie.id;
    const movieEndpoint = `movie/${movieId}`;
    const urlToFetch = tmdbBaseUrl + movieEndpoint;
    return await baseRequest(urlToFetch, options)
};


// Gets a list of movies and ultimately displays the info of a random movie from the list
export const showRandomMovie = async () => {
    const movieInfo = document.getElementById("movieInfo");
    if (movieInfo.childNodes.length > 0) {
        clearCurrentMovie();
    }
    const movies = await getMovies();
    const randomMovie = getRandomMovie(movies);
    const info = await getMovieInfo(randomMovie);
    displayMovie(info)
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;
// playBtn.onclick = getMovies
