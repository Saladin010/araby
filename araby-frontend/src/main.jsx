import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import translations from './locales/translations'

// Create a client for React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <LanguageProvider translations={translations}>
                        <App />
                        <Toaster
                            position="top-center"
                            reverseOrder={false}
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#fff',
                                    color: '#1E293B',
                                    fontFamily: 'Cairo, sans-serif',
                                    direction: 'rtl',
                                    textAlign: 'right',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10B981',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#EF4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </LanguageProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
)
