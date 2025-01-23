import * as helpers from './helpers.js'

const tmdbBaseUrl = "https://api.themoviedb.org/3/";
const playBtn = document.getElementById("playBtn");

const tmdbKey = async() => {
    try {
        const res = await fetch("https://alona.pythonanywhere.com/key", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data.key
    }catch (error) {
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

const getGenres = async () => {
    const genreRequestEndpoint = "genre/movie/list";
    const requestParams = "?language=en";

    const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;
    let options = await getMovieOptions('GET');

    try {
        let result = await fetch(urlToFetch, options);
        if (result.ok) {
            const jsonResponse = await result.json();
            const genres = jsonResponse.genres;
            console.log(genres)
            return genres
        } else {
            console.log('Something wrong')
        }
    } catch (error) {
        console.log(error);
    }
};

const getMovies = () => {
    const selectedGenre = helpers.getSelectedGenre();
    console.log(selectedGenre)

    // const genreRequestEndpoint = "discover/movie";
    // const requestParams = `?language=en&page=1&with_genres=28`;

    // const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;
    // let options = getMovieOptions('GET');

    const playBtn = document.getElementById("playBtn");
    // playBtn.onclick = console.log(selectedGenre)

};


const getMovieInfo = () => {
};

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = () => {
    const movieInfo = document.getElementById("movieInfo");
    if (movieInfo.childNodes.length > 0) {
        helpers.clearCurrentMovie();
    }
};

getGenres().then(helpers.populateGenreDropdown);
// playBtn.onclick = helpers.showRandomMovie;
playBtn.onclick = getMovies
