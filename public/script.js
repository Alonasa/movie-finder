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


const baseRequest = async (urlToFetch, options)=> {
    try {
        let result = await fetch(urlToFetch, options);
        if (result.ok) {
            const jsonResponse = await result.json();
            return jsonResponse.genres
        } else {
            console.log('Something wrong')
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
    return await baseRequest(urlToFetch, options)
};

const getMovies = async () => {
    const selectedGenre = helpers.getSelectedGenre();
    console.log(selectedGenre)

    const genreRequestEndpoint = "discover/movie";
    let options = await getMovieOptions('GET');

    const playBtn = document.getElementById("playBtn");
    if (selectedGenre){
        const requestParams = `?language=en&page=1&with_genres=${selectedGenre}`;
        const urlToFetch = tmdbBaseUrl + genreRequestEndpoint + requestParams;
        console.log(urlToFetch)
        return await baseRequest(urlToFetch,options)
    }
};

await getMovies()


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
