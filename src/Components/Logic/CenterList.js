import axios from "axios";

const date = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = `${dd}-${mm}-${yyyy}`;
  return today;
};

let timer = undefined;

export const periodicCheck = (
  setCenterList,
  activeDist,
  setLiveCounter,
  duration
) => {
  timer && clearInterval(timer);

  // Initial call
  getCenterList(setCenterList, activeDist);
  setLiveCounter();

  let i = setInterval(() => {
    getCenterList(setCenterList, activeDist);
    setLiveCounter();
  }, duration * 1000);
  timer = i;
};

const getCenterList = (setCenterList, activeDist) => {
  if (activeDist && activeDist.district_id) {
    setCenterList(undefined, true, false);
    axios
      .get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${
          activeDist.district_id
        }&date=${date()}`
      )
      .then((res) => {
        if (
          res &&
          res.data &&
          res.data &&
          res.data.centers &&
          res.status &&
          res.status === 200
        ) {
          setCenterList(res.data.centers, false, false);
        }
      })
      .catch(() => {
        setCenterList(undefined, false, true);
      });
  }
};
