const URL = "http://www.omdbapi.com/?apikey=5d21fc80";

/**
 * debounce waits for a certain time before executing the given function
 * @param {function} fn - function to execute
 * @param {number} delay - delay in ms to execute received function
 * @returns {function}
 */
const debounce = (fn, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
};

/**
 * returns a promise that resolves into either an empty array
 * or movieSearchResults or just the requested data in json format
 * @param {String} searchTerm - term to search
 * @param {String} paramName - parameter to be passed defaults to "s"
 */
const fetchData = async (searchTerm, paramName = "s") => {
  const response = await fetch(`${URL}&${paramName}=${searchTerm}`);
  const data = await response.json();

  if (data.Error) {
    return [];
  }

  if (data.Search) {
    const { Search: searchResults } = data;
    return searchResults;
  }

  return data;
};
