# Bandwidth Planner & Network Planning Tool

**Live Demo:** https://matthewkutumela.github.io/bandwidth-calculator-net-planner

A web-based calculator for network infrastructure planning. Calculates bandwidth requirements and recommends fiber vs. wireless solutions with cost estimates in South African Rands.

## Features

- Bandwidth calculations with 25% overhead buffer
- Infrastructure recommendations (wireless, fiber, enterprise)
- Cost estimation in ZAR (South African Rands)
- PDF report generation
- Responsive design for all devices

## Tech Stack

- React
- CSS3
- jsPDF (PDF generation)
- Jest (testing)
- GitHub Pages (deployment)

## How to Use

1. Enter number of users
2. Set usage percentages (streaming, gaming, browsing, video calls)
3. Select peak concurrency level
4. Choose growth projection years
5. Click "Calculate Bandwidth"
6. Download PDF report if needed

## Local Development

```bash
npm install
npm start
