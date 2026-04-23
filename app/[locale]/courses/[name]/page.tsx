"use client";

import { ArrowRight } from "@/components/Icons/Icons";
import { DetailNavStyles } from "@/styles/CoursepageStyles/CourseDetail";
import { CourseDetailSectionStyle } from "@/styles/HomepageStyles/Section";
import Link from "next/link";
import { CourseDetailComp } from "@/CourseDetailPage/CourseDetail";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  const params = useParams();
  const courseName = params.name as string;

  return (
    <>
      <CourseDetailSectionStyle>
        <DetailNavStyles>
          <Link href="/courses">
            <p>Courses</p>
          </Link>
          <ArrowRight />
          <strong>{courseName}</strong>
        </DetailNavStyles>
        <CourseDetailComp />
      </CourseDetailSectionStyle>
    </>
  );
}
