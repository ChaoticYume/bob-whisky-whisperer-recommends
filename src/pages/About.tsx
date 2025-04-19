
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow whisky-bg py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-whisky-amber to-whisky-gold flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-white text-2xl">B</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-whisky-brown">
                    About Bob
                  </h1>
                  <p className="text-whisky-wood/70">The Whisky Whisperer</p>
                </div>
              </div>
              
              <div className="prose max-w-none text-whisky-wood">
                <p className="lead font-medium text-lg">
                  Bob is an AI whisky expert created for the BAXUS ecosystem to help whisky enthusiasts 
                  discover their perfect dram.
                </p>
                
                <h3 className="text-xl font-bold text-whisky-brown mt-6">Expertise</h3>
                <p>
                  With extensive knowledge of the whisky industry, Bob can analyze your collection 
                  and make personalized recommendations based on your taste preferences. Whether you're 
                  a fan of peaty Islay malts, sweet bourbons, or floral Japanese whiskies, Bob can 
                  help you find new bottles to love.
                </p>
                
                <h3 className="text-xl font-bold text-whisky-brown mt-6">How Bob Works</h3>
                <p>
                  Bob analyzes patterns in your whisky collection, identifying your preferred regions, 
                  distilleries, price points, and most importantly—flavor profiles. By recognizing what 
                  you already enjoy, Bob can suggest both similar bottles and complementary expressions 
                  that might expand your palate.
                </p>
                
                <h3 className="text-xl font-bold text-whisky-brown mt-6">The BAXUS Ecosystem</h3>
                <p>
                  Bob is part of the BAXUS ecosystem, a platform for whisky collectors and enthusiasts. 
                  BAXUS allows users to catalog their collections, track valuations, and discover new bottles 
                  to add to their wishlist.
                </p>
                
                <h3 className="text-xl font-bold text-whisky-brown mt-6">Privacy & Data</h3>
                <p>
                  When you upload your collection data to Bob, your information is used solely for 
                  generating personalized recommendations. Bob does not store your data permanently, 
                  and all analysis is done within the current session.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-whisky-brown mb-4">
                Bob's Whisky Wisdom
              </h2>
              
              <div className="space-y-6">
                <div className="p-4 border-l-4 border-whisky-amber bg-whisky-amber/5 italic">
                  <p className="text-whisky-wood">
                    "The best whisky is the one you enjoy drinking, in the way you enjoy drinking it."
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-whisky-amber bg-whisky-amber/5 italic">
                  <p className="text-whisky-wood">
                    "A good whisky collection tells a story—of places, traditions, and personal discovery."
                  </p>
                </div>
                
                <div className="p-4 border-l-4 border-whisky-amber bg-whisky-amber/5 italic">
                  <p className="text-whisky-wood">
                    "The journey through whisky is never complete—there's always another dram to discover."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
