
/**
 * Brr News - Enhanced Main JavaScript File
 * Handles dynamic charts, smooth scrolling, animations, and real-time data
 */

// Chart.js configuration and chart instances
let globalCharts = {};
let liveDataStream = null;
let streamInterval = null;
let isStreamPaused = false;

// Economic data storage
const economicData = {
    inflation: {
        uk: {
            historical: [
                { date: '2023-01', value: 10.5 },
                { date: '2023-03', value: 10.1 },
                { date: '2023-06', value: 8.7 },
                { date: '2023-09', value: 6.7 },
                { date: '2023-12', value: 4.0 },
                { date: '2024-03', value: 3.2 },
                { date: '2024-06', value: 2.0 },
                { date: '2024-09', value: 2.2 },
                { date: '2024-12', value: 4.2 },
                { date: '2025-03', value: 5.8 },
                { date: '2025-06', value: 7.2 },
                { date: '2025-09', value: 6.8 },
                { date: '2025-10', value: 6.1 }
            ],
            current: 6.1,
            trend: 'decreasing'
        },
        eu: {
            historical: [
                { date: '2023-01', value: 8.5 },
                { date: '2023-03', value: 6.9 },
                { date: '2023-06', value: 5.5 },
                { date: '2023-09', value: 4.3 },
                { date: '2023-12', value: 2.9 },
                { date: '2024-03', value: 2.4 },
                { date: '2024-06', value: 2.5 },
                { date: '2024-09', value: 1.7 },
                { date: '2024-12', value: 2.3 },
                { date: '2025-03', value: 2.6 },
                { date: '2025-06', value: 3.1 },
                { date: '2025-09', value: 3.5 },
                { date: '2025-10', value: 3.8 }
            ],
            current: 3.8,
            trend: 'stable'
        },
        us: {
            historical: [
                { date: '2023-01', value: 6.4 },
                { date: '2023-03', value: 5.0 },
                { date: '2023-06', value: 3.0 },
                { date: '2023-09', value: 3.7 },
                { date: '2023-12', value: 3.1 },
                { date: '2024-03', value: 3.5 },
                { date: '2024-06', value: 3.0 },
                { date: '2024-09', value: 2.4 },
                { date: '2024-12', value: 2.6 },
                { date: '2025-03', value: 3.2 },
                { date: '2025-06', value: 3.3 },
                { date: '2025-09', value: 3.7 },
                { date: '2025-10', value: 4.2 }
            ],
            current: 4.2,
            trend: 'increasing'
        },
        global: {
            historical: [
                { date: '2023-01', value: 7.8 },
                { date: '2023-03', value: 6.8 },
                { date: '2023-06', value: 5.4 },
                { date: '2023-09', value: 4.9 },
                { date: '2023-12', value: 3.9 },
                { date: '2024-03', value: 3.1 },
                { date: '2024-06', value: 2.8 },
                { date: '2024-09', value: 2.1 },
                { date: '2024-12', value: 2.7 },
                { date: '2025-03', value: 3.4 },
                { date: '2025-06', value: 4.1 },
                { date: '2025-09', value: 4.5 },
                { date: '2025-10', value: 4.7 }
            ],
            current: 4.7,
            trend: 'mixed'
        }
    },
    debt: {
        us: {
            total: 33.7, // in trillions USD
            gdpRatio: 129.8,
            change: 2.1,
            trend: 'increasing',
            historical: [
                { date: '2020', value: 28.4 },
                { date: '2021', value: 29.2 },
                { date: '2022', value: 31.1 },
                { date: '2023', value: 32.3 },
                { date: '2024', value: 33.0 },
                { date: '2025', value: 33.7 }
            ]
        },
        eu: {
            total: 13.2, // in trillions EUR
            gdpRatio: 83.5,
            change: -0.3,
            trend: 'stable',
            historical: [
                { date: '2020', value: 12.1 },
                { date: '2021', value: 12.8 },
                { date: '2022', value: 13.1 },
                { date: '2023', value: 13.4 },
                { date: '2024', value: 13.3 },
                { date: '2025', value: 13.2 }
            ]
        },
        uk: {
            total: 2.8, // in trillions GBP
            gdpRatio: 101.2,
            change: 1.8,
            trend: 'increasing',
            historical: [
                { date: '2020', value: 2.2 },
                { date: '2021', value: 2.4 },
                { date: '2022', value: 2.6 },
                { date: '2023', value: 2.7 },
                { date: '2024', value: 2.75 },
                { date: '2025', value: 2.8 }
            ]
        },
        japan: {
            total: 1395, // in trillions JPY
            gdpRatio: 263.1,
            change: 1.4,
            trend: 'increasing',
            historical: [
                { date: '2020', value: 1200 },
                { date: '2021', value: 1250 },
                { date: '2022', value: 1310 },
                { date: '2023', value: 1350 },
                { date: '2024', value: 1375 },
                { date: '2025', value: 1395 }
            ]
        }
    },
    moneySupply: {
        us: {
            m2Current: 21.7, // in trillions USD
            m2Change: 8.2, // annual percentage change
            qePurchases: 4.2, // trillions in QE purchases 2020-2024
            balanceSheetSize: 7.8, // Fed balance sheet in trillions
            trend: 'expanding',
            historical: [
                { date: '2020-01', m2: 15.4, balanceSheet: 4.2, qe: 0.0 },
                { date: '2020-06', m2: 18.1, balanceSheet: 7.1, qe: 2.8 },
                { date: '2020-12', m2: 19.2, balanceSheet: 7.4, qe: 3.1 },
                { date: '2021-06', m2: 20.5, balanceSheet: 8.0, qe: 3.5 },
                { date: '2021-12', m2: 21.8, balanceSheet: 8.8, qe: 3.8 },
                { date: '2022-06', m2: 21.6, balanceSheet: 8.9, qe: 4.0 },
                { date: '2022-12', m2: 21.3, balanceSheet: 8.6, qe: 4.1 },
                { date: '2023-06', m2: 20.9, balanceSheet: 8.2, qe: 4.1 },
                { date: '2023-12', m2: 20.8, balanceSheet: 7.9, qe: 4.2 },
                { date: '2024-06', m2: 21.1, balanceSheet: 7.8, qe: 4.2 },
                { date: '2025-10', m2: 21.7, balanceSheet: 7.8, qe: 4.2 }
            ]
        },
        uk: {
            m4Current: 2.8, // in trillions GBP
            m4Change: 4.1,
            qePurchases: 875, // billions in QE purchases
            balanceSheetSize: 950, // BoE balance sheet in billions GBP
            trend: 'moderate_expansion',
            historical: [
                { date: '2020-01', m4: 2.3, balanceSheet: 620, qe: 645 },
                { date: '2020-06', m4: 2.5, balanceSheet: 740, qe: 745 },
                { date: '2020-12', m4: 2.6, balanceSheet: 780, qe: 795 },
                { date: '2021-06', m4: 2.7, balanceSheet: 820, qe: 820 },
                { date: '2021-12', m4: 2.75, balanceSheet: 860, qe: 845 },
                { date: '2022-06', m4: 2.8, balanceSheet: 880, qe: 855 },
                { date: '2022-12', m4: 2.82, balanceSheet: 900, qe: 865 },
                { date: '2023-06', m4: 2.79, balanceSheet: 920, qe: 870 },
                { date: '2023-12', m4: 2.77, balanceSheet: 935, qe: 872 },
                { date: '2024-06', m4: 2.78, balanceSheet: 945, qe: 874 },
                { date: '2025-10', m4: 2.8, balanceSheet: 950, qe: 875 }
            ]
        },
        eu: {
            m3Current: 15.2, // in trillions EUR
            m3Change: 3.7,
            appPurchases: 3.2, // trillions in Asset Purchase Programme
            balanceSheetSize: 7.1, // ECB balance sheet in trillions
            trend: 'controlled_expansion',
            historical: [
                { date: '2020-01', m3: 13.5, balanceSheet: 4.7, app: 2.6 },
                { date: '2020-06', m3: 14.1, balanceSheet: 6.8, app: 2.8 },
                { date: '2020-12', m3: 14.6, balanceSheet: 7.0, app: 2.9 },
                { date: '2021-06', m3: 14.9, balanceSheet: 7.2, app: 3.0 },
                { date: '2021-12', m3: 15.1, balanceSheet: 7.4, app: 3.1 },
                { date: '2022-06', m3: 15.2, balanceSheet: 7.3, app: 3.15 },
                { date: '2022-12', m3: 15.0, balanceSheet: 7.2, app: 3.18 },
                { date: '2023-06', m3: 14.9, balanceSheet: 7.1, app: 3.19 },
                { date: '2023-12', m3: 15.0, balanceSheet: 7.0, app: 3.2 },
                { date: '2024-06', m3: 15.1, balanceSheet: 7.1, app: 3.2 },
                { date: '2025-10', m3: 15.2, balanceSheet: 7.1, app: 3.2 }
            ]
        }
    },
    monetaryPolicy: {
        currentStance: {
            us: { policy: 'Tightening', qeActive: false, tapering: 'Complete' },
            uk: { policy: 'Tightening', qeActive: false, tapering: 'Complete' },
            eu: { policy: 'Neutral', qeActive: false, tapering: 'Complete' }
        },
        qeTimeline: {
            us: [
                { period: 'QE1', start: '2008', end: '2010', amount: 1.25 },
                { period: 'QE2', start: '2010', end: '2011', amount: 0.6 },
                { period: 'QE3', start: '2012', end: '2014', amount: 1.6 },
                { period: 'COVID QE', start: '2020', end: '2021', amount: 4.2 }
            ],
            uk: [
                { period: 'Initial QE', start: '2009', end: '2012', amount: 375 },
                { period: 'Extension', start: '2016', end: '2018', amount: 435 },
                { period: 'COVID QE', start: '2020', end: '2021', amount: 875 }
            ],
            eu: [
                { period: 'APP', start: '2015', end: '2018', amount: 2.6 },
                { period: 'PEPP', start: '2020', end: '2022', amount: 1.85 },
                { period: 'APP Resume', start: '2019', end: '2022', amount: 3.2 }
            ]
        }
    },
    debtClocks: {
        global: {
            baseAmount: 307000000000000, // $307 trillion
            perSecond: 975232, // Growth per second
            population: 7926000000, // Global population
            gdp: 86200000000000, // Global GDP
            lastUpdated: '2025-10-15'
        },
        us: {
            baseAmount: 33740000000000, // $33.74 trillion
            perSecond: 68493, // Growth per second
            population: 336000000, // US population
            gdp: 25980000000000, // US GDP
            lastUpdated: '2025-10-15'
        },
        uk: {
            baseAmount: 2800000000000, // £2.8 trillion
            perSecond: 1746, // Growth per second in GBP
            population: 68000000, // UK population
            gdp: 2765000000000, // UK GDP in GBP
            lastUpdated: '2025-10-15'
        }
    },
    
    // Real wages data
    realWages: {
        us: {
            currentChange: -2.3, // Real wages change YoY
            nominalGrowth: 4.1,
            inflationRate: 6.4,
            historical: [
                { date: '2020-01', realWage: 100, nominal: 100, inflation: 1.4 },
                { date: '2020-06', realWage: 102.1, nominal: 101.8, inflation: 0.6 },
                { date: '2020-12', realWage: 103.5, nominal: 103.2, inflation: 1.2 },
                { date: '2021-06', realWage: 101.8, nominal: 105.8, inflation: 5.4 },
                { date: '2021-12', realWage: 98.2, nominal: 108.1, inflation: 7.0 },
                { date: '2022-06', realWage: 94.8, nominal: 110.3, inflation: 9.1 },
                { date: '2022-12', realWage: 96.1, nominal: 112.8, inflation: 6.5 },
                { date: '2023-06', realWage: 97.3, nominal: 115.2, inflation: 3.2 },
                { date: '2023-12', realWage: 98.1, nominal: 117.5, inflation: 3.1 },
                { date: '2024-06', realWage: 97.9, nominal: 119.8, inflation: 3.3 },
                { date: '2024-12', realWage: 97.7, nominal: 122.1, inflation: 6.4 }
            ]
        },
        eu: {
            currentChange: -1.8,
            nominalGrowth: 3.7,
            inflationRate: 5.5,
            historical: [
                { date: '2020-01', realWage: 100, nominal: 100, inflation: 1.2 },
                { date: '2020-06', realWage: 101.8, nominal: 101.5, inflation: 0.3 },
                { date: '2020-12', realWage: 102.9, nominal: 102.8, inflation: -0.3 },
                { date: '2021-06', realWage: 101.5, nominal: 104.2, inflation: 1.9 },
                { date: '2021-12', realWage: 98.9, nominal: 106.1, inflation: 5.0 },
                { date: '2022-06', realWage: 95.2, nominal: 108.3, inflation: 8.6 },
                { date: '2022-12', realWage: 94.8, nominal: 110.1, inflation: 9.2 },
                { date: '2023-06', realWage: 96.8, nominal: 112.4, inflation: 5.5 },
                { date: '2023-12', realWage: 98.2, nominal: 114.2, inflation: 2.9 },
                { date: '2024-06', realWage: 98.9, nominal: 116.1, inflation: 2.6 },
                { date: '2024-12', realWage: 98.2, nominal: 117.7, inflation: 5.5 }
            ]
        },
        uk: {
            currentChange: -3.1,
            nominalGrowth: 3.4,
            inflationRate: 6.5,
            historical: [
                { date: '2020-01', realWage: 100, nominal: 100, inflation: 1.8 },
                { date: '2020-06', realWage: 101.2, nominal: 100.9, inflation: 0.6 },
                { date: '2020-12', realWage: 102.1, nominal: 101.8, inflation: 0.5 },
                { date: '2021-06', realWage: 99.8, nominal: 103.5, inflation: 2.5 },
                { date: '2021-12', realWage: 96.2, nominal: 105.8, inflation: 5.4 },
                { date: '2022-06', realWage: 91.8, nominal: 108.1, inflation: 9.4 },
                { date: '2022-12', realWage: 90.5, nominal: 110.2, inflation: 10.7 },
                { date: '2023-06', realWage: 93.1, nominal: 112.8, inflation: 7.9 },
                { date: '2023-12', realWage: 95.8, nominal: 115.1, inflation: 4.0 },
                { date: '2024-06', realWage: 96.5, nominal: 117.2, inflation: 2.0 },
                { date: '2024-12', realWage: 96.9, nominal: 119.4, inflation: 6.5 }
            ]
        }
    }
};

