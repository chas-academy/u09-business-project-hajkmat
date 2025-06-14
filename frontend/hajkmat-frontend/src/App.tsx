import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import TitleUpdater from './components/TitleUpdater';
import Home from './components/Main/Home/Home';
import Login from './components/auth/Login';
import ProfilePage from './components/Main/ProfilePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
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
              <Route path="/" element={<Home />} /> {/* Home is now accessible to everyone */}
              <Route path="/login" element={<Login />} /> {/* New login route */}
              <Route path="/auth-callback" element={<AuthCallback />} />
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
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
