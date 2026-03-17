import React from 'react';
import { calculateBandwidth } from './calculator/engine';

function App() {
  const testResult = calculateBandwidth({
    userCount: 10,
    usageProfile: { streaming: 50, gaming: 20, browsing: 20, videoCalls: 10 },
    peakConcurrency: 0.7,
    growthYears: 0
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Bandwidth Planner</h1>
      <p>Test calculation result:</p>
      <pre>{JSON.stringify(testResult, null, 2)}</pre>
    </div>
  );
}

export default App;