import Header from "@/components/sections/header";
import SidebarLeft from "@/components/sections/sidebar-left";
import SidebarRight from "@/components/sections/sidebar-right";
import HeroCarousel from "@/components/sections/hero-carousel";
import OfficialReviews from "@/components/sections/official-reviews";
import NewsGrid from "@/components/sections/news-grid";
import CommunityPreview from "@/components/sections/community-preview";
import DealsSection from "@/components/sections/deals-section";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC]">
      <Header />
      
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 py-6">
        <div className="flex gap-6 justify-center">
          {/* Left Sidebar */}
          <SidebarLeft />
          
          {/* Center Column */}
          <div className="flex-1 min-w-0 max-w-[752px] w-full">
            <HeroCarousel />
            <OfficialReviews />
            <NewsGrid />
            <CommunityPreview />
            <DealsSection />
          </div>
          
          {/* Right Sidebar */}
          <SidebarRight />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
