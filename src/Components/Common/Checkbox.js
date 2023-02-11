export const Checkbox = (props) => {
  const { value, onChange } = props;

  return (
    <label className="checkbox-button">
      <input
        type="checkbox"
        value={value ? value : false}
        onChange={onChange}
        checked={value ? value : false}
        readOnly
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
      <span
        className="checkbox-button__checkmark"
        onClick={(e) => {
          e.stopPropagation();
        }}
      ></span>
    </label>
  );
};
