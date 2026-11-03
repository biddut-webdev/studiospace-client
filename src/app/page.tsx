
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HeroSection from "@/components/home/HeroSection";
import HostGuarantee from "@/components/home/HostGuarantee";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import StudioCategories from "@/components/home/StudioCategories";

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedStudios />
      <StudioCategories />
      <HowBookingWorks />
      <HostGuarantee />
    </main>
  );
};

export default HomePage;
