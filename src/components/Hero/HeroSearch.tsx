"use client";

import { FormButton, HeroSearchStyles } from "@/styles/HeroStyles/HeroSearch";
import { HeroMagnifyingGlass } from "../Icons/Icons";
import { useForm } from "react-hook-form";
import { DesktopMobile, ImprovedDesktopMobile } from "@/styles/HeroStyles/Hero";
import {
  CenterErrorForMinitab,
  ErrorStyles,
} from "@/styles/ContactpageStyles/Contact";
import { useAppDispatch } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export interface ISearchProps {
  query: string;
}

const HeroSearch = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISearchProps>({ mode: "onBlur", defaultValues: { query: "" } });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSearch = (data: ISearchProps) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: data.query });
    router.push("/courses");
    reset();
  };

  return (
    <ImprovedDesktopMobile>
      <form onSubmit={handleSubmit(handleSearch)}>
        <HeroSearchStyles>
          <div className="input">
            <HeroMagnifyingGlass />
            <input
              type="text"
              placeholder="Product design"
              {...register("query", { required: "Query is required" })}
            />
          </div>
          <div className="mobile error">
            <ErrorStyles>{errors?.query && errors.query.message}</ErrorStyles>
          </div>
          <FormButton>Search</FormButton>
        </HeroSearchStyles>
        <div className="desktop error">
          <CenterErrorForMinitab>
            {errors?.query && errors.query.message}
          </CenterErrorForMinitab>
        </div>
      </form>
    </ImprovedDesktopMobile>
  );
};

export default HeroSearch;

