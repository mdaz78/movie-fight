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

  if (bothMoviesAreSearched(leftMovie, rightMovie)) {
    runComparison();
  }
};

const bothMoviesAreSearched = (leftMovie, rightMovie) => {
  return leftMovie && rightMovie;
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    ".left-summary .notification"
  );

  const rightSideStats = document.querySelectorAll(
    ".right-summary .notification"
  );

  leftSideStats.forEach((leftSideStat, index) => {
    const rightSideStat = rightSideStats[index];

    const leftSideValue = leftSideStat.dataset.value;
    const rightSideValue = rightSideStat.dataset.value;

    if (isNaN(leftSideValue) || isNaN(rightSideValue)) {
      leftSideStat.classList.add("is-primary");
      rightSideStat.classList.add("is-primary");
    } else if (rightSideValue > leftSideValue) {
      rightSideStat.classList.add("is-primary");
      leftSideStat.classList.add("is-warning");
    } else {
      leftSideStat.classList.add("is-primary");
      rightSideStat.classList.add("is-warning");
    }
  });
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

  const boxOfficeValue = convertStringToNumber(boxOffice);
  const metaScoreValue = convertStringToNumber(metaScore);
  const imdbRatingsValue = convertStringToNumber(imdbRating);
  const imdbVotesValue = convertStringToNumber(imdbVotes);
  const awardsValue = convertStringToNumber(awards, true);

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
  <article data-value=${awardsValue} class="notification is-primary">
    <p class="title">${awards}</p>
    <p class="sub-title">Awards</p>
  </article>
  <article data-value=${boxOfficeValue} class="notification is-primary">
    <p class="title">${boxOffice}</p>
    <p class="sub-title">Box Office</p>
  </article>
  <article data-value=${metaScoreValue} class="notification is-primary">
    <p class="title">${metaScore}</p>
    <p class="sub-title">Meta Score</p>
  </article>
  <article data-value=${imdbRatingsValue} class="notification is-primary">
    <p class="title">${imdbRating}</p>
    <p class="sub-title">IMDB Rating</p>
  </article>
  <article data-value=${imdbVotesValue} class="notification is-primary">
    <p class="title">${imdbVotes}</p>
    <p class="sub-title">IMDB Votes</p>
  </article>
  `;
};
