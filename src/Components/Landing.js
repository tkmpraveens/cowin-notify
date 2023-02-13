import React, { Component } from "react";
import update from "react-addons-update";

import { Logo } from "./Sidebar/Logo";
import { Filter } from "./LeftPanel/Filter";
import { Content } from "./CenterPanel/Content";
import { Notifier } from "./LeftPanel/Notifier";
import { TotalCount } from "./LeftPanel/TotalCount";
import { Menu } from "./LeftPanel/Menu";

import { getLocalStorage, setLocalStorage } from "./Logic/LocalStorage";
import { sortByVaccineCount } from "./Logic/Sort";
import { findIndex } from "./Logic/FindIndex";
import { getStateList, getDistList } from "./Logic/GetFilterList";
import { periodicCheck } from "./Logic/CenterList";
import { getIPLocation } from "./Logic/GetIPLocation";

export class Landing extends Component {
  state = {
    slotCount: 0,
    error: false,
    loading: true,

    centerList: undefined,
    centerLoading: false,
    centerError: false,
    isUpdatingCenterList: false,

    selectionList: [],
    isSelectAll: false,
    selectionCount: 0,

    stateList: undefined,
    activeState: undefined,
    stateLoading: false,
    stateError: false,

    distList: undefined,
    activeDist: undefined,
    distLoading: false,
    distError: false,
    isInit: true,

    isPlay: false,
    ripplePlay: false,

    isMenuVisible: true,

    duration: 14,
  };

  componentDidMount() {
    getStateList(this.setStateList);
    window.addEventListener("resize", this.setScreenSize.bind(this));
    this.setScreenSize();

    this.timer = undefined;
  }

