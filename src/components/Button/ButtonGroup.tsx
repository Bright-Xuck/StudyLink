"use client";

import {
  ButtonGroupStyles,
  CancelSearchBtnStyles,
} from "@/styles/ButtonStyles/ButtonGroup";
import React, { FunctionComponent } from "react";
import FilterButton, { IFilterButton } from "./FilterButton";
import { Error } from "../Icons/Icons";
import { useAppDispatch, useAppState } from "@/context/AppContext";
import { usePathname } from "next/navigation";

export interface IButtonGroup {
  filters: IFilterButton[];
}

const ButtonGroup: FunctionComponent<IButtonGroup> = ({ filters }) => {
  const pathname = usePathname();
  const { isSearching } = useAppState();
  const dispatch = useAppDispatch();

  const cancelSearch = () => {
    dispatch({ type: "resetSearchQuery" });
  };

  const isCoursesPage = pathname?.includes("/courses");

  return (
    <ButtonGroupStyles>
      {isCoursesPage && isSearching && (
        <CancelSearchBtnStyles onClick={cancelSearch}>
          <p>Cancel</p>
          <Error />
        </CancelSearchBtnStyles>
      )}
      {filters.map((ele, index) => (
        <FilterButton
          key={index}
          filter={ele.filter}
          isSelected={ele.isSelected}
          filterByType={ele.filterByType}
        />
      ))}
    </ButtonGroupStyles>
  );
};

export default ButtonGroup;

