const URL = "http://www.omdbapi.com/?apikey=5d21fc80";
const fetchData = async (searchTerm) => {
  const response = await fetch(`${URL}&s=${searchTerm}`);
  const data = await response.json();

  if (data.Error) {
    return [];
  }

  const { Search: searchResults } = data;
  return searchResults;
};

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

  movies.forEach(({ Poster: poster, Title: title }) => {
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
    });

    resultsWrapper.append(movieOption);
  });
};

input.addEventListener("input", debounce(onInput, 500));
document.addEventListener("click", (event) => {
  if (!rootOfAutocomplete.contains(event.target.value)) {
    dropdown.classList.remove("is-active");
  }
});
