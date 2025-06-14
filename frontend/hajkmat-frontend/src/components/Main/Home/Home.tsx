import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';

const Home = () => {
  useDocumentTitle('Matplaneraren');
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Välkommen till Hajkmat</h1>

        <div className="mb-8 text-gray-700">
          <p className="mb-4">
            Planera dina vandringar och äventyr med smarta matplaneringsverktyg. Hajkmat hjälper dig
            att enkelt planera mat för dina utflykter i naturen.
          </p>
          <p>Skapa konton, spara dina favoritrecept.</p>
        </div>

        {isAuthenticated ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              Välkommen tillbaka, {user?.displayName || 'vandrare'}!
            </h2>
            <p className="mb-4">Redo att planera ditt nästa äventyr?</p>
            <Link
              to="/profile"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Gå till din profil
            </Link>
          </div>
        ) : (
          <div className="mb-8">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Logga in för att komma igång
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
