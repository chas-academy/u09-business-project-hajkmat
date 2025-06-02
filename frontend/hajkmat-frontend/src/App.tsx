import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import TitleUpdater from './components/TitleUpdater';
import './App.css';

function App() {
  return (
    <Router>
      <TitleUpdater />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{/* Your page content goes here */}</main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
