import { Checkbox } from "./../Common/Checkbox";

export const SelectAll = (props) => {
  const { isSelectAll, selectAllCenter } = props;

  return (
    <div className="select-all">
      <div
        className="select-all__title title"
        onClick={() => selectAllCenter(!isSelectAll)}
      >
        {isSelectAll ? "All selected" : "Select all"}
      </div>
      <div className="select-all__checkbox">
        <Checkbox
          value={isSelectAll}
          onChange={() => selectAllCenter(!isSelectAll)}
        />
      </div>
    </div>
  );
};
