/**
 * Chart Helper Functions
 * Chart.js configurations for different chart types
 */

/**
 * Common chart options (RTL support)
 */
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            rtl: true,
            textDirection: 'rtl',
            labels: {
                font: {
                    family: 'Cairo, sans-serif',
                    size: 12
                },
                padding: 15,
                usePointStyle: true
            }
        },
        tooltip: {
            rtl: true,
            textDirection: 'rtl',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            cornerRadius: 8,
            titleFont: {
                family: 'Cairo, sans-serif',
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                family: 'Cairo, sans-serif',
                size: 12
            }
        }
    }
}

/**
 * Line chart configuration
 */
export const getLineChartConfig = (data, options = {}) => {
    return {
        type: 'line',
        data,
        options: {
            ...commonOptions,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                }
            },
            ...options
        }
    }
}

/**
 * Pie chart configuration
 */
export const getPieChartConfig = (data, options = {}) => {
    return {
        type: 'pie',
        data,
        options: {
            ...commonOptions,
            ...options
        }
    }
}

/**
 * Doughnut chart configuration
 */
export const getDoughnutChartConfig = (data, options = {}) => {
    return {
        type: 'doughnut',
        data,
        options: {
            ...commonOptions,
            cutout: '70%',
            ...options
        }
    }
}

/**
 * Bar chart configuration
 */
export const getBarChartConfig = (data, options = {}) => {
    return {
        type: 'bar',
        data,
        options: {
            ...commonOptions,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                }
            },
            ...options
        }
    }
}

/**
 * Horizontal bar chart configuration
 */
export const getHorizontalBarChartConfig = (data, options = {}) => {
    return {
        type: 'bar',
        data,
        options: {
            ...commonOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                }
            },
            ...options
        }
    }
}

/**
 * Area chart configuration (line with fill)
 */
export const getAreaChartConfig = (data, options = {}) => {
    return {
        type: 'line',
        data: {
            ...data,
            datasets: data.datasets.map(dataset => ({
                ...dataset,
                fill: true,
                backgroundColor: dataset.backgroundColor || 'rgba(59, 130, 246, 0.1)',
                borderColor: dataset.borderColor || 'rgb(59, 130, 246)',
                tension: 0.4
            }))
        },
        options: {
            ...commonOptions,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            family: 'Cairo, sans-serif'
                        }
                    }
                }
            },
            ...options
        }
    }
}

/**
 * Color palette for charts
 */
export const chartColors = {
    primary: 'rgb(59, 130, 246)',
    success: 'rgb(34, 197, 94)',
    warning: 'rgb(251, 146, 60)',
    danger: 'rgb(239, 68, 68)',
    info: 'rgb(14, 165, 233)',
    purple: 'rgb(168, 85, 247)',
    pink: 'rgb(236, 72, 153)',
    indigo: 'rgb(99, 102, 241)',

    // Transparent versions
    primaryAlpha: 'rgba(59, 130, 246, 0.1)',
    successAlpha: 'rgba(34, 197, 94, 0.1)',
    warningAlpha: 'rgba(251, 146, 60, 0.1)',
    dangerAlpha: 'rgba(239, 68, 68, 0.1)',
    infoAlpha: 'rgba(14, 165, 233, 0.1)',
    purpleAlpha: 'rgba(168, 85, 247, 0.1)',
    pinkAlpha: 'rgba(236, 72, 153, 0.1)',
    indigoAlpha: 'rgba(99, 102, 241, 0.1)',
}

/**
 * Get color palette for multiple datasets
 */
export const getColorPalette = (count) => {
    const colors = [
        chartColors.primary,
        chartColors.success,
        chartColors.warning,
        chartColors.danger,
        chartColors.info,
        chartColors.purple,
        chartColors.pink,
        chartColors.indigo
    ]

    return Array.from({ length: count }, (_, i) => colors[i % colors.length])
}

/**
 * Get background colors (transparent)
 */
export const getBackgroundColors = (count) => {
    const colors = [
        chartColors.primaryAlpha,
        chartColors.successAlpha,
        chartColors.warningAlpha,
        chartColors.dangerAlpha,
        chartColors.infoAlpha,
        chartColors.purpleAlpha,
        chartColors.pinkAlpha,
        chartColors.indigoAlpha
    ]

    return Array.from({ length: count }, (_, i) => colors[i % colors.length])
}

export default {
    getLineChartConfig,
    getPieChartConfig,
    getDoughnutChartConfig,
    getBarChartConfig,
    getHorizontalBarChartConfig,
    getAreaChartConfig,
    chartColors,
    getColorPalette,
    getBackgroundColors
}
