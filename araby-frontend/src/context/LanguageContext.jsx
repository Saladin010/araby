import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
    const context = useContext(LanguageContext)
    console.log('📘 useLanguage called, context:', context)
    if (!context) {
        // Return null instead of throwing to allow safe usage
        return null
    }
    return context
}

export const LanguageProvider = ({ children, translations }) => {
    console.log('📗 LanguageProvider MOUNTING')
    console.log('📗 Translations:', translations ? 'Available' : 'Missing')

    // Get initial language from localStorage or default to Arabic
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const saved = localStorage.getItem('appLanguage')
        console.log('📗 Saved language:', saved)
        return saved || 'ar'
    })

    // Toggle between Arabic and English
    const toggleLanguage = () => {
        console.log('🟡 toggleLanguage CALLED')
        setCurrentLanguage(prev => {
            const newLang = prev === 'ar' ? 'en' : 'ar'
            console.log('🟡 Language changing from', prev, 'to', newLang)
            localStorage.setItem('appLanguage', newLang)
            return newLang
        })
    }

    // Translation function
    const t = (key) => {
        const keys = key.split('.')
        let value = translations[currentLanguage]

        for (const k of keys) {
            value = value?.[k]
        }

        return value || key
    }

    // Update HTML attributes when language changes
    useEffect(() => {
        console.log('🟣 Language changed to:', currentLanguage)
        const direction = currentLanguage === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.setAttribute('dir', direction)
        document.documentElement.setAttribute('lang', currentLanguage)
        console.log('🟣 HTML dir set to:', direction)
    }, [currentLanguage])

    const value = {
        currentLanguage,
        toggleLanguage,
        t,
        isRTL: currentLanguage === 'ar'
    }

    console.log('📗 LanguageProvider value:', value)

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

export default LanguageContext
