import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // This would typically come from a context or auth service
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // For demonstration purposes only
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center py-4 relative">
        <div className="logo">
          <Link to="/">
            <span className="text-xl font-bold text-gray-800">Hajkmat</span>
          </Link>
        </div>

        {/* Demo button to toggle login state - remove in production */}
        <button onClick={toggleLogin} style={{ marginLeft: '10px' }}>
          {isLoggedIn ? 'Logga ut' : 'Logga in'}
        </button>

        <button
          className="md:hidden block p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-5">
            <span
              className={`absolute h-0.5 w-6 bg-gray-800 transform transition duration-300 ease-in-out ${
                isMenuOpen ? 'rotate-45 translate-y-2.5' : 'translate-y-0'
              }`}
            ></span>
            <span
              className={`absolute h-0.5 bg-gray-800 transform transition-opacity duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-0 w-0' : 'opacity-100 w-6'
              }`}
              style={{ top: '10px' }}
            ></span>
            <span
              className={`absolute h-0.5 w-6 bg-gray-800 transform transition duration-300 ease-in-out ${
                isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-5'
              }`}
            ></span>
          </div>
        </button>

        <nav
          className={`md:block ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-full left-0 right-0 bg-white md:bg-transparent shadow-lg md:shadow-none`}
        >
          <ul className="text-center md:text-left md:flex flex-col md:flex-row py-4 md:py-0">
            <li className="px-6 py-2 md:py-0">
              <Link to="/" className="text-gray-800 hover:text-blue-600">
                Hem
              </Link>
            </li>
            {isLoggedIn && (
              <li className="px-6 py-2 md:py-0">
                <Link to="/profile" className="text-gray-800 hover:text-blue-600">
                  Profil
                </Link>
              </li>
            )}
            {isLoggedIn && (
              <li className="px-6 py-2 md:py-0">
                <Link to="/lists" className="text-gray-800 hover:text-blue-600">
                  Listor
                </Link>
              </li>
            )}
            <li className="px-6 py-2 md:py-0">
              <Link to="/about" className="text-gray-800 hover:text-blue-600">
                Om Hajkmat
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
