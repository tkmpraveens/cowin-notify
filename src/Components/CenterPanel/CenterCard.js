import { Fragment } from "react";
import { Checkbox } from "./../Common/Checkbox";
import { findIndex } from "./../Logic/FindIndex";

export const CenterCard = (props) => {
  const { center, selectionList, selectCenter } = props;
  const {
    vaccineCount,
    firstDoseVaccineCount,
    secondDoseVaccineCount,
    vaccineList,
    ageList,
    center_id,
  } = center;

  const getVaccineDetails = () => {
    return (
      <span className="center-card__info text">
        <span
          className={
            "center-card__vaccine-count" +
            (vaccineCount === 0 ? " center-card__vaccine-count--zero" : "")
          }
        >
          {vaccineCount}
        </span>
        <span>
          <span className="center-card__vaccine-label">
            {`Vaccine slot${vaccineCount > 0 ? "s" : ""}`}{" "}
          </span>

          {vaccineCount > 0 && (
            <span>
              {renderDose()}

              {vaccineList &&
                Object.keys(vaccineList) &&
                Object.keys(vaccineList).length > 0 && (
                  <span className="center-card__sep"></span>
                )}
              {renderVaccine()}

              {ageList &&
                Object.keys(ageList) &&
                Object.keys(ageList).length > 0 && (
                  <span className="center-card__sep"></span>
                )}
              {renderAge()}

              {center.fee_type && <span className="center-card__sep"></span>}
              <span>{center.fee_type || ""}</span>
            </span>
          )}
        </span>
      </span>
    );
  };

  const renderDose = () => {
    return (
      <span className="center-card__vaccine-dose">
        <span>
          <span className="center-card__sep"></span>

          {firstDoseVaccineCount > 0 && (
            <span className="center-card__vaccine-dose--first">
              {`${firstDoseVaccineCount} First Dose`}
            </span>
          )}

          {firstDoseVaccineCount > 0 && secondDoseVaccineCount > 0 ? ` & ` : ``}

          {secondDoseVaccineCount > 0 && (
            <span className="center-card__vaccine-dose--second">
              {`${secondDoseVaccineCount} Second Dose`}
            </span>
          )}
        </span>
      </span>
    );
  };

  const renderVaccine = () => {
    let vaccines = Object.keys(vaccineList);

    return (
      vaccines &&
      vaccines.map((vaccine, vaccineIndex) => {
        return (
          <span key={vaccineIndex}>
            {`${vaccineIndex > 0 ? " & " : ""}${
              vaccineList[vaccine]
            } ${vaccine}`}
          </span>
        );
      })
    );
  };

  const renderAge = () => {
    let ages = Object.keys(ageList);
    return (
      ages &&
      ages.map((age, ageIndex) => {
        return (
          <span key={ageIndex}>
            {`${
              ageIndex === 0
                ? "Age"
                : ages.length - 1 === ageIndex
                ? " & "
                : ", "
            } ${
              age === "18"
                ? "18-44"
                : age === "40"
                ? "40-44"
                : age === "45"
                ? "45+"
                : ""
            }`}
          </span>
        );
      })
    );
  };

  // Is health center selected
  const isSelected = () => {
    if (selectionList && center && center.center_id) {
      let selectionIndex = findIndex(
        selectionList,
        "centerId",
        center.center_id
      );
      return selectionIndex !== -1 ? true : false;
    }
    return false;
  };

  if (center) {
    return (
      <div
        className={
          "center-card" +
          (vaccineCount >= 30 ? " center-card--many" : "") +
          (vaccineCount >= 10 && vaccineCount < 30
            ? " center-card--enough"
            : "") +
          (vaccineCount > 0 && vaccineCount < 10 ? " center-card--less" : "")
        }
        onClick={() => selectCenter(center_id)}
      >
        <h1 className="center-card__name title">{center.name || ""}</h1>
        <p className="center-card__address text">
          {`${center.address ? center.address : ""}${
            center.block_name ? `, ${center.block_name}` : ""
          }`}
        </p>
        <div className="center-card__select">
          <Checkbox
            value={isSelected()}
            onChange={() => selectCenter(center_id)}
          />
        </div>
        {getVaccineDetails()}
      </div>
    );
  } else return null;
};
