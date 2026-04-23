"use client";

import CourseCatalog from "@/components/Coursepage/CourseCatalog";
import { BigSectionHead } from "@/components/SectionHead/BigSectionHead";
import { useAppState } from "@/context/AppContext";
import { MarginStyle } from "@/styles/CoursepageStyles/Coursepage";
import { CenterItemStyle } from "@/styles/HeroStyles/CenterItem";
import { ActualPaddedSectionStyle } from "@/styles/HomepageStyles/Section";

export default function CoursesPage() {
  const { searchQuery } = useAppState();

  return (
    <>
      <CenterItemStyle>
        <BigSectionHead
          bigtext="Check out the courses we offer"
          smalltext="We offer a variety of courses that teach popular and in demand tech skills on the market today. "
        />
      </CenterItemStyle>
      <MarginStyle>
        <ActualPaddedSectionStyle>
          <CenterItemStyle>
            <h3>
              {searchQuery === null ? (
                "Course Catalog"
              ) : (
                <div className="sh">
                  <>Search results for </>
                  <span>&#34;{searchQuery}&#34;</span>
                </div>
              )}
            </h3>
          </CenterItemStyle>
          <CourseCatalog />
        </ActualPaddedSectionStyle>
      </MarginStyle>
    </>
  );
}
