import { CenterCard } from "./CenterCard";

export const CenterListing = (props) => {
  const {
    centerList,
    selectionList,
    selectCenter,
    onScroll,
    search,
    isHeaderFixed,
  } = props;

  let centers = centerList.filter((center) =>
    Object.keys(center).some((key) => {
      return key === "name" ||
        key === "address" ||
        key === "block_name" ||
        key === "district_name" ||
        key === "state_name"
        ? center[key].toLowerCase().includes(search.toLowerCase())
        : false;
    })
  );

  return (
    <div
      className={
        "center-card__listing" +
        (isHeaderFixed ? " center-card__listing--top" : "")
      }
      onScroll={onScroll}
    >
      {centers &&
        centers.map((center, centerIndex) => {
          return (
            <CenterCard
              key={centerIndex}
              center={center}
              selectionList={selectionList}
              selectCenter={selectCenter}
            />
          );
        })}

      {/* <div className="thanks">
        <Logo />
        We stand with everyone fighting on the frontlines
      </div> */}
    </div>
  );
};
