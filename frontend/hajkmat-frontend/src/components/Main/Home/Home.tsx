import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

const Home = () => {
  useDocumentTitle('Matplaneraren');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Välkommen till Hajkmat</h1>
      {/* Rest of your home page content */}
    </div>
  );
};

export default Home;
