export const ContentHeader = (props) => {
  const {
    isSearchEnabled,
    toggleSearchEnabled,
    setSearch,
    activeDist,
    activeState,
    selectionList,
    isGridAlign,
    setGridAlign,
    searchField,
    centerList,
    SelectAll,
    isSelectAll,
    selectAllCenter,
    screen,
    centerError,
    isHeaderFixed,
    isSrolling,
    liveCounter,
  } = props;

  return (
    <div
      className={
        "content__header" +
        (isSrolling ? " content__header--scrolling" : "") +
        (screen && (screen === "xs" || screen === "sm") && isHeaderFixed
          ? " content__header--stick"
          : "")
      }
    >
      <div
        className={
          "content__header-section" +
          (isSearchEnabled ? " content__header-section--search-enabled" : "")
        }
      >
        {/* Search */}
        <div
          className="content__search-icon"
          onClick={() => toggleSearchEnabled(!isSearchEnabled)}
        ></div>
        <input
          type="text"
          className={
            "content__search-field" +
            (!(selectionList && selectionList.length > 0)
              ? " content__search-field--expanded"
              : "")
          }
          ref={searchField}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Find your nearest health center${
            activeDist && activeDist.district_name
              ? ` in ${activeDist.district_name}`
              : ""
          }`}
        ></input>

        {/* Title */}
        <p
          className={
            "content__text text" +
            (isSearchEnabled ? " content__text--hide" : "")
          }
          onClick={() => toggleSearchEnabled(!isSearchEnabled)}
        >
          Health centers in
        </p>

        <h1
          className={
            "content__title title" +
            (isSearchEnabled ? " content__title--hide" : "")
          }
          onClick={() => toggleSearchEnabled(!isSearchEnabled)}
        >
          {activeDist && activeDist.district_name
            ? activeDist.district_name
            : ""}
          {activeState && activeState.state_name
            ? `${activeDist && activeDist.district_name ? ", " : ""} ${
                activeState.state_name
              }`
            : ""}
          <span className="content__title-sep"></span>
          <span
            className={
              "content__live" +
              (liveCounter <= 5 ? " content__live--updating" : "")
            }
          >
            <span className="content__live-text">Live</span>

            <span className="content__updating-text">
              Updating in {liveCounter > 5 ? "1" : liveCounter}
            </span>
          </span>
        </h1>

        {/* Selection count */}
        {selectionList && selectionList.length > 0 && !centerError && (
          <p className="content__selection-label title">
            <span className="content__selection-count">
              {selectionList.length ? selectionList.length : 0}
            </span>
            {screen === "xs" || screen === "md"
              ? " Selected"
              : ` Health center${selectionList.length > 0 ? "s" : ""} selected`}
          </p>
        )}

        {/* Grid */}
        {selectionList && selectionList.length > 0 && !centerError && (
          <div
            className={
              "content__grid" + (isGridAlign ? " content__grid--align" : "")
            }
            onClick={() => setGridAlign(!isGridAlign)}
          ></div>
        )}

        {/* Select all  */}
        {centerList && centerList.length > 0 && (
          <SelectAll
            isSelectAll={isSelectAll}
            selectAllCenter={selectAllCenter}
          />
        )}
      </div>
    </div>
  );
};
