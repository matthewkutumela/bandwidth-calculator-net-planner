import { estimateCosts } from './costEstimator';

describe('Cost Estimation', () => {
  
  test('estimates wireless costs correctly', () => {
    const result = estimateCosts('wireless', 50, 5);
    
    expect(result.infrastructureType).toBe('wireless');
    expect(result.initialCosts.total).toBe(700); // 500 + 200
    expect(result.recurringCosts.monthly).toBe(150);
    expect(result.summary.totalCostOfOwnership).toBe(9700); // 700 + (150*12*5)
  });

  test('estimates fiber costs correctly', () => {
    const result = estimateCosts('fiber', 500, 5);
    
    expect(result.initialCosts.equipment).toBe(2000);
    expect(result.initialCosts.installation).toBe(7500); // 15 * 500
    expect(result.initialCosts.total).toBe(9500);
    expect(result.recurringCosts.monthly).toBe(300);
  });

  test('estimates enterprise costs correctly', () => {
    const result = estimateCosts('enterprise', 2000, 5);
    
    expect(result.initialCosts.total).toBe(27500); // 15000 + (25*500)
    expect(result.recurringCosts.maintenance).toBe(3000);
    expect(result.summary.totalCostOfOwnership).toBeGreaterThan(50000);
  });

  test('rejects unknown infrastructure type', () => {
    expect(() => {
      estimateCosts('unknown', 100, 5);
    }).toThrow('Unknown infrastructure type');
  });
});