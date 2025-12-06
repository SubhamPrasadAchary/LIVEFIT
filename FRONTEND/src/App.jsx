import React, { useEffect } from 'react';
import ParticlesBackground from './components/ParticlesBackground';
import './App.css';

function App() {
  // This effect will run once when the component mounts
  useEffect(() => {
    // Move the existing content into the root div
    const content = document.querySelector('body').innerHTML;
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = content;
    }
  }, []);

  return (
    <div className="app">
      <ParticlesBackground />
      <div className="content">
        {/* The existing content will be moved here by the useEffect hook */}
      </div>
    </div>
  );
}

export default App;
