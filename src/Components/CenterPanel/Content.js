import React, { useState, useRef, useEffect } from "react";

import { CenterListing } from "./CenterListing";
import { SelectAll } from "./SelectAll";
import { Message } from "./Message";
import { sortBySelectionCount } from "./../Logic/Sort";

import { ContentHeader } from "./ContentHeader";

export const Content = (props) => {
  const [isSearchEnabled, setSearchEnabled] = useState(false);
  const [search, setSearch] = useState("");

  const searchField = useRef(null);
  let { centerList } = props;
  const {
    centerLoading,
    centerError,
    selectionList,
    isSelectAll,
    selectAllCenter,
    selectCenter,
    activeState,
    activeDist,
    screen,
    liveCounter,
  } = props;

  const [isGridAlign, setGridAlign] = useState(false);
  const [isHeaderFixed, setHeaderFixed] = useState(false);
  const [isSrolling, setIsScrolling] = useState(false);

  const toggleSearchEnabled = (isSearchEnabled) => {
    if (searchField.current) {
      setSearchEnabled(isSearchEnabled);

      setTimeout(() => {
        searchField.current.focus();
      }, 250);

      if (!isSearchEnabled) {
        setSearch("");
        searchField.current.value = "";
      }
    }
  };

  useEffect(() => {
    const keydown = (e, isSearchEnabled) => {
      if (e.code === "Escape" && isSearchEnabled) {
        toggleSearchEnabled(false);
      }
    };

    document.addEventListener(
      "keydown",
      (e) => keydown(e, isSearchEnabled),
      false
    );

    return () => {
      document.removeEventListener("keydown", keydown, false);
    };
  }, [isSearchEnabled]);

  if (centerList && isGridAlign) {
    centerList = sortBySelectionCount(centerList, selectionList);
  }

  const handleScroll = (e) => {
    let elem = document.querySelector(".landing__center");
    if (elem) {
      let box = elem.getBoundingClientRect();
      if (box) {
        setHeaderFixed(box.top > 0 ? false : true);
      }
    }

    let scrollTop = e.target.scrollTop;
    setIsScrolling(scrollTop > 0 ? true : false);
  };

  useEffect(() => {
    let elem;

    if (screen && (screen === "xs" || screen === "sm")) {
      elem = document.querySelector("#root");
    } else {
      elem = document.querySelector(".center-card__listing");
    }

    elem && elem.addEventListener("scroll", handleScroll);

    return () => {
      elem && elem.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div className="content">
      <ContentHeader
        isSearchEnabled={isSearchEnabled}
        activeDist={activeDist}
        activeState={activeState}
        selectionList={selectionList}
        isGridAlign={isGridAlign}
        searchField={searchField}
        centerList={centerList}
        isSelectAll={isSelectAll}
        selectAllCenter={selectAllCenter}
        screen={screen}
        liveCounter={liveCounter}
        centerError={centerError}
        toggleSearchEnabled={toggleSearchEnabled}
        setSearch={setSearch}
        setGridAlign={setGridAlign}
        SelectAll={SelectAll}
        isHeaderFixed={isHeaderFixed}
        isSrolling={isSrolling}
      />

      {centerList &&
        centerList.length > 0 &&
        !centerLoading &&
        !centerError && (
          <CenterListing
            search={search}
            centerList={centerList}
            selectionList={selectionList}
            isSelectAll={isSelectAll}
            selectCenter={selectCenter}
            isHeaderFixed={isHeaderFixed}
          />
        )}

      {centerList &&
        centerList.length === 0 &&
        !centerLoading &&
        !centerError && (
          <Message
            type={"warning"}
            title={
              "Hey! Looks like we there is no health centers available near you"
            }
            text={"We will keep you posted if any new centers are added"}
          />
        )}

      {!centerList && !centerLoading && centerError && (
        <Message
          type={"error"}
          title={
            "Hey! We are facing some difficultly in getting centers near you"
          }
          text={"Try reloading the page, it can be a cowin server problem!"}
        />
      )}
    </div>
  );
};
