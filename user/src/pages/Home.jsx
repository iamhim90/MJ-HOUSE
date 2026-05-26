import MainLayout from "../layouts/MainLayout";

import Hero from "../sections/Hero/Hero";
import Stats from "../sections/Stats/Stats";
import About from "../sections/About/About";
import Highlights from "../sections/Highlights/Highlights";
import Gallery from "../sections/Gallery/Gallery";
import Testimonials from "../sections/Testimonials/Testimonials";
import Announcements from "../sections/Announcements/Announcements";
import FAQ from "../sections/FAQ/FAQ";
import Booking from "../sections/Booking/Booking";
import Payment from "../sections/Payment/Payment";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <Stats />
      <About />
      <Highlights />
      <Gallery />
      <Testimonials />
      <Announcements />
      <FAQ />
      <Booking />
      <Payment />
    </MainLayout>
  );
}