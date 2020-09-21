/** 
debounce waits for a certain time before executing the given function
@param {function} fn - function to execute
@param {number} delay - delay in ms to execute received function
@returns {function}
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
