import Header from "@/components/sections/header";
import SidebarRight from "@/components/sections/sidebar-right";
import HeroCarousel from "@/components/sections/hero-carousel";
import OfficialReviews from "@/components/sections/official-reviews";
import NewsGrid from "@/components/sections/news-grid";
import CommunityPreview from "@/components/sections/community-preview";
import DealsSection from "@/components/sections/deals-section";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content - Takes most space */}
          <div className="flex-1 min-w-0 space-y-8">
            <HeroCarousel />
            <OfficialReviews />
            <NewsGrid />
            <CommunityPreview />
            <DealsSection />
          </div>

          {/* Right Sidebar - Visible on larger screens */}
          <SidebarRight />
        </div>
      </main>

      <Footer />
    </div>
  );
}
