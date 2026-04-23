"use client";

import { useAppDispatch, useAppState } from "@/context/AppContext";
import { FilterButtonStyles } from "@/styles/ButtonStyles/ButtonGroup";
import React, { FunctionComponent } from "react";

export interface IFilterButton {
  filter: string;
  isSelected: boolean;
  filterByType?: boolean;
}

const FilterButton: FunctionComponent<IFilterButton> = ({
  filter,
  isSelected,
  filterByType,
}) => {
  const dispatch = useAppDispatch();
  const { isSearching } = useAppState();

  const handleFilter = () => {
    if (filterByType) {
      dispatch({ type: "setFiltersByType", payload: filter });
      isSearching
        ? dispatch({ type: "setFilterSearchedCoursesByType" })
        : dispatch({ type: "setFilterCoursesByType" });
    } else {
      dispatch({ type: "setFiltersByTime", payload: filter });
      dispatch({ type: "setFilteredByTimeCourses" });
    }
  };

  return (
    <FilterButtonStyles onClick={handleFilter} $isSelected={isSelected}>
      {filter}
    </FilterButtonStyles>
  );
};

export default FilterButton;

