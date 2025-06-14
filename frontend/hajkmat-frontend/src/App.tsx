import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import TitleUpdater from './components/TitleUpdater';
import Dashboard from './components/Main/Home/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RootRoute } from './components/RootRoute';
import { AuthProvider } from './hooks/useAuth';
import AuthCallback from './components/auth/AuthCallback';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <TitleUpdater />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {/* Your page content goes here */}
            <Routes>
              {/* Root route conditionally renders Home or redirects to Dashboard */}
              <Route path="/" element={<RootRoute />} />
              <Route path="/auth-callback" element={<AuthCallback />} />
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Add more protected routes here */}
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>{' '}
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
