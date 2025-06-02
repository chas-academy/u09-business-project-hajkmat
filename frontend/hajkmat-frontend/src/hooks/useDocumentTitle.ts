import { useEffect } from 'react';

/**
 * A custom hook that updates the document title
 * @param title - The page-specific title
 * @param siteName - The site name to append (defaults to "Hajkmat")
 */
export function useDocumentTitle(title: string, siteName = 'Hajkmat') {
  useEffect(() => {
    // Save the original title to restore when component unmounts
    const originalTitle = document.title;

    // Update the title with the new value
    document.title = title ? `${title} | ${siteName}` : `${siteName} - Matplaneraren`;

    // Cleanup function to reset the title when component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, [title, siteName]);
}