// Chart color schemes
const chartColors = {
    primary: 'rgba(0, 212, 255, 1)',
    primaryTransparent: 'rgba(0, 212, 255, 0.2)',
    secondary: 'rgba(2, 0, 36, 1)',
    success: 'rgba(40, 167, 69, 1)',
    warning: 'rgba(255, 193, 7, 1)',
    danger: 'rgba(220, 53, 69, 1)',
    info: 'rgba(23, 162, 184, 1)',
    light: 'rgba(248, 249, 250, 1)',
    dark: 'rgba(52, 58, 64, 1)',
    gradients: {
        blue: ['rgba(0, 212, 255, 1)', 'rgba(2, 0, 36, 1)'],
        warm: ['rgba(255, 193, 7, 1)', 'rgba(220, 53, 69, 1)'],
        cool: ['rgba(40, 167, 69, 1)', 'rgba(23, 162, 184, 1)']
    }
};

// Smooth scrolling utility function
function enableSmoothScrolling() {
    document.documentElement.style.scrollBehavior = "smooth";
}

// Chart Management Class
class ChartManager {
    constructor() {
        this.charts = {};
        this.initializeCharts();
    }

    // Create gradient for charts
    createGradient(ctx, colorStart, colorEnd) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    }

    // Initialize all charts
    initializeCharts() {
        // Small country charts
        this.createCountryChart('ukChart', economicData.inflation.uk);
        this.createCountryChart('euChart', economicData.inflation.eu);
        this.createCountryChart('usChart', economicData.inflation.us);
        this.createCountryChart('globalChart', economicData.inflation.global);

        // Main charts
        this.createGlobalInflationChart();
        this.createRealWagesChart();
        this.createInterestRatesChart();
        this.createNationalDebtChart();
        this.createMoneySupplyChart();
        this.createQETimelineChart();
        this.createCommodityChart();
        this.createInflationComponentsPie();
        this.createSpendingDistributionPie();
        this.createPerformanceRadar();
        this.createLiveDataChart();
        
        // Initialize chart controls
        this.initializeChartControls();
    }

    // Initialize chart control event listeners
    initializeChartControls() {
        // Add event listeners to chart control buttons
        document.querySelectorAll('.chart-control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const period = btn.getAttribute('data-period');
                this.updateChartPeriod(period);
            });
        });
        
        // Set initial period to 3y (active button)
        this.updateChartPeriod('3y');
    }

    // Create small country inflation charts
    createCountryChart(canvasId, data) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const gradient = this.createGradient(ctx.getContext('2d'), chartColors.primary, chartColors.primaryTransparent);

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.historical.map(item => {
                    const date = new Date(item.date + '-01');
                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }),
                datasets: [{
                    label: 'Inflation Rate (%)',
                    data: data.historical.map(item => item.value),
                    borderColor: chartColors.primary,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: chartColors.secondary,
                        bodyColor: chartColors.secondary,
                        borderColor: chartColors.primary,
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false,
                        beginAtZero: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // Create main global inflation chart
    createGlobalInflationChart() {
        const ctx = document.getElementById('globalInflationChart');
        if (!ctx) return;

        // Store full dataset for filtering
        this.inflationChartData = {
            fullLabels: economicData.inflation.uk.historical.map(item => {
                const date = new Date(item.date + '-01');
                return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            }),
            fullDatasets: Object.entries(economicData.inflation).map(([country, data]) => {
                return data.historical.map(item => item.value);
            })
        };

        // Create chart with initial 3-year view
        const initialData = this.filterInflationData('3y');
        const datasets = Object.entries(economicData.inflation).map(([country, data], index) => {
            const colors = [chartColors.primary, chartColors.danger, chartColors.success, chartColors.warning];
            return {
                label: country.toUpperCase(),
                data: initialData.datasets[index],
                borderColor: colors[index],
                backgroundColor: colors[index] + '20',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            };
        });

        this.charts.globalInflationChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: initialData.labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: chartColors.secondary,
                        bodyColor: chartColors.secondary,
                        borderColor: chartColors.primary,
                        borderWidth: 1,
                        callbacks: {
                            afterBody: function(context) {
                                const dataIndex = context[0].dataIndex;
                                return `Data Point: ${context[0].parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time Period',
                            color: chartColors.secondary
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: chartColors.secondary,
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Inflation Rate (%)',
                            color: chartColors.secondary
                        },
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: chartColors.secondary,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear',
                        from: 0.3,
                        to: 0.4,
                        loop: false
                    }
                }
            }
        });
    }

    // Create real wages chart
    createRealWagesChart() {
        const ctx = document.getElementById('realWagesChart');
        if (!ctx) return;

        const wagesData = economicData.realWages;
        const labels = wagesData.us.historical.map(item => {
            const date = new Date(item.date + '-01');
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });

        const datasets = [
            {
                label: 'US Real Wages',
                data: wagesData.us.historical.map(item => item.realWage),
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'EU Real Wages',
                data: wagesData.eu.historical.map(item => item.realWage),
                borderColor: '#4ecdc4',
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            },
            {
                label: 'UK Real Wages',
                data: wagesData.uk.historical.map(item => item.realWage),
                borderColor: '#45b7d1',
                backgroundColor: 'rgba(69, 183, 209, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }
        ];

        this.charts.realWagesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            color: 'white'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#4ecdc4',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}% of baseline`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time Period',
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'white',
                            maxRotation: 45,
                            minRotation: 45
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Real Wages Index (2020=100)',
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'white',
                            callback: function(value) {
                                return value.toFixed(0);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        
        // Add event listeners for wage chart controls
        document.querySelectorAll('.real-wages-section .chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove active class from all buttons in this section
                document.querySelectorAll('.real-wages-section .chart-btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const period = btn.getAttribute('data-period');
                this.updateRealWagesChart(period);
            });
        });
    }

    // Update real wages chart based on period
    updateRealWagesChart(period) {
        const chart = this.charts.realWagesChart;
        if (!chart) return;

        const wagesData = economicData.realWages;
        let filteredData;

        switch(period) {
            case '1y':
                filteredData = wagesData.us.historical.slice(-12);
                break;
            case '3y':
                filteredData = wagesData.us.historical.slice(-36);
                break;
            case '5y':
            default:
                filteredData = wagesData.us.historical;
                break;
        }

        const labels = filteredData.map(item => {
            const date = new Date(item.date + '-01');
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });

        chart.data.labels = labels;
        chart.data.datasets[0].data = wagesData.us.historical.slice(-filteredData.length).map(item => item.realWage);
        chart.data.datasets[1].data = wagesData.eu.historical.slice(-filteredData.length).map(item => item.realWage);
        chart.data.datasets[2].data = wagesData.uk.historical.slice(-filteredData.length).map(item => item.realWage);
        
        chart.update('active');
    }

    // Update chart time period
    updateChartPeriod(period) {
        const chart = this.charts.globalInflationChart;
        if (!chart) return;

        // Remove active class from all buttons
        document.querySelectorAll('.chart-control-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        const activeBtn = document.querySelector(`[data-period="${period}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Filter data based on selected period
        const filteredData = this.filterInflationData(period);
        
        // Update chart with filtered data
        chart.data.labels = filteredData.labels;
        chart.data.datasets.forEach((dataset, index) => {
            dataset.data = filteredData.datasets[index];
        });
        
        chart.update('active');
        console.log(`Updated chart to show ${period} period with ${filteredData.labels.length} data points`);
    }

    // Filter inflation data based on time period
    filterInflationData(period) {
        const allData = economicData.inflation;
        const countries = Object.keys(allData);
        let filteredHistorical;
        
        switch(period) {
            case '1y':
                // Last 12 months
                filteredHistorical = allData.uk.historical.slice(-12);
                break;
            case '3y':
                // Last 36 months (3 years) - but we only have ~13 data points, so show all
                filteredHistorical = allData.uk.historical;
                break;
            case '5y':
                // All available data (same as 3y for our dataset)
                filteredHistorical = allData.uk.historical;
                break;
            case 'all':
            default:
                // All available data
                filteredHistorical = allData.uk.historical;
                break;
        }
        
        // For 1y, actually filter to last 6 data points since we have limited data
        if (period === '1y') {
            filteredHistorical = allData.uk.historical.slice(-6);
        }
        
        // Create labels from filtered data
        const labels = filteredHistorical.map(item => {
            const date = new Date(item.date + '-01');
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });
        
        // Create datasets for each country with filtered data
        const datasets = countries.map(country => {
            const countryData = allData[country].historical;
            const startIndex = countryData.length - filteredHistorical.length;
            return countryData.slice(startIndex).map(item => item.value);
        });
        
        return {
            labels: labels,
            datasets: datasets
        };
    }

    // Create interest rates bar chart
    createInterestRatesChart() {
        const ctx = document.getElementById('interestRatesChart');
        if (!ctx) return;

        this.charts.interestRatesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Federal Reserve', 'European Central Bank', 'Bank of England', 'Bank of Canada'],
                datasets: [{
                    label: 'Interest Rate (%)',
                    data: [5.375, 4.50, 5.25, 5.00],
                    backgroundColor: [
                        chartColors.primary,
                        chartColors.success,
                        chartColors.warning,
                        chartColors.danger
                    ],
                    borderColor: [
                        chartColors.primary,
                        chartColors.success,
                        chartColors.warning,
                        chartColors.danger
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: chartColors.secondary,
                        bodyColor: chartColors.secondary,
                        borderColor: chartColors.primary,
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Interest Rate (%)'
                        }
                    }
                }
            }
        });
    }

    // Create national debt chart
    createNationalDebtChart() {
        const ctx = document.getElementById('nationalDebtChart');
        if (!ctx) return;

        const debtData = economicData.debt;
        const countries = ['US', 'EU', 'UK', 'Japan'];
        const debtLevels = [
            debtData.us.gdpRatio,
            debtData.eu.gdpRatio,
            debtData.uk.gdpRatio,
            debtData.japan.gdpRatio
        ];

        this.charts.nationalDebtChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: countries,
                datasets: [{
                    label: 'Debt-to-GDP Ratio (%)',
                    data: debtLevels,
                    backgroundColor: [
                        'rgba(220, 53, 69, 0.8)',   // US - Red
                        'rgba(54, 162, 235, 0.8)',  // EU - Blue
                        'rgba(255, 99, 132, 0.8)',  // UK - Pink
                        'rgba(255, 159, 64, 0.8)'   // Japan - Orange
                    ],
                    borderColor: [
                        'rgba(220, 53, 69, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: chartColors.secondary,
                        bodyColor: chartColors.secondary,
                        borderColor: chartColors.primary,
                        borderWidth: 1,
                        callbacks: {
                            afterBody: function(context) {
                                const index = context[0].dataIndex;
                                const countryKeys = ['us', 'eu', 'uk', 'japan'];
                                const country = debtData[countryKeys[index]];
                                return [
                                    `Total Debt: ${country.total}${countryKeys[index] === 'japan' ? ' Trillion ¥' : countryKeys[index] === 'eu' ? ' Trillion €' : countryKeys[index] === 'uk' ? ' Trillion £' : ' Trillion $'}`,
                                    `Annual Change: ${country.change > 0 ? '+' : ''}${country.change}%`
                                ];
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Debt-to-GDP Ratio (%)',
                            color: chartColors.secondary
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: chartColors.secondary
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: chartColors.secondary
                        }
                    }
                }
            }
        });
    }

    // Create money supply chart
    createMoneySupplyChart() {
        const ctx = document.getElementById('moneySupplyChart');
        if (!ctx) return;

        const moneyData = economicData.moneySupply;
        const labels = moneyData.us.historical.map(item => item.date);

        this.charts.moneySupplyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'US M2 Supply (Trillions $)',
                        data: moneyData.us.historical.map(item => item.m2),
                        borderColor: '#DC3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'UK M4 Supply (Trillions £)',
                        data: moneyData.uk.historical.map(item => item.m4),
                        borderColor: '#007BFF',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'EU M3 Supply (Trillions €)',
                        data: moneyData.eu.historical.map(item => item.m3),
                        borderColor: '#28A745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        yAxisID: 'y2'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: chartColors.secondary,
                        bodyColor: chartColors.secondary,
                        borderColor: chartColors.primary,
                        borderWidth: 1
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'US M2 (Trillions $)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'UK M4 (Trillions £)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: false,
                        position: 'right'
                    }
                }
            }
        });
    }

    // Create QE timeline chart
    createQETimelineChart() {
        const ctx = document.getElementById('qeTimelineChart');
        if (!ctx) return;

        const qeData = economicData.monetaryPolicy.qeTimeline;
        
        this.charts.qeTimelineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['QE1', 'QE2', 'QE3', 'COVID QE', 'UK Initial', 'UK Extension', 'UK COVID', 'EU APP', 'EU PEPP', 'EU Resume'],
                datasets: [{
                    label: 'QE Purchases (Trillions)',
                    data: [
                        qeData.us[0].amount, qeData.us[1].amount, qeData.us[2].amount, qeData.us[3].amount,
                        qeData.uk[0].amount / 1000, qeData.uk[1].amount / 1000, qeData.uk[2].amount / 1000,
                        qeData.eu[0].amount, qeData.eu[1].amount, qeData.eu[2].amount
                    ],
                    backgroundColor: [
                        '#DC3545', '#DC3545', '#DC3545', '#DC3545', // US programs
                        '#007BFF', '#007BFF', '#007BFF', // UK programs
                        '#28A745', '#28A745', '#28A745' // EU programs
                    ],
                    borderColor: [
                        '#DC3545', '#DC3545', '#DC3545', '#DC3545',
                        '#007BFF', '#007BFF', '#007BFF',
                        '#28A745', '#28A745', '#28A745'
                    ],
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: chartColors.secondary,
                        bodyColor: chartColors.secondary,
                        borderColor: chartColors.primary,
                        borderWidth: 1,
                        callbacks: {
                            afterBody: function(context) {
                                const programs = [
                                    'US: 2008-2010', 'US: 2010-2011', 'US: 2012-2014', 'US: 2020-2021',
                                    'UK: 2009-2012', 'UK: 2016-2018', 'UK: 2020-2021',
                                    'EU: 2015-2018', 'EU: 2020-2022', 'EU: 2019-2022'
                                ];
                                return `Period: ${programs[context[0].dataIndex]}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'QE Purchases (Trillions)',
                            color: chartColors.secondary
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
        });
    }

    // Create commodity line chart
    createCommodityChart() {
        const ctx = document.getElementById('commodityChart');
        if (!ctx) return;

        // Simulated commodity data over time
        const commodityData = {
            gold: [1980, 2010, 2045, 2031.50],
            oil: [88.20, 89.15, 86.80, 87.45],
            wheat: [5.80, 6.10, 6.35, 6.23],
            copper: [8100, 8180, 8220, 8234]
        };

        const labels = ['Last Week', '3 Days Ago', 'Yesterday', 'Today'];

        this.charts.commodityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Gold ($/oz)',
                        data: commodityData.gold,
                        borderColor: '#FFD700',
                        backgroundColor: '#FFD70020',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Oil ($/barrel)',
                        data: commodityData.oil,
                        borderColor: '#8B4513',
                        backgroundColor: '#8B451320',
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Wheat ($/bushel)',
                        data: commodityData.wheat,
                        borderColor: '#DAA520',
                        backgroundColor: '#DAA52020',
                        yAxisID: 'y2'
                    },
                    {
                        label: 'Copper ($/MT)',
                        data: commodityData.copper,
                        borderColor: '#B87333',
                        backgroundColor: '#B8733320',
                        yAxisID: 'y3'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time Period'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Gold Price ($)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: false,
                        position: 'right'
                    },
                    y2: {
                        type: 'linear',
                        display: false,
                        position: 'right'
                    },
                    y3: {
                        type: 'linear',
                        display: false,
                        position: 'right'
                    }
                }
            }
        });
    }

    // Create inflation components pie chart
    createInflationComponentsPie() {
        const ctx = document.getElementById('inflationComponentsPie');
        if (!ctx) return;

        this.charts.inflationComponentsPie = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Food & Beverages', 'Housing', 'Transportation', 'Medical Care', 'Recreation', 'Education', 'Other'],
                datasets: [{
                    data: [18.2, 42.4, 16.8, 8.7, 6.1, 2.9, 4.9],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Create spending distribution pie chart
    createSpendingDistributionPie() {
        const ctx = document.getElementById('spendingDistributionPie');
        if (!ctx) return;

        this.charts.spendingDistributionPie = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Essential Goods', 'Services', 'Discretionary', 'Savings & Investment'],
                datasets: [{
                    data: [35, 28, 22, 15],
                    backgroundColor: [
                        chartColors.danger,
                        chartColors.primary,
                        chartColors.warning,
                        chartColors.success
                    ],
                    borderWidth: 3,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Create performance radar chart
    createPerformanceRadar() {
        const ctx = document.getElementById('performanceRadar');
        if (!ctx) return;

        this.charts.performanceRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['GDP Growth', 'Employment', 'Price Stability', 'Trade Balance', 'Fiscal Health', 'Innovation'],
                datasets: [{
                    label: 'Current Performance',
                    data: [6.8, 8.2, 5.4, 7.1, 6.9, 8.5],
                    borderColor: chartColors.primary,
                    backgroundColor: chartColors.primaryTransparent,
                    borderWidth: 2,
                    pointBackgroundColor: chartColors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            stepSize: 2
                        }
                    }
                }
            }
        });
    }

    // Create live data stream chart
    createLiveDataChart() {
        const ctx = document.getElementById('liveDataChart');
        if (!ctx) return;

        const initialData = [];
        const labels = [];
        
        // Initialize with some random data points
        for (let i = 0; i < 20; i++) {
            labels.push('');
            initialData.push(Math.random() * 10 + 2);
        }

        this.charts.liveDataChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Live Inflation Indicator',
                    data: initialData,
                    borderColor: chartColors.primary,
                    backgroundColor: chartColors.primaryTransparent,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 750
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        filter: function(tooltipItem) {
                            return tooltipItem.dataIndex === tooltipItem.dataset.data.length - 1;
                        }
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Inflation Rate (%)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });

        // Start the live data stream
        this.startLiveDataStream();
    }

    // Start live data stream
    startLiveDataStream() {
        if (streamInterval) clearInterval(streamInterval);
        
        streamInterval = setInterval(() => {
            if (!isStreamPaused && this.charts.liveDataChart) {
                this.addLiveDataPoint();
            }
        }, 2000); // Update every 2 seconds
    }

    // Add new data point to live chart
    addLiveDataPoint() {
        const chart = this.charts.liveDataChart;
        const newValue = Math.random() * 8 + 1; // Random value between 1-9
        
        // Add new data point
        chart.data.datasets[0].data.push(newValue);
        chart.data.labels.push('');
        
        // Remove old data points (keep last 50)
        if (chart.data.datasets[0].data.length > 50) {
            chart.data.datasets[0].data.shift();
            chart.data.labels.shift();
        }
        
        chart.update('none'); // Update without animation for smooth streaming
        
        // Update UI elements
        this.updateStreamUI();
    }

    // Update stream UI elements
    updateStreamUI() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const countElement = document.getElementById('dataPointCount');
        const timeElement = document.getElementById('lastUpdateTime');
        
        if (timeElement) {
            timeElement.textContent = timeString;
        }
        
        if (countElement && this.charts.liveDataChart) {
            countElement.textContent = this.charts.liveDataChart.data.datasets[0].data.length;
        }
    }

    // Toggle stream pause/play
    toggleStream() {
        isStreamPaused = !isStreamPaused;
        const pauseBtn = document.getElementById('pauseStream');
        if (pauseBtn) {
            if (isStreamPaused) {
                pauseBtn.innerHTML = '<i data-lucide="play"></i> Resume';
            } else {
                pauseBtn.innerHTML = '<i data-lucide="pause"></i> Pause';
            }
            // Re-initialize lucide icons for the updated button
            lucide.createIcons();
        }
    }

    // Reset stream data
    resetStream() {
        if (this.charts.liveDataChart) {
            this.charts.liveDataChart.data.datasets[0].data = [];
            this.charts.liveDataChart.data.labels = [];
            
            // Add initial data points
            for (let i = 0; i < 20; i++) {
                this.charts.liveDataChart.data.labels.push('');
                this.charts.liveDataChart.data.datasets[0].data.push(Math.random() * 10 + 2);
            }
            
            this.charts.liveDataChart.update();
            this.updateStreamUI();
        }
    }
}

// Scroll-triggered animation observer
// Based on https://coolcssanimation.com/how-to-trigger-a-css-animation-on-scroll/
class ScrollAnimationManager {
    constructor() {
        this.initializeScrollAnimations();
    }

    initializeScrollAnimations() {
        const wrapper = document.getElementById("scroll-animation-wrapper");
        const className = "in-view";

        if (!wrapper) {
            console.warn('Scroll animation wrapper not found');
            return;
        }

        // Reset the class to ensure clean state
        wrapper.classList.remove(className);

        // Create intersection observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        wrapper.classList.add(className);
                    } else {
                        wrapper.classList.remove(className);
                    }
                });
            },
            {
                threshold: 0.5, // Trigger when 50% of element is visible
                rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
            }
        );

        observer.observe(wrapper);
    }
}

// Enhanced Navigation Manager
class NavigationManager {
    constructor() {
        this.initializeNavigation();
        this.initializeChartControls();
    }

    initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
    }

    initializeChartControls() {
        // Chart period controls
        document.querySelectorAll('.chart-control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                globalCharts.updateChartPeriod(period);
            });
        });

        // Stream controls
        const pauseBtn = document.getElementById('pauseStream');
        const resetBtn = document.getElementById('resetStream');

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                globalCharts.toggleStream();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                globalCharts.resetStream();
            });
        }
    }

    handleSmoothScroll(event) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Enhanced Card Manager with chart integration
class CardManager {
    constructor() {
        this.initializeCards();
    }

    initializeCards() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('click', this.handleCardClick.bind(this));
            card.addEventListener('keydown', this.handleCardKeydown.bind(this));
            card.setAttribute('tabindex', '0'); // Make cards focusable
        });
    }

    handleCardClick(event) {
        const card = event.currentTarget;
        const country = card.getAttribute('data-country');
        
        if (country && economicData.inflation[country]) {
            this.showDetailedInflationModal(country);
        }
        
        // Add visual feedback
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    handleCardKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleCardClick(event);
        }
    }

    showDetailedInflationModal(country) {
        const data = economicData.inflation[country];
        const countryNames = {
            uk: 'United Kingdom',
            eu: 'European Union',
            us: 'United States',
            global: 'Global'
        };

        const modalContent = `
            <div class="modal-overlay" id="inflationModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${countryNames[country]} - Detailed Inflation Data</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-stats">
                            <div class="stat-card">
                                <span class="stat-label">Current Rate</span>
                                <span class="stat-value">${data.current}%</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-label">Trend</span>
                                <span class="stat-value trend-${data.trend}">${data.trend}</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-label">12-Month High</span>
                                <span class="stat-value">${Math.max(...data.historical.map(d => d.value)).toFixed(1)}%</span>
                            </div>
                            <div class="stat-card">
                                <span class="stat-label">12-Month Low</span>
                                <span class="stat-value">${Math.min(...data.historical.map(d => d.value)).toFixed(1)}%</span>
                            </div>
                        </div>
                        <div class="modal-chart">
                            <canvas id="modalChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalContent);

        // Create chart in modal
        setTimeout(() => {
            this.createModalChart(country, data);
        }, 100);

        // Add styles if not already present
        if (!document.getElementById('modalStyles')) {
            const styles = document.createElement('style');
            styles.id = 'modalStyles';
            styles.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                }
                .modal-content {
                    background: white;
                    border-radius: 15px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid #eee;
                }
                .modal-header h3 {
                    margin: 0;
                    color: #2c3e50;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #7f8c8d;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .modal-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .stat-card {
                    display: flex;
                    flex-direction: column;
                    padding: 1rem;
                    background: #f8f9fa;
                    border-radius: 8px;
                    text-align: center;
                }
                .stat-label {
                    font-size: 0.9rem;
                    color: #6c757d;
                    margin-bottom: 0.5rem;
                }
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #2c3e50;
                }
                .trend-increasing { color: #dc3545; }
                .trend-decreasing { color: #28a745; }
                .trend-stable { color: #ffc107; }
                .trend-mixed { color: #6c757d; }
                .modal-chart {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 1rem;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    createModalChart(country, data) {
        const ctx = document.getElementById('modalChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.historical.map(item => {
                    const date = new Date(item.date + '-01');
                    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                }),
                datasets: [{
                    label: 'Inflation Rate (%)',
                    data: data.historical.map(item => item.value),
                    borderColor: chartColors.primary,
                    backgroundColor: chartColors.primaryTransparent,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Inflation Rate (%)'
                        }
                    }
                }
            }
        });
    }
}

// Enhanced Inflation Calculator
class InflationCalculator {
    constructor() {
        this.initializeCalculator();
    }

    initializeCalculator() {
        const calculateBtn = document.querySelector('.calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', this.calculateInflation.bind(this));
        }

        // Auto-calculate on input change
        const inputs = document.querySelectorAll('.calculator-form input');
        inputs.forEach(input => {
            input.addEventListener('input', this.calculateInflation.bind(this));
        });

        // Initial calculation
        this.calculateInflation();
    }

    calculateInflation() {
        const initialAmount = parseFloat(document.getElementById('initial-amount')?.value || 10000);
        const inflationRate = parseFloat(document.getElementById('inflation-rate')?.value || 3.5);
        const years = parseInt(document.getElementById('years')?.value || 10);

        if (isNaN(initialAmount) || isNaN(inflationRate) || isNaN(years)) {
            return;
        }

        // Calculate future value considering inflation
        const futureValue = initialAmount * Math.pow(1 + inflationRate / 100, years);
        const purchasingPowerLost = ((futureValue - initialAmount) / initialAmount) * 100;

        // Update display
        const futureValueElement = document.getElementById('future-value');
        const powerLostElement = document.getElementById('power-lost');

        if (futureValueElement) {
            futureValueElement.textContent = `$${futureValue.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            })}`;
        }

        if (powerLostElement) {
            powerLostElement.textContent = `${purchasingPowerLost.toFixed(1)}%`;
        }
    }
}

// Expert Quote Carousel
class ExpertQuoteCarousel {
    constructor() {
        this.currentQuote = 0;
        this.quotes = document.querySelectorAll('.expert-quote');
        this.initializeCarousel();
    }

    initializeCarousel() {
        if (this.quotes.length > 1) {
            setInterval(() => {
                this.nextQuote();
            }, 5000); // Change quote every 5 seconds
        }
    }

    nextQuote() {
        this.quotes[this.currentQuote].classList.remove('active');
        this.currentQuote = (this.currentQuote + 1) % this.quotes.length;
        this.quotes[this.currentQuote].classList.add('active');
    }
}

// Enhanced News Ticker Animation Control with Daily Updates
class NewsTickerManager {
    constructor() {
        this.newsDatabase = this.createNewsDatabase();
        this.currentNewsSet = [];
        this.lastUpdateDate = null;
        this.initializeTicker();
        this.updateDailyNews();
        this.startDailyUpdateCheck();
    }

    createNewsDatabase() {
        return {
            inflation: [
                "Global inflation reaches 18-month low as supply chains stabilize worldwide",
                "Core inflation metrics show persistent strength in services sector across major economies",
                "Food price inflation accelerates due to adverse weather conditions in key agricultural regions",
                "Energy inflation moderates as oil prices stabilize following geopolitical tensions",
                "Housing costs drive inflation higher in major metropolitan areas globally",
                "Medical care inflation outpaces general price increases for third consecutive month",
                "Transportation costs surge as fuel prices and vehicle shortages persist",
                "Wage-price spiral concerns emerge as labor markets remain tight globally",
                "Import price inflation eases as shipping costs normalize after pandemic disruptions",
                "Inflation expectations among consumers remain elevated despite recent moderation",
                "Base effects contribute to volatile inflation readings as pandemic comparisons fade",
                "Regional inflation disparities widen as local economic conditions diverge significantly"
            ],
            interestRates: [
                "Federal Reserve signals potential rate cuts amid growing recession concerns and cooling inflation",
                "European Central Bank maintains hawkish stance on monetary policy despite economic headwinds",
                "Bank of England pauses rate hikes as UK economy shows signs of slowing momentum",
                "Central bank coordination emerges as key theme in global monetary policy discussions",
                "Real interest rates turn positive for first time in three years across major economies",
                "Yield curve inversion deepens as short-term rates exceed long-term bond yields significantly",
                "Emerging market central banks face dollar strength pressures on domestic monetary policy",
                "Corporate borrowing costs reach highest levels since 2008 financial crisis peak",
                "Mortgage rates surge past 7% threshold, cooling housing markets in developed economies",
                "Central bank digital currencies gain momentum as policy tools for monetary transmission",
                "Forward guidance effectiveness questioned as market volatility persists despite clear communication",
                "Term structure shifts signal changing expectations for long-term monetary policy stance"
            ],
            quantitativeEasing: [
                "Federal Reserve balance sheet reduction continues at $95 billion monthly pace as QT program proceeds",
                "European Central Bank ends asset purchase program after 8 years of quantitative easing measures",
                "Bank of England completes £875 billion QE program, begins gradual balance sheet normalization",
                "Money supply growth slows dramatically as major central banks cease bond purchase programs",
                "QE exit strategies vary across regions as economic conditions and inflation pressures diverge",
                "Asset price distortions from QE unwind as central banks reduce market intervention significantly",
                "Corporate bond markets adjust to reduced central bank purchases under quantitative tightening",
                "Sovereign debt markets face liquidity challenges as QE support mechanisms are withdrawn",
                "Banking reserves decline as quantitative tightening reduces excess liquidity in financial system",
                "Mortgage-backed securities face pressure as Fed ends MBS purchase program completely",
                "International spillovers from QE unwinding create volatility in emerging market currencies",
                "Money velocity increases as QE-induced liquidity preference shifts back toward spending patterns",
                "Asset purchase program effectiveness debated as long-term economic impacts become apparent",
                "Central bank balance sheet composition shifts as emergency pandemic support measures expire",
                "Quantitative easing legacy effects persist in bond markets despite program terminations",
                "Money printing concerns resurface as inflation remains elevated despite QE program endings"
            ],
            monetary: [
                "Digital payment adoption accelerates, reshaping traditional monetary transmission mechanisms significantly",
                "Currency volatility increases as divergent monetary policies create cross-border capital flows",
                "Government bond markets experience unprecedented volatility amid shifting central bank policies",
                "Money supply growth moderates as central banks reduce accommodative monetary policy stance",
                "Banking sector profitability improves as net interest margins expand with higher rates",
                "Shadow banking system grows as traditional monetary policy transmission channels evolve",
                "International monetary coordination becomes critical as spillover effects intensify globally",
                "Fiscal-monetary policy coordination tested as government debt sustainability concerns mount",
                "Alternative monetary frameworks gain academic and policy attention amid conventional limits",
                "Reserve currency dynamics shift as geopolitical tensions reshape international monetary system",
                "Cryptocurrency regulation impacts monetary policy effectiveness as digital assets gain mainstream adoption",
                "M2 money supply contracts for first time since 1930s as Fed tightening takes effect"
            ],
            markets: [
                "Commodity markets experience heightened volatility as inflation hedging demand surges globally",
                "Bond market liquidity concerns emerge as central bank balance sheets begin normalization process",
                "Equity market valuations adjust to higher discount rates amid monetary policy tightening cycle",
                "Currency markets reflect divergent economic outlooks and monetary policy trajectories worldwide",
                "Real estate investment trusts face headwinds as interest rate sensitivity becomes prominent factor",
                "Gold prices surge as inflation hedge demand outweighs rising opportunity costs significantly",
                "Energy market dynamics shift as transition policies intersect with immediate supply constraints",
                "Agricultural commodity prices remain elevated due to climate and geopolitical supply disruptions",
                "Financial market fragmentation increases as regional economic conditions diverge substantially",
                "Derivatives markets expand as institutions seek protection against interest rate and inflation volatility",
                "Emerging market assets face pressure from developed market monetary policy normalization processes",
                "Market-based inflation expectations show divergence from survey measures, complicating policy interpretation"
            ]
        };
    }

    getDayOfYear() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }

    selectDailyNews() {
        const dayOfYear = this.getDayOfYear();
        const categories = Object.keys(this.newsDatabase);
        const selectedNews = [];

        // Use day of year as seed for consistent daily selection
        categories.forEach((category, index) => {
            const newsArray = this.newsDatabase[category];
            const newsIndex = (dayOfYear + index * 3) % newsArray.length;
            selectedNews.push(newsArray[newsIndex]);
        });

        // Add some randomization while maintaining consistency for the day
        const additionalNewsIndex = (dayOfYear * 7) % this.newsDatabase.inflation.length;
        selectedNews.push(this.newsDatabase.inflation[additionalNewsIndex]);

        return selectedNews;
    }

    updateDailyNews() {
        const today = new Date().toDateString();
        
        if (this.lastUpdateDate !== today) {
            this.currentNewsSet = this.selectDailyNews();
            this.lastUpdateDate = today;
            this.updateTickerContent();
            
            // Store in localStorage for persistence
            localStorage.setItem('brr-news-ticker-date', today);
            localStorage.setItem('brr-news-ticker-content', JSON.stringify(this.currentNewsSet));
            
            console.log('Daily news ticker updated for:', today);
        }
    }

    loadStoredNews() {
        const storedDate = localStorage.getItem('brr-news-ticker-date');
        const storedContent = localStorage.getItem('brr-news-ticker-content');
        const today = new Date().toDateString();

        if (storedDate === today && storedContent) {
            this.currentNewsSet = JSON.parse(storedContent);
            this.lastUpdateDate = storedDate;
            return true;
        }
        return false;
    }

    updateTickerContent() {
        const tickerContent = document.querySelector('.ticker-content');
        if (tickerContent && this.currentNewsSet.length > 0) {
            // Clear existing content
            tickerContent.innerHTML = '';
            
            // Add new news items
            this.currentNewsSet.forEach(newsItem => {
                const tickerItem = document.createElement('div');
                tickerItem.className = 'ticker-item';
                tickerItem.textContent = newsItem;
                tickerContent.appendChild(tickerItem);
            });

            // Restart animation
            tickerContent.style.animation = 'none';
            tickerContent.offsetHeight; // Trigger reflow
            tickerContent.style.animation = 'scroll-ticker 40s linear infinite';
        }
    }

    startDailyUpdateCheck() {
        // Check for updates every hour
        setInterval(() => {
            this.updateDailyNews();
        }, 60 * 60 * 1000);

        // Also check at midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 1, 0, 0); // 00:01 AM

        const msUntilTomorrow = tomorrow.getTime() - now.getTime();
        setTimeout(() => {
            this.updateDailyNews();
            // Set up daily interval after first midnight update
            setInterval(() => {
                this.updateDailyNews();
            }, 24 * 60 * 60 * 1000);
        }, msUntilTomorrow);
    }

    initializeTicker() {
        // Load stored news first
        if (!this.loadStoredNews()) {
            this.updateDailyNews();
        } else {
            this.updateTickerContent();
        }

        const ticker = document.querySelector('.ticker-content');
        if (ticker) {
            // Pause animation on hover
            ticker.addEventListener('mouseenter', () => {
                ticker.style.animationPlayState = 'paused';
            });

            ticker.addEventListener('mouseleave', () => {
                ticker.style.animationPlayState = 'running';
            });

            // Add click handler for manual refresh
            ticker.addEventListener('click', () => {
                this.manualRefresh();
            });
        }

        // Add visual indicator for daily updates
        this.addUpdateIndicator();
    }

    manualRefresh() {
        const categories = Object.keys(this.newsDatabase);
        const randomNews = [];
        
        // Get random news items for immediate refresh
        categories.forEach(category => {
            const newsArray = this.newsDatabase[category];
            const randomIndex = Math.floor(Math.random() * newsArray.length);
            randomNews.push(newsArray[randomIndex]);
        });

        this.currentNewsSet = randomNews;
        this.updateTickerContent();
        
        // Show refresh indicator
        this.showRefreshIndicator();
    }

    addUpdateIndicator() {
        const tickerContainer = document.querySelector('.ticker-container');
        if (tickerContainer && !document.querySelector('.ticker-update-time')) {
            const updateTime = document.createElement('div');
            updateTime.className = 'ticker-update-time';
            updateTime.innerHTML = `<i data-lucide="clock"></i> Updated: ${new Date().toLocaleDateString()}`;
            tickerContainer.appendChild(updateTime);
            
            // Initialize lucide icons for the new element
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    showRefreshIndicator() {
        const tickerContainer = document.querySelector('.ticker-container');
        if (tickerContainer) {
            // Create temporary refresh indicator
            const refreshIndicator = document.createElement('div');
            refreshIndicator.textContent = 'NEWS REFRESHED';
            refreshIndicator.style.cssText = `
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: #28a745;
                color: white;
                padding: 0.3rem 1rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 600;
                z-index: 1000;
                animation: fadeInOut 2s ease-in-out;
            `;
            
            tickerContainer.style.position = 'relative';
            tickerContainer.appendChild(refreshIndicator);
            
            // Add CSS animation if not exists
            if (!document.querySelector('#refresh-animation-style')) {
                const style = document.createElement('style');
                style.id = 'refresh-animation-style';
                style.textContent = `
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
                        50% { opacity: 1; transform: translateX(-50%) translateY(0); }
                        100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                if (refreshIndicator.parentNode) {
                    refreshIndicator.remove();
                }
            }, 2000);
        }
    }
}

// Enhanced News Cards Interaction
class NewsManager {
    constructor() {
        this.initializeNewsCards();
    }

    initializeNewsCards() {
        const newsCards = document.querySelectorAll('.news-card');
        
        newsCards.forEach(card => {
            card.addEventListener('click', this.handleNewsCardClick.bind(this));
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.handleNewsCardClick(event);
                }
            });
        });
    }

    handleNewsCardClick(event) {
        const card = event.currentTarget;
        const title = card.querySelector('.news-title')?.textContent;
        const category = card.querySelector('.news-category')?.textContent;
        
        // Placeholder for news article expansion or navigation
        console.log(`Opening news article: ${title} (${category})`);
        
        // Add click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }
}

// Educational Cards Enhancement
class EducationManager {
    constructor() {
        this.initializeEducationCards();
    }

    initializeEducationCards() {
        const learnMoreLinks = document.querySelectorAll('.learn-more');
        
        learnMoreLinks.forEach(link => {
            link.addEventListener('click', this.handleLearnMore.bind(this));
        });
    }

    handleLearnMore(event) {
        event.preventDefault();
        const card = event.target.closest('.education-card');
        const topic = card.querySelector('h3')?.textContent;
        
        // Placeholder for educational content expansion
        alert(`Learn more about: ${topic}\n\nThis would typically open a detailed educational page or modal with comprehensive information about ${topic.toLowerCase()}.`);
    }
}

// Performance optimization: Use requestAnimationFrame for smooth animations
class PerformanceManager {
    constructor() {
        this.initializePerformanceOptimizations();
    }

    initializePerformanceOptimizations() {
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Scroll-based optimizations can be added here
            }, 16); // ~60fps
        }, { passive: true });

        // Preload critical images
        this.preloadCriticalImages();
    }

    preloadCriticalImages() {
        const criticalImages = [
            'assets/logo.png',
            'assets/bar-chart.png'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
}

// Debt Clock Manager
class DebtClockManager {
    constructor() {
        this.startTime = Date.now();
        this.debtData = economicData.debtClocks;
        this.isActive = true;
        
        this.initializeDebtClocks();
        this.startDebtCounters();
    }

    initializeDebtClocks() {
        // Initialize with base amounts
        this.updateDebtDisplay('global', this.debtData.global.baseAmount);
        this.updateDebtDisplay('us', this.debtData.us.baseAmount);
        this.updateDebtDisplay('uk', this.debtData.uk.baseAmount);
        
        // Update static information
        this.updateStaticStats();
        
        console.log('Debt clocks initialized with real-time tracking');
    }

    updateStaticStats() {
        // Global stats
        document.getElementById('globalDebtPerSecond').textContent = 
            `+$${this.formatNumber(this.debtData.global.perSecond)}`;
        document.getElementById('globalDebtPerCapita').textContent = 
            `$${this.formatNumber(Math.round(this.debtData.global.baseAmount / this.debtData.global.population))}`;
        document.getElementById('globalDebtGDPRatio').textContent = 
            `${Math.round((this.debtData.global.baseAmount / this.debtData.global.gdp) * 100)}%`;

        // US stats
        document.getElementById('usDebtPerSecond').textContent = 
            `+$${this.formatNumber(this.debtData.us.perSecond)}`;
        document.getElementById('usDebtPerCitizen').textContent = 
            `$${this.formatNumber(Math.round(this.debtData.us.baseAmount / this.debtData.us.population))}`;
        document.getElementById('usDebtGDPRatio').textContent = 
            `${Math.round((this.debtData.us.baseAmount / this.debtData.us.gdp) * 100)}%`;

        // UK stats
        document.getElementById('ukDebtPerSecond').textContent = 
            `+£${this.formatNumber(this.debtData.uk.perSecond)}`;
        document.getElementById('ukDebtPerCitizen').textContent = 
            `£${this.formatNumber(Math.round(this.debtData.uk.baseAmount / this.debtData.uk.population))}`;
        document.getElementById('ukDebtGDPRatio').textContent = 
            `${Math.round((this.debtData.uk.baseAmount / this.debtData.uk.gdp) * 100)}%`;
    }

    startDebtCounters() {
        setInterval(() => {
            if (!this.isActive) return;
            
            const secondsElapsed = Math.floor((Date.now() - this.startTime) / 1000);
            
            // Calculate current debt amounts
            const globalCurrent = this.debtData.global.baseAmount + (secondsElapsed * this.debtData.global.perSecond);
            const usCurrent = this.debtData.us.baseAmount + (secondsElapsed * this.debtData.us.perSecond);
            const ukCurrent = this.debtData.uk.baseAmount + (secondsElapsed * this.debtData.uk.perSecond);
            
            // Update displays
            this.updateDebtDisplay('global', globalCurrent);
            this.updateDebtDisplay('us', usCurrent);
            this.updateDebtDisplay('uk', ukCurrent);
            
        }, 1000); // Update every second
    }

    updateDebtDisplay(country, amount) {
        const element = document.getElementById(`${country}DebtAmount`);
        if (element) {
            element.textContent = this.formatDebtAmount(amount);
        }
    }

    formatDebtAmount(amount) {
        // Format large numbers with commas
        return Math.floor(amount).toLocaleString('en-US');
    }

    formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    pauseCounters() {
        this.isActive = false;
    }

    resumeCounters() {
        this.isActive = true;
        this.startTime = Date.now(); // Reset start time to current
    }

    // Add visibility change handler to pause when tab is not active
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseCounters();
        } else {
            this.resumeCounters();
        }
    }
}

// Initialize all managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Enable smooth scrolling first
    enableSmoothScrolling();
    
    // Initialize all managers
    new ScrollAnimationManager();
    new NavigationManager();
    new PerformanceManager();
    new InflationCalculator();
    new ExpertQuoteCarousel();
    new NewsTickerManager();
    new NewsManager();
    new EducationManager();
    
    // Initialize charts (with delay to ensure DOM is ready)
    setTimeout(() => {
        globalCharts = new ChartManager();
        new CardManager(); // Initialize after charts are ready
        
        // Initialize debt clock manager
        const debtClockManager = new DebtClockManager();
        
        // Handle visibility changes for debt clock optimization
        document.addEventListener('visibilitychange', () => {
            debtClockManager.handleVisibilityChange();
        });
    }, 100);
    
    console.log('Brr News fully initialized with dynamic charts and enhanced features!');
    
    // Add startup animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 200);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (streamInterval) {
        clearInterval(streamInterval);
    }
});