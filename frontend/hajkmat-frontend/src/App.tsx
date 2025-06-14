import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import TitleUpdater from './components/TitleUpdater';
import Home from './components/Main/Home/Home';
import TextInput from './components/formcomponents/TextInput';
import Checkbox from './components/formcomponents/Checkbox';
import Button from './components/component/Button';
import Image from './components/component/Image';
import './App.css';

function App() {
  const [receptlist, setReceptlist] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Router>
      <TitleUpdater />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {/* Your page content goes here */}
          <Routes>
            {/* Make Home the default route */}
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>{' '}
          <Image alt="Profile" rounded="full" width={100} height={100} />
          <form>
            <TextInput
              id="recept"
              label="Recept"
              value={receptlist}
              onChange={setReceptlist}
              placeholder="Ange namn på din recept lista:"
            />
            <Checkbox
              id="terms"
              label="Jag godkänner villkoren"
              checked={isChecked}
              onChange={setIsChecked}
            />
          </form>
          <Button variant="primary">Save</Button>
          <Button variant="secondary" size="small">
            Cancel
          </Button>
          <Button variant="outline" size="medium">
            Back
          </Button>
          <Button variant="danger" size="large">
            Delete
          </Button>
          <Button onClick={() => alert('Clicked!')}>Click Me</Button>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
