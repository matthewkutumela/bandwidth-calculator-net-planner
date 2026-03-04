# Bandwidth Calculator-Design Document

## Project Overview 
Web-based tool for network infrastructure planning. Calculates bandwidth requiremtns and recommends physical infrastructure based on usage patterns.

## Core User Flow
1. User selects scenario type (residential, offica, event venue)
2. User inputs: number of users + usage mix (streaming, gaming, browsing, video calls) 
3. User sets: peak concurrency percentage (default 70%)
4. System calculates: total bandwidth required.
5. System recommends: infrastructure type + cost range.
6. User exports: PDF report.

## Data Structures.

### Input Structures 
 ```tyepscript 
 interface PlanningScenario{
    type: 'residential' | 'office' | 'event';
    userCount: number;
    usageProfile: {
        streaming: number; // percentage 0-100
        gaming: number;
        browsing: number;
        video calls: number;
    },
    peakConcurrency: number; 
    growthProjection: number;
 };


 //This describes what the output will display 

 CALCULATION OUTPUT

 const exampleOutput = {
    baseBandwidth: 525, //Mbps calculated
    withOverhead: 656, // +25% buffer
    futureProofed: 998, //accounting for 3 years growth

    infrastructure:{
        type: 'fiber',
        description: 'fiber to the premises (GPON)',
        maxcapacity: 1000
    },

    costEstimate: {
        min:8000
        max: 15000
        currency: 'Rands'
        notes: ['Requires conduit installation', 3-day setup']
    }
  };

  


 