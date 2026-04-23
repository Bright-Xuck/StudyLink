"use client";

import { HeaderStyle } from "@/styles/HeaderStyles/Header";
import Image from "next/image";
import Link from "next/link";
import { Heart, Logo, MagnifyingGlass, Menu, Notification } from "../Icons/Icons";
import Search from "./Search";
import React, { FunctionComponent, useEffect } from "react";
import { PageLinkStyle } from "@/styles/LinkStyles/Link";
import { useAppState, useAppDispatch } from "@/context/AppContext";
import { usePathname } from "next/navigation";

const Header: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { isNavOpen } = useAppState();
  const pathname = usePathname();

  const toggleMenu = () => {
    dispatch({ type: "TOGGLE_NAV" });
  };

  useEffect(() => {
    // Close mobile menu on route change
    dispatch({ type: "CLOSE_NAV" });
  }, [pathname, dispatch]);

  const isCoursesActive = pathname?.includes("/courses") ?? false;
  const isAboutActive = pathname?.includes("/about") ?? false;
  const isContactActive = pathname?.includes("/contact") ?? false;

  return (
    <HeaderStyle>
      <div className="logo">
        <Link href={"/"}>
          <Logo />
        </Link>
      </div>
      <div className="desktop desktop-nav-links">
        <Link href={"/courses"}>
          <PageLinkStyle
            color="var(--grey-500, #525252)"
            $ispageactive={isCoursesActive}
          >
            Courses
          </PageLinkStyle>
        </Link>
        <Link href={"/about"}>
          <PageLinkStyle
            color="var(--grey-500, #525252)"
            $ispageactive={isAboutActive}
          >
            About Us
          </PageLinkStyle>
        </Link>
        <Link href={"/contact"}>
          <PageLinkStyle
            color="var(--grey-500, #525252)"
            $ispageactive={isContactActive}
          >
            Contact Us
          </PageLinkStyle>
        </Link>
      </div>
      <div className="desktop">
        <Search />
      </div>
      <div className="desktop icons-group">
        <div className="icons">
          <Heart />
          <Notification />
        </div>
        <Image
          src={"/assets/nav_avatar.png"}
          alt={"nav avatar"}
          width={40}
          height={40}
        />
      </div>

      <div className="mobile mobile-nav-links">
        <MagnifyingGlass />
        <Menu toggleMenu={toggleMenu} />
      </div>
    </HeaderStyle>
  );
};

export default Header;

