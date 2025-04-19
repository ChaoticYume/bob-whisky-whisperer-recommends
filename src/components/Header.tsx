
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-whisky-amber/20 bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-whisky-amber to-whisky-gold flex items-center justify-center">
            <span className="font-bold text-white text-xl">B</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-whisky-brown">
              Bob<span className="text-whisky-gold">.</span>
            </h1>
            <p className="text-xs text-whisky-wood/70">The Whisky Whisperer</p>
          </div>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="text-whisky-wood hover:text-whisky-gold transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/analyze" className="text-whisky-wood hover:text-whisky-gold transition-colors">
                Analyze Collection
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-whisky-wood hover:text-whisky-gold transition-colors">
                About Bob
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
