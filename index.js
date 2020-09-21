const rootOfAutocomplete = document.querySelector(".autocomplete");
rootOfAutocomplete.innerHTML = `
<label class="bold">Search for a movie</label>
<input class="input" />
<div class="dropdown">
  <div class="dropdown-menu">
    <div class="dropdown-content results"></div>
  </div>
</div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (event) => {
  const searchTerm = event.target.value;
  const movies = await fetchData(searchTerm);

  if (movies.length === 0) {
    dropdown.classList.remove("is-active");
    return;
  }

  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");

  movies.forEach((movie) => {
    const { Poster: poster, Title: title } = movie;
    const movieOption = document.createElement("a");
    const imgSrc = poster === "N/A" ? "" : poster;
    movieOption.classList.add("dropdown-item");
    movieOption.innerHTML = `
      <img src="${imgSrc}"/>
      ${title}
    `;

    movieOption.addEventListener("click", () => {
      dropdown.classList.add("is-active");
      input.value = title;
      onMovieSelect(movie);
    });

    resultsWrapper.append(movieOption);
  });
};

const onMovieSelect = async (movie) => {
  const movieData = await fetchData(movie.imdbID, "i");
  document.querySelector("#summary").innerHTML = movieTemplate(movieData);
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

input.addEventListener("input", debounce(onInput, 500));
document.addEventListener("click", (event) => {
  if (!rootOfAutocomplete.contains(event.target.value)) {
    dropdown.classList.remove("is-active");
  }
});
