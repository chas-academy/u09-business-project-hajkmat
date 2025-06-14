const API_URL = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_URL || 'https://u09-business-project-hajkmat.onrender.com'}/api`
  : '/api'; // In development

export default API_URL;
