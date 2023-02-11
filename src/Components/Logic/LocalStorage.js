export const setLocalStorage = (key, value) => {
  try {
    if (window && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {}
};

export const getLocalStorage = (key) => {
  try {
    if (window && window.localStorage) {
      return JSON.parse(localStorage.getItem(key)) || undefined;
    } else return undefined;
  } catch {
    return undefined;
  }
};

export const removeLocalStorage = (key) => {
  try {
    if (window && window.localStorage) {
      console.log(key);
      localStorage.removeItem(key);
    }
  } catch {}
};
