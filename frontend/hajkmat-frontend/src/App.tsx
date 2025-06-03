import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import TitleUpdater from './components/TitleUpdater';
import Checkbox from './components/formcomponents/Checkbox';
import './App.css';

function App() {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Router>
      <TitleUpdater />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {/* Your page content goes here */}
          <form>
            <Checkbox
              id="terms"
              label="Jag godkänner villkoren"
              checked={isChecked}
              onChange={setIsChecked}
            />
          </form>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
