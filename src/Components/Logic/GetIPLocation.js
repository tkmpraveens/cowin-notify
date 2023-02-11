import axios from "axios";

import { findIndex } from "./FindIndex";
import { removeLocalStorage } from "./LocalStorage";

export const getIPLocation = (list, setActive, _type) => {
  let type = undefined,
    key = undefined;

  if (_type && list && list.length) {
    if (_type === "state") {
      type = "regionName";
      key = "state_name";
    } else if (_type === "dist") {
      type = "city";
      key = "district_name";
    }

    axios
      .get(
        `http://ip-api.com/json?fields=status,country${type ? `,${type}` : ""}`
      )
      .then((res) => {
        if (
          res &&
          res.data &&
          res.data &&
          res.data.status &&
          res.data.status === "success" &&
          res.data.country &&
          res.data.country === "India" &&
          res.status &&
          res.status === 200
        ) {
          let index = findIndex(list, key, res.data[type]);
          setActive(list[index !== -1 ? index : 0]);

          if (_type === "state") {
            removeLocalStorage("dist");
          }
        } else {
          setActive(list[0]);
        }
      })
      .catch((err) => {
        console.log(err);
        setActive(list[0]);
      });
  } else {
    setActive(list[0]);
  }
};
