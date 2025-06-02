import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitles: Record<string, string> = {
      '/': 'Matplaneraren',
      '/profile': 'Profil',
      '/lists': 'Matlistor',
      '/about': 'Om Hajkmat',
      // Add more routes as needed
    };

    const pageTitle = pageTitles[location.pathname] || 'Matplaneraren';
    document.title = `Hajkmat | ${pageTitle} `;
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default TitleUpdater;
