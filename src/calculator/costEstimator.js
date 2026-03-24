// Cost Estimation Engine
// Calculates infrastructure costs based on bandwidth requirements

const COST_RATES = {
  wireless: {
    equipmentCost: 500,        // Router/antenna per location
    installationCost: 200,     // Labor
    monthlyCost: 150,          // Data plan
    setupTime: '1-2 days',
    lifespanYears: 5
  },
  fiber: {
    equipmentCost: 2000,       // ONT, router, switches
    installationCostPerMeter: 15,  // Trenching, cables
    averageDistanceMeters: 500,    // Distance to nearest fiber point
    monthlyCost: 300,          // ISP service
    setupTime: '1-2 weeks',
    lifespanYears: 20
  },
  enterprise: {
    equipmentCost: 15000,      // Redundant routers, switches, backup power
    installationCostPerMeter: 25,  // Dedicated trenching
    averageDistanceMeters: 500,
    monthlyCost: 1200,         // SLA service with guarantees
    setupTime: '1-2 months',
    lifespanYears: 20,
    annualMaintenance: 3000    // Ongoing support
  }
};

/**
 * Calculates total cost of ownership for infrastructure
 * @param {string} infrastructureType - 'wireless', 'fiber', or 'enterprise'
 * @param {number} bandwidthRequired - Mbps needed
 * @param {number} years - Planning period
 * @returns {Object} Cost breakdown
 */
function estimateCosts(infrastructureType, bandwidthRequired, years = 5) {
  const rates = COST_RATES[infrastructureType];
  
  if (!rates) {
    throw new Error(`Unknown infrastructure type: ${infrastructureType}`);
  }

// Calculate initial setup costs
let initialCosts = rates.equipmentCost;

// Add installation costs
if (rates.installationCost) {
  // Wireless has flat installation cost
  initialCosts += rates.installationCost;
} else if (rates.installationCostPerMeter && rates.averageDistanceMeters) {
  // Fiber and enterprise have per-meter costs
  initialCosts += rates.installationCostPerMeter * rates.averageDistanceMeters;
}

  // Calculate recurring costs
  const monthlyRecurring = rates.monthlyCost;
  const annualRecurring = monthlyRecurring * 12;
  
  // Add maintenance for enterprise
  const annualMaintenance = rates.annualMaintenance || 0;
  
  // Total over planning period
  const totalRecurring = (annualRecurring + annualMaintenance) * years;
  
  // Total cost of ownership
  const totalCost = initialCosts + totalRecurring;
  
  // Cost per Mbps (for comparison)
  const costPerMbps = totalCost / bandwidthRequired;

  return {
    infrastructureType,
    planningPeriodYears: years,
    bandwidthRequired,
    
    initialCosts: {
      equipment: rates.equipmentCost,
      installation: initialCosts - rates.equipmentCost,
      total: initialCosts
    },
    
    recurringCosts: {
      monthly: monthlyRecurring,
      annual: annualRecurring,
      maintenance: annualMaintenance,
      totalOverPeriod: totalRecurring
    },
    
    summary: {
      totalCostOfOwnership: Math.round(totalCost),
      costPerMbps: Math.round(costPerMbps * 100) / 100,
      setupTime: rates.setupTime,
      lifespanYears: rates.lifespanYears,
      breakEvenYear: Math.round(initialCosts / annualRecurring)
    },
    
    notes: generateNotes(infrastructureType, years)
  };
}

function generateNotes(type, years) {
  const notes = [];
  
  if (type === 'wireless') {
    notes.push('Subject to weather interference');
    notes.push('Data caps may apply depending on carrier');
    notes.push('Easy to upgrade or relocate');
  } else if (type === 'fiber') {
    notes.push('Highly reliable, minimal downtime');
    notes.push('Scalable to 10 Gbps without new cables');
    notes.push('Requires physical infrastructure (trenching)');
  } else if (type === 'enterprise') {
    notes.push('99.99% uptime SLA guarantee');
    notes.push('24/7 priority support included');
    notes.push('Redundant paths prevent single points of failure');
  }
  
  notes.push(`Costs assume ${years} year planning horizon`);
  
  return notes;
}

export { estimateCosts, COST_RATES };