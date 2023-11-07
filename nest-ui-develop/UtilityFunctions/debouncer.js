let timerId = null;
export const debouncer = (func, data, delay) => {
  // console.log("debouncer", data);
  clearTimeout(timerId);
  timerId = setTimeout(() => func(data), delay);
};
