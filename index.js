const autoCompleteConfig = {
  renderOption({ Poster: poster, Title: title, Year: year }) {
    const imgSrc = poster === "N/A" ? "" : poster;
    return `
      <img src="${imgSrc}"/>
      ${title} (${year})
    `;
  },

  inputValue({ Title: title }) {
    return title;
  },

  async fetchResponse(searchTerm) {
    return await fetchData(searchTerm);
  },
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    const summaryElement = document.querySelector(".left-summary");
    onMovieSelect(movie, summaryElement, "LEFT");
  },
});

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    const summaryElement = document.querySelector(".right-summary");
    onMovieSelect(movie, summaryElement, "RIGHT");
  },
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const movieData = await fetchData(movie.imdbID, "i");
  summaryElement.innerHTML = movieTemplate(movieData);

  if (side === "LEFT") {
    leftMovie = movieData;
  } else {
    rightMovie = movieData;
  }
};

const bothMoviesAreSearched = (leftMovie, rightMovie) => {
  return leftMovie && rightMovie;
};

const movieTemplate = (movieDetail) => {
  const {
    Poster: poster,
    Title: title,
    Genre: genre,
    Plot: plot,
    Awards: awards,
    BoxOffice: boxOffice,
    Metascore: metaScore,
    imdbRating,
    imdbVotes,
  } = movieDetail;

  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${poster}" alt="Poster of Movie">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${title}</h1>
        <h4>${genre}</h4>
        <p>${plot}</p>
      </div>
    </div>
  </article>
  <article class="notification is-primary">
    <p class="title">${awards}</p>
    <p class="sub-title">Awards</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${boxOffice}</p>
    <p class="sub-title">Box Office</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${metaScore}</p>
    <p class="sub-title">Meta Score</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${imdbRating}</p>
    <p class="sub-title">IMDB Rating</p>
  </article>
  <article class="notification is-primary">
    <p class="title">${imdbVotes}</p>
    <p class="sub-title">IMDB Votes</p>
  </article>
  `;
};
