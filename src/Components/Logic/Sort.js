import { findIndex } from "./FindIndex";

export const sortByVaccineCount = (centerList) => {
  return centerList.sort((a, b) => {
    return (b.vaccineCount || 0) - (a.vaccineCount || 0);
  });
};

export const sortBySelectionCount = (centerList, selectionList) => {
  if (
    selectionList &&
    selectionList.length > 0 &&
    centerList &&
    centerList.length > 0
  ) {
    let centers = [...centerList];

    selectionList.map((center) => {
      if (center && center.centerId) {
        let index = findIndex(centerList, "center_id", center.centerId);
        if (centers[index]) {
          centers[index].selectionCount = center.selectionCount;
        }
      }
    });

    return centers.sort((a, b) => {
      return (b.selectionCount || 0) - (a.selectionCount || 0);
    });
  } else return centerList;
};