  setScreenSize() {
    let xsWidth = 575.98;
    let smWidth = 767.98;
    let mdWidth = 991.98;
    let lgWidth = 1199.98;
    let screen = "xl";

    if (window && window.innerWidth) {
      if (window.innerWidth <= xsWidth) {
        screen = "xs";
      } else if (window.innerWidth > xsWidth && window.innerWidth <= smWidth) {
        screen = "sm";
      } else if (window.innerWidth > smWidth && window.innerWidth <= mdWidth) {
        screen = "md";
      } else if (window.innerWidth > mdWidth && window.innerWidth <= lgWidth) {
        screen = "lg";
      }
    }
    this.setState({
      screen,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setScreenSize.bind(this));
  }

  // State logic
  setStateList = (stateList, stateLoading, stateError) => {
    this.setState(
      {
        stateList,
        stateLoading,
        stateError,
      },
      () => {
        stateList && this.initActiveState(stateList);
      }
    );
  };

  initActiveState = (stateList) => {
    let activeState = getLocalStorage("state");
    if (activeState) {
      this.setActiveState(activeState);
    } else {
      getIPLocation(stateList, this.setActiveState, "state");
    }
  };

  setActiveState = (state) => {
    this.setState(
      {
        activeState: state,
        isUpdatingCenterList: false,
      },
      () => {
        getDistList(this.setDistList, state);
        setLocalStorage("state", state);
      }
    );
  };

  // District logic
  setDistList = (distList, distLoading, distError) => {
    this.setState(
      {
        distList,
        distLoading,
        distError,
      },
      () => {
        distList && this.initActiveDist(distList);
      }
    );
  };

  initActiveDist = (distList) => {
    let activeDist = getLocalStorage("dist");

    if (activeDist && this.state.isInit) {
      this.setActiveDist(activeDist);
    } else if (this.state.isInit) {
      getIPLocation(distList, this.setActiveDist, "dist");
    } else {
      this.setActiveDist(distList[0]);
    }
  };

  setActiveDist = (dist) => {
    if (this.state.isInit) {
      this.initSelectionList();
    } else {
      this.selectAllCenter(false);
    }

    this.setState(
      {
        activeDist: dist,
        isUpdatingCenterList: false,
        isInit: false,
      },
      () => {
        this.setCenterList(undefined, true, false);
        periodicCheck(
          this.parseCenterList,
          dist,
          this.setLiveCounter,
          this.state.duration
        );

        setLocalStorage("dist", dist);
      }
    );
  };

  // Center logic
  setCenterList = (centerList, centerLoading, centerError) => {
    if (!this.state.isUpdatingCenterList) {
      this.setState({
        centerList,
        centerLoading,
        centerError,
        isUpdatingCenterList: true,
      });
    } else {
      if (
        !this.state.centerList ||
        (this.state.centerList && this.state.centerList.length === 0)
      ) {
        this.setState(
          {
            centerList,
            centerLoading,
            centerError,
          },
          () => {
            this.checkNotification(centerList);
          }
        );
      } else if (this.state.centerList && this.state.centerList.length > 0) {
        // Merge change or Add new center
        this.mergeCenterList(this.state.centerList, centerList);

        // Delete missing center
        this.deleteCenterList(this.state.centerList, centerList);

        if (centerList) {
          this.checkNotification(centerList);
        }
      }
    }
  };

  mergeCenterList = (prevCenterList, centerList) => {
    centerList &&
      centerList.map((center) => {
        if (center && center.center_id) {
          let index = findIndex(prevCenterList, "center_id", center.center_id);

          index !== -1 &&
            this.setState((prevState) => ({
              centerList: update(prevState.centerList, {
                [index]: { $set: center },
              }),
            }));

          index === -1 &&
            this.setState((prevState) => ({
              centerList: update(prevState.centerList, {
                $push: [center],
              }),
            }));
        }
      });
  };

  deleteCenterList = (prevCenterList, centerList) => {
    prevCenterList.map((center) => {
      if (center && center.center_id) {
        let index = findIndex(centerList, "center_id", center.center_id);

        index === -1 &&
          this.setState((prevState) => ({
            centerList: update(prevState.centerList, {
              $splice: [[index, 1]],
            }),
          }));
      }
    });
  };

  parseCenterList = (centerList, centerLoading, centerError) => {
    centerList &&
      centerList.map((center, centerIndex) => {
        let vaccineCount = 0,
          firstDoseVaccineCount = 0,
          secondDoseVaccineCount = 0,
          vaccineList = {},
          ageList = {};

        center.sessions &&
          center.sessions.map((session) => {
            if (session) {
              const {
                available_capacity,
                available_capacity_dose1,
                available_capacity_dose2,
                vaccine,
                min_age_limit,
              } = session;

              // total vaccine count
              vaccineCount = vaccineCount + available_capacity;

              firstDoseVaccineCount =
                firstDoseVaccineCount + available_capacity_dose1;

              secondDoseVaccineCount =
                secondDoseVaccineCount + available_capacity_dose2;

              if (available_capacity) {
                // Vaccine list
                if (vaccineList[vaccine]) {
                  vaccineList[vaccine] =
                    vaccineList[vaccine] + available_capacity;
                } else {
                  vaccineList[vaccine] = available_capacity;
                }

                // Age list
                if (ageList[min_age_limit]) {
                  ageList[min_age_limit] =
                    ageList[min_age_limit] + available_capacity;
                } else {
                  ageList[min_age_limit] = available_capacity;
                }
              }
            }
          });

        center.vaccineCount = vaccineCount;
        center.firstDoseVaccineCount = firstDoseVaccineCount;
        center.secondDoseVaccineCount = secondDoseVaccineCount;

        center.vaccineList = vaccineList;
        center.ageList = ageList;
        center.order = centerIndex;
      });

    if (centerList) {
      centerList = sortByVaccineCount(centerList);
    }

    this.setCenterList(centerList, centerLoading, centerError);
  };

  // Selection
  initSelectionList = () => {
    let selectionList = getLocalStorage("selectionList");
    let isSelectAll = getLocalStorage("isSelectAll");
    selectionList &&
      this.setState({
        selectionList,
        isSelectAll,
      });
  };

  getSelectionCount = () => {
    if (this.state.selectionList && this.state.selectionList.length > 0) {
      let selectionCount = this.state.selectionList.reduce(
        (max, center) =>
          center.selectionCount > max ? center.selectionCount : max,
        this.state.selectionList[0].selectionCount
      );
      return selectionCount;
    } else return 0;
  };

  // Select a specific health center
  selectCenter = (centerId) => {
    let selectionCount = this.getSelectionCount(this.state.selectionCount);
    const { selectionList } = this.state;

    let selectionIndex = findIndex(selectionList, "centerId", centerId);

    if (selectionIndex === -1) {
      let selection = {
        centerId: centerId,
        selectionCount: selectionCount + 1,
      };
      this.setState(
        {
          selectionList: update(selectionList, { $push: [selection] }),
          selectionCount: selectionCount + 1,
        },
        () => {
          setLocalStorage("selectionList", this.state.selectionList);
        }
      );
    } else {
      this.setState(
        {
          selectionList: update(selectionList, {
            $splice: [[selectionIndex, 1]],
          }),
          isSelectAll: false,
        },
        () => {
          setLocalStorage("isSelectAll", this.state.isSelectAll);
          setLocalStorage("selectionList", this.state.selectionList);
        }
      );
    }
  };

  // Select all health centers
  selectAllCenter = (isSelectAll) => {
    if (isSelectAll) {
      let selectionCount = this.getSelectionCount(this.state.selectionCount);

      let { centerList, selectionList } = this.state;
      centerList.map((center) => {
        if (center && center.center_id) {
          let centerIndex = findIndex(
            selectionList,
            "centerId",
            center.center_id
          );

          if (centerIndex === -1) {
            let selection = {
              centerId: center.center_id,
              selectionCount: ++selectionCount,
            };

            selectionList = update(selectionList, {
              $push: [selection],
            });
          }
        }
      });

      this.setState(
        {
          isSelectAll,
          selectionList,
          selectionCount: selectionCount,
        },
        () => {
          setLocalStorage("selectionList", this.state.selectionList);
          setLocalStorage("isSelectAll", this.state.isSelectAll);
        }
      );
    } else {
      this.setState(
        {
          isSelectAll,
          selectionCount: 0,
          selectionList: [],
        },
        () => {
          setLocalStorage("selectionList", this.state.selectionList);
          setLocalStorage("isSelectAll", this.state.isSelectAll);
        }
      );
    }
  };

  checkNotification = (centerList) => {
    if (
      this.state.isPlay &&
      this.state.selectionList &&
      this.state.selectionList.length > 0
    ) {
      let isNotify = this.calculateNotification(
        centerList,
        this.state.selectionList
      );

      if (isNotify && isNotify.length > 0) {
        isNotify = isNotify.some(function (e) {
          return e;
        });

        if (isNotify) {
          this.play();
        }
      }
    }
  };

  calculateNotification = (centerList, selectionList) => {
    return selectionList.map((center) => {
      if (center && center.centerId) {
        let index = findIndex(centerList, "center_id", center.centerId);
        if (centerList[index] && centerList[index].vaccineCount > 0) {
          return true;
        }
      }
    });
  };

  togglePlay = () => {
    this.setState({ isPlay: !this.state.isPlay }, () => {
      if (this.state.isPlay) {
        this.play();

        this.setState(
          {
            testingPlay: true,
          },
          () => {
            setTimeout(() => {
              this.setState({
                testingPlay: false,
              });
            }, 3000);
          }
        );
      }
    });
  };

  play = () => {
    if (this.state.isPlay) {
      var player = document.getElementById("player");
      player.play();

      this.setState(
        {
          ripplePlay: true,
        },
        () => {
          setTimeout(() => {
            this.setState({
              ripplePlay: false,
            });
          }, 3000);
        }
      );
    }
  };

  setMenuVisible = (isMenuVisible) => {
    this.setState({
      isMenuVisible,
    });
  };

  setLiveCounter = () => {
    this.setState({ liveCounter: this.state.duration });
    this.timer && clearInterval(this.timer);

    let i = setInterval(() => {
      this.setState({ liveCounter: this.state.liveCounter - 1 });
    }, 1000);
    this.timer = i;
  };

  render() {
    return (
      <div className="landing">
        <div className="landing__sidebar">
          <Logo />
        </div>
        <div
          className={
            "landing__left" +
            (this.state.isMenuVisible ? " landing__left--menu-visible" : "")
          }
        >
          <Notifier
            isPlay={this.state.isPlay}
            ripplePlay={this.state.ripplePlay}
            testingPlay={this.state.testingPlay}
            togglePlay={this.togglePlay}
          />

          <div className="landing__menu">
            {this.state.screen &&
              (this.state.screen === "xs" || this.state.screen === "sm") && (
                <Menu
                  isMenuVisible={this.state.isMenuVisible}
                  setMenuVisible={this.setMenuVisible}
                />
              )}

            <Filter
              label="Select your state"
              type="state"
              activeOption={this.state.activeState}
              optionList={this.state.stateList}
              loading={this.state.stateLoading}
              error={this.state.stateError}
              onChange={this.setActiveState}
            />
            <Filter
              label="Select your district"
              type="dist"
              activeOption={this.state.activeDist}
              optionList={this.state.distList}
              loading={this.state.distLoading}
              error={this.state.distError}
              onChange={this.setActiveDist}
            />

            <TotalCount
              centerList={this.state.centerList}
              stateLoading={this.state.stateLoading}
              distLoading={this.state.distLoading}
              centerLoading={this.state.centerLoading}
              activeState={this.state.activeState}
              activeDist={this.state.activeDist}
            />
          </div>
        </div>
        <div className="landing__center">
          <Content
            centerList={this.state.centerList}
            centerLoading={this.state.centerLoading}
            centerError={this.state.centerError}
            selectionList={this.state.selectionList}
            isSelectAll={this.state.isSelectAll}
            screen={this.state.screen}
            liveCounter={this.state.liveCounter}
            selectAllCenter={this.selectAllCenter}
            selectCenter={this.selectCenter}
            activeState={this.state.activeState}
            activeDist={this.state.activeDist}
          />
        </div>
      </div>
    );
  }
}
