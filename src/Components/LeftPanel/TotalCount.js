import React, { Fragment } from "react";

export const TotalCount = (props) => {
  const {
    centerList,
    stateLoading,
    distLoading,
    centerLoading,
    activeState,
    activeDist,
  } = props;

  let totalCount = 0,
    firstDoseVaccineCount = 0,
    secondDoseVaccineCount = 0;

  let vaccineList = { COVAXIN: 0, COVISHIELD: 0 };
  let feeList = { Free: 0, Paid: 0 };
  let ageList = { 45: 0, 18: 0 };

  centerList &&
    centerList.map((center) => {
      if (center) {
        totalCount = center.vaccineCount + totalCount;
        firstDoseVaccineCount =
          center.firstDoseVaccineCount + firstDoseVaccineCount;
        secondDoseVaccineCount =
          center.secondDoseVaccineCount + secondDoseVaccineCount;

        // Vaccine list
        center.vaccineList &&
          Object.keys(center.vaccineList) &&
          Object.keys(center.vaccineList).map((vaccine) => {
            if (vaccineList[vaccine]) {
              vaccineList[vaccine] =
                center.vaccineList[vaccine] + vaccineList[vaccine];
            } else {
              vaccineList[vaccine] = center.vaccineList[vaccine];
            }
          });

        // Fee type
        if (center.fee_type) {
          if (feeList[center.fee_type]) {
            feeList[center.fee_type] =
              center.vaccineCount + feeList[center.fee_type];
          } else {
            feeList[center.fee_type] = center.vaccineCount;
          }
        }

        // Age list
        center.ageList &&
          Object.keys(center.ageList) &&
          Object.keys(center.ageList).map((age) => {
            if (ageList[age]) {
              ageList[age] = center.ageList[age] + ageList[age];
            } else {
              ageList[age] = center.ageList[age];
            }
          });
      }
    });

  const renderDoseList = () => {
    return (
      <span className="total-count__key">
        <span className="total-count__bold total-count__bold--vaccine-dose">
          {firstDoseVaccineCount}
        </span>
        <span className="total-count__vaccine-dose total-count__vaccine-dose--first">
          {` First Dose`}
        </span>

        <span className="total-count__bold total-count__bold--vaccine-dose">
          {secondDoseVaccineCount}
        </span>
        <span className="total-count__vaccine-dose total-count__vaccine-dose--second">
          {` Second Dose`}
        </span>
      </span>
    );
  };

  const renderVaccineList =
    vaccineList &&
    Object.keys(vaccineList) &&
    Object.keys(vaccineList).map((vaccine, vaccineIndex) => {
      return (
        <span key={vaccineIndex} className="total-count__key">
          <span className="total-count__bold">{` ${vaccineList[vaccine]}`}</span>
          {vaccine}
        </span>
      );
    });

  const renderFeeList =
    ageList &&
    Object.keys(feeList) &&
    Object.keys(feeList).map((fee, feeIndex) => {
      return (
        <span key={feeIndex} className="total-count__key">
          <span className="total-count__bold">{` ${feeList[fee]}`}</span>
          {fee
            ? fee === "free"
              ? "Free vaccine"
              : fee === "paid"
              ? "Paid vaccine"
              : `${fee} vaccine`
            : `${fee} vaccine`}
        </span>
      );
    });

  const renderAgeList =
    ageList &&
    Object.keys(ageList) &&
    Object.keys(ageList).map((age, ageIndex) => {
      return (
        <span key={ageIndex} className="total-count__key">
          <span className="total-count__bold">{` ${ageList[age]}`}</span>
          {age
            ? age === "18"
              ? "For 18-44 age"
              : age === "40"
              ? "For 40-44 age"
              : age === "45"
              ? "For 45+ age"
              : age
            : age}
        </span>
      );
    });

  return (
    <div
      className={
        "total-count" +
        (totalCount >= 100 ? " total-count--many" : "") +
        (totalCount >= 30 && totalCount < 100 ? " total-count--enough" : "") +
        (totalCount > 0 && totalCount < 30 ? " total-count--less" : "") +
        (centerLoading || stateLoading || distLoading
          ? " total-count--loading"
          : "")
      }
    >
      {(centerLoading || stateLoading || distLoading) && (
        <div className="total-count__loading"></div>
      )}
      {!(centerLoading || stateLoading || distLoading) && (
        <Fragment>
          <div className="total-count__value">{totalCount}</div>
          <div className="total-count__label title">
            Vaccine slots available in
            <br />
            {activeDist && activeDist.district_name
              ? activeDist.district_name
              : ""}
            {activeState && activeState.state_name
              ? `, ${activeState.state_name}`
              : ""}
          </div>

          <div className="total-count__text">{renderDoseList()}</div>
          <div className="total-count__text">{renderVaccineList}</div>
          <div className="total-count__text">{renderAgeList}</div>
          <div className="total-count__text">{renderFeeList}</div>
        </Fragment>
      )}
    </div>
  );
};
