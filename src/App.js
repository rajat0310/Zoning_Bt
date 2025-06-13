import React, { useState } from 'react';
import './App.css';
import HomeTab from './component/HomeTab';
import SliderTab from './component/SliderTab';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="App">
      <div id="nav">
        {/* Add logo image before the h1 tag */}
        <img
          src={`${process.env.PUBLIC_URL}/images/better-trucks-logo.png`}
          alt="Logo"
          style={{ height: '40px', marginRight: '10px' }} // Adjust the size and spacing as needed
        />
        <h1>Chicago Zones: Population Density</h1>
        <div className="nav-buttons">
          <button
            className={activeTab === 'home' ? 'active' : ''}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={activeTab === 'compare' ? 'active' : ''}
            onClick={() => setActiveTab('compare')}
          >
            Compare View
          </button>
        </div>
      </div>


      <div id="content">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'compare' && <SliderTab />}
      </div>
    </div>
  );
}

export default App;
