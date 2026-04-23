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
      dispatch({ type: "SET_FILTERS_BY_TYPE", payload: [filter] });
    } else {
      dispatch({ type: "SET_FILTERS_BY_TIME", payload: [filter] });
    }
  };

  return (
    <FilterButtonStyles onClick={handleFilter} $isSelected={isSelected}>
      {filter}
    </FilterButtonStyles>
  );
};

export default FilterButton;

