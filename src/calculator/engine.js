//Bandwidth Calculation Engine
//Pure Functions - no UI, no side effects, just math.

 /**
  * Calculates bandwidth requirements for a network scenario
  * @param {Object} params - Input parameters
  * @param {Number} params.userCount - Total number of users
  * @param {Object} params.userProfile - Percentage breakdown (0-100) 
  * @param {Number} params.peakConcurrency - Decimal 0.0 to 1.0 
  * @param {Object} params.growthYears- Years to project(default 0)
  * @returns {Object} calculation results
  */

 function calculateBandwidth(params) {
    //Destructure input with defaults
    const {
        userCount,
        usageProfile,
        peakConcurrency,
        growthYears = 0
    } = params; 

    //Validate input, (basic checks) 
    if (userCount <= 0) {
        throw new Error ('User count must be positive');
    }

    //Bandwidth requirements per usage type (Mbps per user)
    const BANDWIDTH_RATES ={
        streaming: 25,
        gaming: 15,
        browsing: 5,
        videoCalls: 10
    };

    //Calculated weighted avarage bandwidth per user

    const averageUser = 
    (usageProfile.streaming/100 * BANDWIDTH_RATES.streaming)+
    (usageProfile.gaming/100 * BANDWIDTH_RATES.gaming)+
    (usageProfile.browsing/100 * BANDWIDTH_RATES.browsing)+
    (usageProfile.videoCalls/100 * BANDWIDTH_RATES.videoCalls);

    //Account for simultaneous users
    const concurrentUsers = userCount * peakConcurrency;

    //Base calculation
    const baseBandwidth = concurrentUsers * averageUser;

    //Add 25% overhead buffer
    const withOverhead = baseBandwidth *1.25;

    //Future-proofing: compound 15% growth per year 
    const growthMultiplier = Math.pow(1.15, growthYears);
    const futureProofed = withOverhead * growthMultiplier;

    // Determine infrastructure recommendation 
    const infrastructure = determineInfrastructure(futureProofed);

    return{
        baseBandwidth: Math.round(baseBandwidth),
        withOverhead: Math.round(withOverhead),
        futureProofed: Math.round(futureProofed),
        infrastructure
    };
 }
    /**
     * Determine infrastructure type baseed on bandwidth requirements
     * @param {Number} bandwidthMbps - Required bandwidth in Mbps
     * @returns {Object} Infrastructure recommendation 
     */
    function determineInfrastructure(bandwidthMbps) {
        if (bandwidthMbps < 100) {
            return{
                type: 'wireless',
                description: '4G/5G fixed wireless',
                maxCapacity: 100,
                pros: ['Quick deployment', 'Lower upfront cost'],
                cons: ['Weather dependent', 'Higher latency']
            };
        } else if (bandwidthMbps <= 1000) { 
            return{
                type: 'fiber',
                description: 'fiber To The Premises(GPON)',
                maxCapacity: 1000,
                pros: ['Reliable', 'Futureproof to 10Gbps'],
                cons: ['Installation time', 'Higher initial cost']
            };
        } else {
            return{
                type: 'Enterprise',
                description: 'Dedicated fiber with reduncancy',
                maxCapacity: 10000,
                pros: ['High reliability', 'SLA guaranteed'],
                cons: ['Complex installation', 'Premium Pricing'] 
            };
        }
    }

    // Export functions for use in tests and UI
export { calculateBandwidth, determineInfrastructure };
