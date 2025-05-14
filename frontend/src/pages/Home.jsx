import React from "react";
import HeroSection from "../components/HeroSection";
import FeatureSection from "../components/FeatureSection";
import LeaderboardPreview from "../components/LeaderboardPreview";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import JoinCommunity from "../components/JoinCommunity";

const Home = () => (
  <div className="flex flex-col items-center min-w-full">
    <Navbar/>

    <section id='hero' className="w-full mt-10 h-screen">
    <HeroSection />
    </section>

    <section id='about' className="w-full h-auto">
    <AboutSection />
    </section>


    
    <section id='features' className="w-full">
    <FeatureSection />
    </section>
    
    
    
    <section>
    <LeaderboardPreview />
    </section>

    <section className="w-full">
    <JoinCommunity/>
    </section>
    
    
    <section id='faqs' className="w-full">
    <FAQSection />
    </section>
    
    <Footer />
  </div>
);

export default Home;
