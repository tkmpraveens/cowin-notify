import infoIcon from "./../../Assets/info.svg";
import errorIcon from "./../../Assets/error.svg";

export const Message = (props) => {
  const { type, title, text } = props;

  const icon = type
    ? type === "warning"
      ? infoIcon
      : type === "error"
      ? errorIcon
      : undefined
    : undefined;
  return (
    <div
      className={
        "message" +
        (type && type === "warning" ? " message--warning" : "") +
        (type && type === "error" ? " message--error" : "")
      }
    >
      <div className="message__icon">{icon && <img src={icon} alt="" />}</div>
      <div className="message__title title">{title || ""}</div>
      <div className="message__text text">{text || ""}</div>
    </div>
  );
};
