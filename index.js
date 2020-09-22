createAutoComplete({
  root: document.querySelector(".autocomplete"),

  renderOption({ Poster: poster, Title: title, Year: year }) {
    const imgSrc = poster === "N/A" ? "" : poster;
    return `
      <img src="${imgSrc}"/>
      ${title} (${year})
    `;
  },

  onOptionSelect(movie) {
    onMovieSelect(movie);
  },

  inputValue({ Title: title }) {
    return title;
  },

  async fetchResponse(searchTerm) {
    return await fetchData(searchTerm);
  },
});

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
