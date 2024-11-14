const mainContainer = document.querySelector(".main-container");
const inputEl = document.querySelector(".search-input");
const baseURL = "http://www.omdbapi.com/";
const searchBtn = document.querySelector(".search-btn");
const apiKey = "omdb api key here";

searchBtn.addEventListener("click", getFilms)

async function getFilms() {
    const URL = baseURL + `?apikey=${apiKey}&s=${inputEl.value}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (!data.Search || data.Search.length === 0) {
        mainContainer.innerHTML = `
            <p class="error-text">Unable to find what you’re looking for. Please try another search.</p>
        `;
        return;
    }

    // this gets detailed information for first 6 films as querying
    // by search doesn't give detailed information and querying by 
    // title or imdb id only returns one film data
    const filmData = data.Search.slice(0, 6);
    const filmDataPromises = filmData.map(async film => {
        const res = await fetch(baseURL + `?apikey=${apiKey}&i=${film.imdbID}`)
        return res.json();
    })
    const filmsArray = await Promise.all(filmDataPromises);

    renderFilms(filmsArray);
}

async function renderFilms(filmsArray) {
    let htmlContent = "";
    filmsArray.forEach(film => {
        htmlContent += `
            <div class="film">
                <div class="film-image-container">
                    <img src="${film.Poster}" class="film-poster" alt="${film.Title} poster">
                </div>
                <div class="film-info">
                    <div class="film-header">
                        <h1 class="film-title">${film.Title} <span class="imdb"><svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.78671 1.19529C6.01122 0.504306 6.98878 0.504305 7.21329 1.19529L8.01547 3.66413C8.11588 3.97315 8.40384 4.18237 8.72876 4.18237H11.3247C12.0512 
                        4.18237 12.3533 5.11208 11.7655 5.53913L9.66537 7.06497C9.40251 7.25595 9.29251 7.59447 9.39292 7.90349L10.1951 10.3723C10.4196 11.0633 9.62875 11.6379 
                        9.04097 11.2109L6.94084 9.68503C6.67797 9.49405 6.32203 9.49405 6.05916 9.68503L3.95903 11.2109C3.37125 11.6379 2.58039 11.0633 2.8049 10.3723L3.60708 
                        7.90349C3.70749 7.59448 3.59749 7.25595 3.33463 7.06497L1.2345 5.53914C0.646715 5.11208 0.948796 4.18237 1.67534 4.18237H4.27124C4.59616 4.18237 4.88412 
                        3.97315 4.98453 3.66414L5.78671 1.19529Z" fill="#FEC654"/>
                        </svg>
                        ${film.imdbRating}</span></h1>
                    </div>
                    <div class="film-specs">
                        <p class="film-runtime">${film.Runtime}</p>
                        <p class="film-genre">${film.Genre}</p>
                        <button class="add-watchlist-btn">
                            <i class="fa-solid fa-circle-plus"></i>
                            <span>Watchlist</span>
                        </button>
                    </div>
                    <div class="film-desc">
                        <p>${film.Plot}</p>
                    </div>
                </div>
            </div>
        `
    });

    mainContainer.innerHTML = htmlContent;
}