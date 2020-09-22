"use strict";

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

/**
 * returns a numeric version of the received strings, removes, $ and ","
 * from the string
 * @param {String} str - string to convert to number
 * @param {Boolean} extractAndSum - boolean value that tells to just
 *  extract all the numeric value from the given str and sum it up
 * @returns {Number} value of str converted to number
 */
const convertStringToNumber = (str, extractAndSum = false) => {
  if (extractAndSum) {
    const strWithoutSpecialChars = extractNumFromStrAndSum(str);
    return strWithoutSpecialChars;
  } else {
    const strWithoutSpecialChars = removeDollarsAndCommasFrom(str);
    return parseFloat(strWithoutSpecialChars);
  }
};

const removeDollarsAndCommasFrom = (str) => {
  return str.replace(/\$/g, "").replace(/,/g, "");
};

const extractNumFromStrAndSum = (str) => {
  return str.split(" ").reduce((prev, word) => {
    const value = parseFloat(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);
};
