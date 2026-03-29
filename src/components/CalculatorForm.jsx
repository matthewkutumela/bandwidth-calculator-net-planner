import React, { useState } from 'react';
import { calculateBandwidth } from '../calculator/engine';
import { estimateCosts } from '../calculator/costEstimator';
import { generatePDF } from '../utils/pdfExport';

function CalculatorForm() {
  // State
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

  // Calculate total usage percentage
  const totalUsage = Object.values(inputs.usageProfile).reduce((a, b) => a + b, 0);

  // Handlers
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handleUsageChange = (type, value) => {
    setInputs(prev => ({
      ...prev,
      usageProfile: {
        ...prev.usageProfile,
        [type]: parseInt(value) || 0
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculation = calculateBandwidth(inputs);
    const costs = estimateCosts(
      calculation.infrastructure.type,
      calculation.futureProofed,
      inputs.growthYears
    );
    setResult({ ...calculation, costs });
  };

  return (
    <div className="calculator-card">
      <h2>Network Bandwidth Calculator</h2>
      
      <form onSubmit={handleSubmit}>
        {/* User Count */}
        <div className="form-group">
          <label>Number of Users</label>
          <input
            type="number"
            name="userCount"
            value={inputs.userCount}
            onChange={handleNumberChange}
            min="1"
          />
        </div>

        {/* Usage Profile */}
        <div className="form-group">
          <label>Usage Profile (%)</label>
          
          <div className="slider-group">
            <label>
              <span>Streaming (4K)</span>
              <span className="slider-value">{inputs.usageProfile.streaming}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.usageProfile.streaming}
              onChange={(e) => handleUsageChange('streaming', e.target.value)}
            />
          </div>

          <div className="slider-group">
            <label>
              <span>Gaming</span>
              <span className="slider-value">{inputs.usageProfile.gaming}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.usageProfile.gaming}
              onChange={(e) => handleUsageChange('gaming', e.target.value)}
            />
          </div>

          <div className="slider-group">
            <label>
              <span>Browsing</span>
              <span className="slider-value">{inputs.usageProfile.browsing}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.usageProfile.browsing}
              onChange={(e) => handleUsageChange('browsing', e.target.value)}
            />
          </div>

          <div className="slider-group">
            <label>
              <span>Video Calls</span>
              <span className="slider-value">{inputs.usageProfile.videoCalls}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={inputs.usageProfile.videoCalls}
              onChange={(e) => handleUsageChange('videoCalls', e.target.value)}
            />
          </div>

          {totalUsage !== 100 && (
            <div style={{ 
              color: totalUsage > 100 ? '#dc3545' : '#ffc107', 
              marginTop: '10px',
              fontSize: '0.9rem',
              fontWeight: 500
            }}>
              Total usage: {totalUsage}% {totalUsage > 100 ? '(Cannot exceed 100%)' : '(Should equal 100%)'}
            </div>
          )}
        </div>

        {/* Peak Concurrency */}
        <div className="form-group">
          <label>Peak Concurrency</label>
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
        <div className="form-group">
          <label>Plan for Growth (years)</label>
          <input
            type="number"
            name="growthYears"
            value={inputs.growthYears}
            onChange={handleNumberChange}
            min="0"
            max="10"
          />
        </div>

        <button type="submit" className="btn-primary">
          Calculate Bandwidth
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="results-card">
          <h3>Calculation Results</h3>
          
          <div className="result-row">
            <span className="result-label">Base Bandwidth</span>
            <span className="result-value">{result.baseBandwidth} Mbps</span>
          </div>
          
          <div className="result-row">
            <span className="result-label">With Overhead (25%)</span>
            <span className="result-value">{result.withOverhead} Mbps</span>
          </div>
          
          <div className="result-row">
            <span className="result-label">Future-Proofed ({inputs.growthYears} years)</span>
            <span className="result-value">{result.futureProofed} Mbps</span>
          </div>

          <h4>Infrastructure Recommendation</h4>
          
          <div className="result-row">
            <span className="result-label">Type</span>
            <span className="result-value">{result.infrastructure.description}</span>
          </div>
          
          <div className="result-row">
            <span className="result-label">Category</span>
            <span className="result-value">{result.infrastructure.type}</span>
          </div>
          
          <div className="result-row">
            <span className="result-label">Max Capacity</span>
            <span className="result-value">{result.infrastructure.maxCapacity} Mbps</span>
          </div>

          <div className="pros-cons">
            <strong>Pros:</strong>
            <ul>
              {result.infrastructure.pros.map((pro, i) => <li key={i}>{pro}</li>)}
            </ul>
            
            <strong>Cons:</strong>
            <ul>
              {result.infrastructure.cons.map((con, i) => <li key={i}>{con}</li>)}
            </ul>
          </div>

          {result.costs && (
            <div className="cost-section">
              <h4>Cost Estimate ({result.costs.planningPeriodYears} years)</h4>
              
              <div className="result-row">
                <span className="result-label">Initial Investment</span>
                <span className="cost-amount">R {result.costs.initialCosts.total.toLocaleString()}</span>
              </div>
              
              <div className="result-row">
                <span className="result-label">Monthly Recurring</span>
                <span className="result-value">R {result.costs.recurringCosts.monthly}/month</span>
              </div>
              
              <div className="result-row">
                <span className="result-label">Total Cost of Ownership</span>
                <span className="cost-amount">R {result.costs.summary.totalCostOfOwnership.toLocaleString()}</span>
              </div>
              
              <div className="result-row">
                <span className="result-label">Cost per Mbps</span>
                <span className="result-value">R {result.costs.summary.costPerMbps}</span>
              </div>
              
              <div className="result-row">
                <span className="result-label">Setup Time</span>
                <span className="result-value">{result.costs.summary.setupTime}</span>
              </div>

              <div className="notes-section">
                <strong>Notes:</strong>
                <ul>
                  {result.costs.notes.map((note, i) => <li key={i}>{note}</li>)}
                </ul>
              </div>
            </div>
          )}

          <button 
            onClick={() => generatePDF(result, inputs)}
            className="btn-secondary"
            style={{ marginTop: '20px' }}
          >
            Download PDF Report
          </button>
        </div>
      )}
    </div>
  );
}

export default CalculatorForm;