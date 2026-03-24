import React from 'react';
import CalculatorForm from './components/CalculatorForm';

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#0066cc', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>Bandwidth Planner</h1>
        <p>Network Infrastructure Planning Tool</p>
      </header>
      <main>
        <CalculatorForm />
      </main>
    </div>
  );
}

export default App;