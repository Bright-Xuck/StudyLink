"use client";

import { SearchStyle } from "@/styles/HeaderStyles/Search";
import React, { FunctionComponent } from "react";
import { NavMagnifyingGlass } from "../Icons/Icons";
import { useForm } from "react-hook-form";
import { ISearchProps } from "../Hero/HeroSearch";
import { useAppDispatch } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const Search: FunctionComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISearchProps>({ mode: "onBlur", defaultValues: { query: "" } });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSearch = (data: ISearchProps) => {
    dispatch({ type: "setSearchQuery", payload: data.query });
    router.push("/courses");
  };

  return (
    <form onSubmit={handleSubmit(handleSearch)}>
      <SearchStyle>
        <NavMagnifyingGlass />
        <input
          type="text"
          placeholder="Search for a course"
          {...register("query", { required: "Query is required" })}
        />
      </SearchStyle>
    </form>
  );
};

export default Search;

