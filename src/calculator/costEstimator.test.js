import { estimateCosts } from './costEstimator';

describe('Cost Estimation', () => {
  
  test('estimates wireless costs correctly', () => {
    const result = estimateCosts('wireless', 50, 5);
    
    expect(result.infrastructureType).toBe('wireless');
    expect(result.initialCosts.total).toBe(12600); // 9000 + 3600
    expect(result.recurringCosts.monthly).toBe(2700);
    expect(result.summary.totalCostOfOwnership).toBe(174600); // 12600 + (2700*12*5)
  });

  test('estimates fiber costs correctly', () => {
    const result = estimateCosts('fiber', 500, 5);
    
    expect(result.initialCosts.equipment).toBe(36000);
    expect(result.initialCosts.installation).toBe(135000); // 270 * 500
    expect(result.initialCosts.total).toBe(171000);
    expect(result.recurringCosts.monthly).toBe(5400);
  });

  test('estimates enterprise costs correctly', () => {
    const result = estimateCosts('enterprise', 2000, 5);
    
    expect(result.initialCosts.total).toBe(495000); // 270000 + (450*500)
    expect(result.recurringCosts.maintenance).toBe(54000);
    expect(result.summary.totalCostOfOwnership).toBeGreaterThan(1000000);
  });

  test('rejects unknown infrastructure type', () => {
    expect(() => {
      estimateCosts('unknown', 100, 5);
    }).toThrow('Unknown infrastructure type');
  });
});