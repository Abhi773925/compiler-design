import React from "react";
import HeroSection from "../components/landingpage/HeroSection";
import FeaturesSection from "../components/landingpage/FeaturesSection";
import DSAProblemsSection from "../components/landingpage/DSAProblemsSection";
import AboutSection from "../components/landingpage/AboutSection";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section id="home">
          <HeroSection />
        </section>
        {/* Additional sections can be added here */}
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="problems">
          <DSAProblemsSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
