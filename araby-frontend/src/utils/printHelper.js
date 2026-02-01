/**
 * Print Helper Utilities
 * Functions to handle printing reports
 */

/**
 * Print specific element
 */
export const printElement = (elementId) => {
    try {
        const element = document.getElementById(elementId)
        if (!element) {
            throw new Error(`Element with id "${elementId}" not found`)
        }

        // Create print window
        const printWindow = window.open('', '', 'height=600,width=800')

        // Get all stylesheets
        const styles = Array.from(document.styleSheets)
            .map(styleSheet => {
                try {
                    return Array.from(styleSheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('\n')
                } catch (e) {
                    // Handle CORS issues with external stylesheets
                    return ''
                }
            })
            .join('\n')

        // Write content
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>طباعة التقرير</title>
                <style>
                    ${styles}
                    
                    @media print {
                        body {
                            margin: 0;
                            padding: 20px;
                        }
                        
                        @page {
                            size: A4;
                            margin: 20mm;
                        }
                        
                        /* Hide elements that shouldn't be printed */
                        button,
                        .no-print {
                            display: none !important;
                        }
                        
                        /* Ensure charts and images print correctly */
                        canvas {
                            max-width: 100%;
                            height: auto !important;
                        }
                        
                        /* Page break handling */
                        .page-break {
                            page-break-after: always;
                        }
                        
                        /* Prevent breaking inside elements */
                        .no-break {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>
            <body>
                ${element.innerHTML}
            </body>
            </html>
        `)

        printWindow.document.close()

        // Wait for content to load then print
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.focus()
                printWindow.print()
                printWindow.close()
            }, 250)
        }

        return { success: true }
    } catch (error) {
        console.error('Print error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Print current page
 */
export const printCurrentPage = () => {
    try {
        window.print()
        return { success: true }
    } catch (error) {
        console.error('Print error:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Add print styles to document
 */
export const addPrintStyles = () => {
    const styleId = 'print-styles'

    // Check if styles already exist
    if (document.getElementById(styleId)) {
        return
    }

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
        @media print {
            /* Hide navigation and non-essential elements */
            nav,
            aside,
            .sidebar,
            .no-print {
                display: none !important;
            }

            /* Ensure content fills the page */
            main,
            .print-content {
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            /* Chart adjustments */
            canvas {
                max-width: 100% !important;
                height: auto !important;
            }

            /* Table adjustments */
            table {
                width: 100%;
                border-collapse: collapse;
            }

            table th,
            table td {
                border: 1px solid #ddd;
                padding: 8px;
            }

            /* Page breaks */
            .page-break {
                page-break-after: always;
            }

            .no-break {
                page-break-inside: avoid;
            }

            /* Colors for print */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    `

    document.head.appendChild(style)
}

// Add print styles on module load
if (typeof window !== 'undefined') {
    addPrintStyles()
}

export default {
    printElement,
    printCurrentPage,
    addPrintStyles
}
