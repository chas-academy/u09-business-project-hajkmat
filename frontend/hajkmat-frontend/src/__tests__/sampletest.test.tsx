import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Replace with text that actually exists in your App component
    const element = screen.getByText(/Vite \+ React/i);
    expect(element).toBeInTheDocument();
  });
});
