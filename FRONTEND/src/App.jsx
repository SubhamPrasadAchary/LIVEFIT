import React from 'react';
import ParticlesBackground from './components/ParticlesBackground';
import './App.css';

function App() {
  return (
    <div className="app">
      <ParticlesBackground />
      <div className="content">
        {/* Your existing HTML content will be rendered here */}
        <div id="root"></div>
      </div>
    </div>
  );
}

export default App;
