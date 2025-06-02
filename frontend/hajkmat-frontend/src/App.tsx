import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        {/* Your page content goes here */}
      </div>
    </Router>
  );
}

export default App;
