import Hero from "@/components/landing/hero";
import SearchBar from "@/components/landing/search-bar";
import PopularEvents from "@/components/landing/popular-events";
import TrendingTickets from "@/components/landing/trending-tickets";
import HowItWorks from "@/components/landing/how-it-works";
import TrustSection from "@/components/landing/trust-section";
import FeatureCards from "@/components/landing/feature-cards";
import Testimonials from "@/components/landing/testimonials";
import FAQ from "@/components/landing/faq";
import FinalCTA from "@/components/landing/final-cta";

export default function Home() {
  return (
    <div>
      <Hero />
      <SearchBar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section id="popular-events" className="py-16 md:py-20">
          <PopularEvents />
        </section>
        <section id="trending-tickets" className="py-16 md:py-20">
          <TrendingTickets />
        </section>
        <section id="how-it-works" className="py-16 md:py-20">
          <HowItWorks />
        </section>
        <section id="why-trust-us" className="py-16 md:py-20">
          <TrustSection />
        </section>
        <section id="features" className="py-16 md:py-20">
          <FeatureCards />
        </section>
        <section id="testimonials" className="py-16 md:py-20">
          <Testimonials />
        </section>
        <section id="faq" className="py-16 md:py-20">
          <FAQ />
        </section>
      </div>
      <FinalCTA />
    </div>
  );
}