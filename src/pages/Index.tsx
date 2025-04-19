
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BaxusImport from "@/components/BaxusImport";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col">
        <section className="py-12 md:py-20 bg-gradient-to-b from-whisky-amber/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-whisky-brown leading-tight">
                  Meet Bob, <br />
                  <span className="text-whisky-gold">The Whisky Whisperer</span>
                </h1>
                
                <p className="text-lg text-whisky-wood/80">
                  Bob analyzes your whisky collection and recommends the perfect bottles to add to your wishlist. 
                  With deep knowledge of flavor profiles, regions, and distilleries, Bob helps you discover your 
                  next favorite dram.
                </p>
                
                <div className="pt-4">
                  <Link to="/analyze">
                    <Button className="bg-whisky-amber hover:bg-whisky-gold text-white text-lg px-8 py-6">
                      Upload your collection
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <BaxusImport />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-whisky-brown text-center mb-12">
            How Bob Helps You <span className="text-whisky-gold">Discover New Whisky</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-whisky-amber/10 rounded-xl bg-white">
              <div className="w-12 h-12 bg-whisky-amber/10 text-whisky-amber rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-whisky-brown mb-2">
                Collection Analysis
              </h3>
              <p className="text-whisky-wood/70">
                Upload your whisky collection data, and Bob will analyze your preferences in regions, 
                flavor profiles, distilleries, and price ranges.
              </p>
            </div>
            
            <div className="p-6 border border-whisky-amber/10 rounded-xl bg-white">
              <div className="w-12 h-12 bg-whisky-amber/10 text-whisky-amber rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-whisky-brown mb-2">
                Taste Profile
              </h3>
              <p className="text-whisky-wood/70">
                Discover your flavor preferences based on your collection. Bob identifies your favorite 
                notes, from peaty to fruity, spicy to floral.
              </p>
            </div>
            
            <div className="p-6 border border-whisky-amber/10 rounded-xl bg-white">
              <div className="w-12 h-12 bg-whisky-amber/10 text-whisky-amber rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-whisky-brown mb-2">
                Personalized Recommendations
              </h3>
              <p className="text-whisky-wood/70">
                Get curated whisky recommendations tailored to your taste, with detailed explanation 
                why each bottle would be a perfect addition to your collection.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-whisky-brown text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to discover your next favorite whisky?</h2>
            <p className="text-whisky-amber/90 mb-8 max-w-2xl mx-auto">
              Upload your collection and let Bob analyze your taste preferences to recommend 
              your next perfect bottle.
            </p>
            <Link to="/analyze">
              <Button className="bg-whisky-gold hover:bg-whisky-amber text-white text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
