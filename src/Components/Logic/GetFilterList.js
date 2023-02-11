import axios from "axios";

export const getStateList = (setStateList) => {
  setStateList(undefined, true, false);

  axios
    .get(`https://cdn-api.co-vin.in/api/v2/admin/location/states`)
    .then((res) => {
      if (
        res &&
        res.data &&
        res.data &&
        res.data.states &&
        res.data.states.length &&
        res.status &&
        res.status === 200
      ) {
        setStateList(res.data.states, false, false);
      }
    })
    .catch((err) => {
      setStateList(undefined, false, false);
    });
};

export const getDistList = (setDistList, state) => {
  if (state && state.state_id) {
    setDistList(undefined, true, false);

    axios
      .get(
        `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state.state_id}`
      )
      .then((res) => {
        if (
          res &&
          res.data &&
          res.data &&
          res.data.districts &&
          res.data.districts.length &&
          res.status &&
          res.status === 200
        ) {
          setDistList(res.data.districts, false, false);
        }
      })
      .catch((err) => {
        setDistList(undefined, false, false);
      });
  }
};
