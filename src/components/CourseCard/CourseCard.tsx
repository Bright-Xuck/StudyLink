"use client";

import {
  CourseCardStyles,
  EmojiButtonStyles,
} from "@/styles/CourseStyles/CourseCard";
import { DesktopMobile, TabOnly } from "@/styles/HeroStyles/Hero";
import React, {
  Dispatch,
  FunctionComponent,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  BriefCase,
  EnrolledIcon,
  FilledHeart,
  OutlineHeart,
  RatingIcon,
} from "../Icons/Icons";
import { useAppDispatch } from "@/context/AppContext";
import { motion } from "framer-motion";
import { msgVariants } from "@/Animations/LandingPageVariants";
import { useOutsideClick } from "./OutsideClick";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ICourse {
  id: number | null;
  name: string;
  level: string;
  img: string;
  dollarPrice: number;
  duration: number;
  nairaPrice: number | null;
  category: string;
  isLoved: boolean;
  rating: number;
  noEnrolled: number;
  field: string;
  desc: string;
  skills: string[];
  syllabus: IModule[];
  requirements: string[];
  tutors: ITutor[];
  reviews: IReview[];
  totalReviews: number;
  introVideo: string;
}

export interface IModule {
  title: string;
  number: number | null;
  topics: string[];
}

export interface ITutor {
  img: string;
  name: string;
  job: string;
  email: string;
}

export interface IReview {
  img: string;
  post: string;
  name: string;
  review: string;
  likes: number;
  daysAgo: number;
  comments: number;
}

export const CourseCard: FunctionComponent<ICourse> = ({
  name,
  id,
  level,
  img,
  dollarPrice,
  nairaPrice,
  category,
  isLoved,
  rating,
  noEnrolled,
  field,
}) => {
  const [isheartHovered, setIsheartHovered] = useState(false);
  const router = useRouter();

  const showDetail = () => {
    const path = "/courses/" + encodeURIComponent(name);
    router.push(path);
  };

  return (
    <DesktopMobile>
      <CourseCardStyles>
        <TabOnly>
          <Image
            alt={name}
            src={img}
            width={340}
            height={226}
            className="desktop img"
            onClick={showDetail}
          />
          <Image
            alt={name}
            src={img}
            width={230}
            height={140}
            className="tab img"
            onClick={showDetail}
          />
          <Image
            alt={name}
            src={img}
            width={164}
            height={105}
            className="mobile img"
            onClick={showDetail}
          />
        </TabOnly>
        <div className="content">
          <h4 onClick={showDetail}>{name}</h4>
          <div className="icons">
            <div className="i">
              <BriefCase />
              <span>{level}</span>
            </div>
            <div className="icons-inner">
              <div className="i">
                <EnrolledIcon />
                <span>{noEnrolled}</span>
              </div>
              <div className="i">
                <RatingIcon />
                <span>{rating}</span>
              </div>
            </div>
            <motion.div
              className="msg"
              variants={msgVariants}
              initial="initial"
              animate={isheartHovered ? "final" : "exit"}
            >
              <span>{isLoved ? "Added to Wishlist" : "Add to Wishlist"}</span>
            </motion.div>
          </div>
          <hr />
          <div className="content-inner">
            <div className="prices">
              <h4>&#8358;{nairaPrice?.toLocaleString()}</h4>
              <span>${dollarPrice}</span>
            </div>
            <FavEmojiButton
              isLoved={isLoved}
              name={name}
              isheartHovered={isheartHovered}
              setIsheartHovered={setIsheartHovered}
            />
          </div>
        </div>
      </CourseCardStyles>
    </DesktopMobile>
  );
};

export interface IFavBtn {
  isLoved: boolean;
  name: string;
  isheartHovered: boolean;
  setIsheartHovered: Dispatch<SetStateAction<boolean>>;
}

export const FavEmojiButton: FunctionComponent<IFavBtn> = ({
  isLoved,
  name,
  isheartHovered,
  setIsheartHovered,
}) => {
  const dispatch = useAppDispatch();

  const toggleFavorite = () => {
    dispatch({ type: "toggleLoved", payload: name });
    dispatch({ type: "SET_FILTERS_BY_TYPE" });
    dispatch({ type: "SET_FILTER_COURSES_BY_SEARCH" });
    dispatch({ type: "SET_FILTER_SEARCHED_COURSES_BY_TYPE" });
  };

  const handleOnHover = (e: MouseEvent<HTMLButtonElement>) => {
    setIsheartHovered(true);
  };

  const handleNotOnHover = (e: MouseEvent<HTMLButtonElement>) => {
    setIsheartHovered(false);
  };

  const ref = useOutsideClick(() => {
    setIsheartHovered(false);
  });

  return (
    <EmojiButtonStyles
      onClick={toggleFavorite}
      onMouseOver={handleOnHover}
      onMouseLeave={handleNotOnHover}
      ref={ref}
    >
      {isLoved ? <FilledHeart /> : <OutlineHeart />}
    </EmojiButtonStyles>
  );
};

