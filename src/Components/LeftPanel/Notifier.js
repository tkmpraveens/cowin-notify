import { Checkbox } from "./../Common/Checkbox";
import audio from "../../Assets/Notification/alert.mp3";

export const Notifier = (props) => {
  const { isPlay, ripplePlay, testingPlay, togglePlay } = props;

  return (
    <div className="notifier" onClick={() => togglePlay(!isPlay)}>
      <div
        className={
          "notifier__ripple" +
          (isPlay && ripplePlay && !testingPlay
            ? " notifier__ripple--visible"
            : "")
        }
      ></div>

      <div
        className={
          "notifier__checkbox" +
          (isPlay && ripplePlay && !testingPlay
            ? " notifier__checkbox--elevated"
            : "")
        }
      >
        <Checkbox value={isPlay} onChange={() => togglePlay(!isPlay)} />
      </div>
      <div className="notifier__title title">
        {isPlay ? "Sound notification enabled" : "Enable sound notification"}
      </div>
      <div className="notifier__text text">
        {testingPlay
          ? "Testing... "
          : isPlay
          ? "Awesome! Keep this tab open"
          : "Make sure the notification is audible"}
      </div>
      <audio id="player">
        <source src={audio} type="audio/mpeg" />
      </audio>
    </div>
  );
};
