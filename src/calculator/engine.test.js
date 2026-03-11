//Tests for calculation engine

const {calculateBandwidth, determineInfrastructure} = require('./engine');

describe('Bandwidth calculations',() => {
   test('calculates basic residential scenario', () => {
    const input = {
      userCount: 10,
      usageProfile: {
        streaming: 50,
        gaming: 20,
        browsing: 20,
        videoCalls: 10
      },
      peakConcurrency: 0.7,
      growthYears: 0
    };
        const result = calculateBandwidth(input);

    //manual calculation
    //avg per user = (0.5*25 + 0.2*15 + 0.2*5 + 0.1*10) = 12.5 + 3 + 1 + 1 = 17.5 Mbps
    //concurrent = 10 * 0.7 = 7 users
    //base = 7 * 17.5 = 122.5 Mbps
    //with overhead = 122.5 * 1.25 = 153.125 Mbps

    expect(result.baseBandwidth).toBe(123); //rounded
    expect(result.withOverhead).toBe(153); //rounded
    expect(result.infrastructure.type).toBe('fiber'); 
});

test('rejects negative user count', () => {
    expect(() => {
        calculateBandwidth({
            userCount: -5,
            usageProfile: {streaming: 100, gaming:0, browsing:0, videoCalls:0},
        });
    }).toThrow('User count must be positive');
});

test('Future-proofing calculation', () => {
    const input = {
        userCount:20,
        usageProfile: {streaming:100, gaming:0, browsing:0, videoCalls:0},
        peakConcurrency:1.0,
        growthYears:2
    };

    const result = calculateBandwidth(input);

    //20 users * 25Mbps = 500 base
    //500 * 1.25 = 625 with overhead
    //625 * 1.15^2 = 625 * 1.3225 = 826.56 

    expect(result.futureProofed).toBe(827);
});
});

describe('Infrastructure Determination', () => {
    test('recommends wireless for low bandwidth',() => {
        const result = determineInfrastructure(50);
        expect(result.type).toBe('wireless');
    });
    test('recommends fiber for medium bandwidth',() => {
        const result = determineInfrastructure(500);
        expect(result.type).toBe('fiber');
    });
    test('recommends enterprise for high bandwidth',() => {
        const result = determineInfrastructure(1500); 
        expect(result.type).toBe('Enterprise');
    });
});
