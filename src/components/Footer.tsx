
const Footer = () => {
  return (
    <footer className="bg-whisky-brown/90 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-whisky-gold flex items-center justify-center">
              <span className="font-bold text-white text-sm">B</span>
            </div>
            <span className="text-lg font-bold">Bob</span>
          </div>
          
          <div className="text-whisky-amber/70 text-sm">
            &copy; 2025 Bob the Whisky Whisperer - BAXUS Ecosystem
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
