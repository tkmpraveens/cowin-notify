import { findIndex } from "./../Logic/FindIndex";

export const Filter = (props) => {
  const { type, label, activeOption, optionList, loading, onChange } = props;
  // error,

  const optionId = type
    ? type === "state"
      ? "state_id"
      : type === "dist"
      ? "district_id"
      : ""
    : "";

  const optionName = type
    ? type === "state"
      ? "state_name"
      : type === "dist"
      ? "district_name"
      : ""
    : "";

  const filterChange = (e) => {
    let option = undefined;

    if (e.target.value) {
      let index = findIndex(optionList, optionId, e.target.value);
      if (optionList[index]) {
        option = optionList[index];
      }
    }
    onChange(option);
  };

  return (
    <div className="filter">
      <label className="filter__label title">{label}</label>
      <label className="filter__dropdown">
        {!loading && optionList && (
          <select
            onChange={(e) => filterChange(e)}
            value={activeOption && activeOption[optionId]}
          >
            {optionList.map((option, optionIndex) => {
              return (
                <option key={optionIndex} value={option[optionId]}>
                  {option[optionName]}
                </option>
              );
            })}
          </select>
        )}
      </label>
      {loading && <div className="filter__loading"></div>}
    </div>
  );
};
