"use client";

import { ContactComp } from "@/components/Contactpage/Contact";
import { ReachOut } from "@/components/Contactpage/Reachout";
import SocialsComp from "@/components/Socials/Socials";

export default function ContactPage() {
  return (
    <>
      <ContactComp />
      <ReachOut />
      <SocialsComp />
    </>
  );
}
