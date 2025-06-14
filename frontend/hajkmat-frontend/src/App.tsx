import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import TitleUpdater from './components/TitleUpdater';
import Home from './components/Main/Home/Home';
import Dashboard from './components/Main/Home/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <TitleUpdater />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {/* Your page content goes here */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />

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
  );
}

export default App;
