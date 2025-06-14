import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-gray-100 py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Logo and description */}
          <div className="mb-3 md:mb-0">
            <Link to="/" className="text-lg md:text-xl font-bold text-gray-800">
              Hajkmat
            </Link>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600 max-w-xs">
              Din guide till att planera mat för hajk och friluftsliv baserat på allergier.
            </p>
          </div>

          {/* Quick links */}
          <div className="mb-3 md:mb-0">
            <h3 className="text-sm md:text-base text-gray-800 font-semibold mb-1 md:mb-2">
              Länkar
            </h3>
            <ul className="flex flex-row md:flex-col space-x-4 md:space-x-0">
              <li className="mb-0 md:mb-1">
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-600">
                  Hem
                </Link>
              </li>
              {isAuthenticated && (
                <li className="mb-0 md:mb-1">
                  <Link to="/profile" className="text-sm text-gray-600 hover:text-blue-600">
                    Profil
                  </Link>
                </li>
              )}
              {isAuthenticated && (
                <li className="mb-0 md:mb-1">
                  <Link to="/lists" className="text-sm text-gray-600 hover:text-blue-600">
                    Listor
                  </Link>
                </li>
              )}
              <li className="mb-0 md:mb-1">
                <Link to="/about" className="text-sm text-gray-600 hover:text-blue-600">
                  Om Hajkmat
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar with copyright */}
        <div className="border-t border-gray-200 mt-3 md:mt-8 pt-3 md:pt-4 text-center text-gray-600 text-xs md:text-sm">
          <p>© {currentYear} Hajkmat. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
