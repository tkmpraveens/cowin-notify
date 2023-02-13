import menuArrowIcon from "../../Assets/down-arrow.svg";

export const Menu = (props) => {
  const { isMenuVisible, setMenuVisible } = props;

  return (
    <div
      className="landing__menu-toggle"
      onClick={() => setMenuVisible(!isMenuVisible)}
    >
      Change state and district
      <img src={menuArrowIcon} alt="" />
    </div>
  );
};
