import React, { useState } from 'react';
import { calculateBandwidth } from '../calculator/engine';

function CalculatorForm() {
  // State: where user input lives
  const [inputs, setInputs] = useState({
    userCount: 50,
    usageProfile: {
      streaming: 40,
      gaming: 20,
      browsing: 30,
      videoCalls: 10
    },
    peakConcurrency: 0.7,
    growthYears: 3
  });

  const [result, setResult] = useState(null);

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  // Handle usage profile changes
  const handleUsageChange = (type, value) => {
    setInputs(prev => ({
      ...prev,
      usageProfile: {
        ...prev.usageProfile,
        [type]: parseInt(value) || 0
      }
    }));
  };

  // Calculate when form submits
  const handleSubmit = (e) => {
    e.preventDefault();
    const calculation = calculateBandwidth(inputs);
    setResult(calculation);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Network Bandwidth Calculator</h2>
      
      <form onSubmit={handleSubmit}>
        {/* User Count */}
        <div style={{ marginBottom: '15px' }}>
          <label>Number of Users: </label>
          <input
            type="number"
            name="userCount"
            value={inputs.userCount}
            onChange={handleNumberChange}
            min="1"
            style={{ width: '80px', marginLeft: '10px' }}
          />
        </div>

        {/* Usage Profile */}
        <h3>Usage Profile (%)</h3>
        <div style={{ marginBottom: '10px' }}>
          <label>Streaming (4K): </label>
          <input
            type="range"
            min="0"
            max="100"
            value={inputs.usageProfile.streaming}
            onChange={(e) => handleUsageChange('streaming', e.target.value)}
          />
          <span>{inputs.usageProfile.streaming}%</span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Gaming: </label>
          <input
            type="range"
            min="0"
            max="100"
            value={inputs.usageProfile.gaming}
            onChange={(e) => handleUsageChange('gaming', e.target.value)}
          />
          <span>{inputs.usageProfile.gaming}%</span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Browsing: </label>
          <input
            type="range"
            min="0"
            max="100"
            value={inputs.usageProfile.browsing}
            onChange={(e) => handleUsageChange('browsing', e.target.value)}
          />
          <span>{inputs.usageProfile.browsing}%</span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Video Calls: </label>
          <input
            type="range"
            min="0"
            max="100"
            value={inputs.usageProfile.videoCalls}
            onChange={(e) => handleUsageChange('videoCalls', e.target.value)}
          />
          <span>{inputs.usageProfile.videoCalls}%</span>
        </div>

        {/* Peak Concurrency */}
        <div style={{ marginBottom: '15px' }}>
          <label>Peak Concurrency: </label>
          <select
            name="peakConcurrency"
            value={inputs.peakConcurrency}
            onChange={(e) => setInputs(prev => ({ ...prev, peakConcurrency: parseFloat(e.target.value) }))}
          >
            <option value={0.3}>30% (Low)</option>
            <option value={0.5}>50% (Medium)</option>
            <option value={0.7}>70% (High)</option>
            <option value={0.9}>90% (Very High)</option>
          </select>
        </div>

        {/* Growth Projection */}
        <div style={{ marginBottom: '20px' }}>
          <label>Plan for Growth (years): </label>
          <input
            type="number"
            name="growthYears"
            value={inputs.growthYears}
            onChange={handleNumberChange}
            min="0"
            max="10"
            style={{ width: '60px', marginLeft: '10px' }}
          />
        </div>

        <button 
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Calculate Bandwidth
        </button>
      </form>

      {/* Results Display */}
      {result && (
        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Results</h3>
          <p><strong>Base Bandwidth:</strong> {result.baseBandwidth} Mbps</p>
          <p><strong>With Overhead (25%):</strong> {result.withOverhead} Mbps</p>
          <p><strong>Future-Proofed ({inputs.growthYears} years):</strong> {result.futureProofed} Mbps</p>
          
          <h4>Infrastructure Recommendation</h4>
          <p><strong>Type:</strong> {result.infrastructure.description}</p>
          <p><strong>Category:</strong> {result.infrastructure.type}</p>
          <p><strong>Max Capacity:</strong> {result.infrastructure.maxCapacity} Mbps</p>
          
          <div style={{ marginTop: '15px' }}>
            <strong>Pros:</strong>
            <ul>{result.infrastructure.pros.map((pro, i) => <li key={i}>{pro}</li>)}</ul>
            
            <strong>Cons:</strong>
            <ul>{result.infrastructure.cons.map((con, i) => <li key={i}>{con}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalculatorForm;