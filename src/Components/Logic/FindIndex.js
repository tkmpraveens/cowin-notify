export const findIndex = (list, key, match) => {
  return list && list.findIndex((obj) => obj[key] == match);
};
