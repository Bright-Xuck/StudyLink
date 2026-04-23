import Hero from '@/components/Hero/Hero'
import {Chooseus} from '@/components/HomepageComp/Chooseus'
import Cta from '@/components/HomepageComp/Cta'
import {Faq} from '@/components/HomepageComp/Faq'
import Newsletter from '@/components/HomepageComp/Newsletter'
import PopularCourses from '@/components/HomepageComp/PopularCourses'
import Stats from '@/components/HomepageComp/Stats'
import { Testimonials } from '@/components/HomepageComp/Testimonials'
import Welcome from '@/components/HomepageComp/Welcome'

export const metadata = {
  title: 'StudyLink - Learn Anywhere',
  description: 'StudyLink: Your gateway to quality education and skill development',
};

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <PopularCourses />
      <Welcome />
      <Chooseus />
      <Testimonials />
      <Faq />
      <Cta />
      <Newsletter />
    </>
  )
}
