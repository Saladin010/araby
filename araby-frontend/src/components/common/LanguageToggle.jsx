import { Languages } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { motion } from 'framer-motion'

/**
 * LanguageToggle Component
 * Button to toggle between Arabic and English
 */
const LanguageToggle = ({ className = '' }) => {
    console.log('🔵 LanguageToggle RENDERING')

    const context = useLanguage()
    console.log('🔵 Context:', context)

    // If no context, don't render the button
    if (!context) {
        console.warn('⚠️ LanguageToggle: No LanguageProvider found')
        return null
    }

    const { currentLanguage, toggleLanguage, t } = context
    console.log('🔵 Current Language:', currentLanguage)

    const handleClick = () => {
        console.log('🟢 Language button clicked!')
        console.log('🟢 Before toggle:', currentLanguage)
        toggleLanguage()
        console.log('🟢 Toggle function called')
    }

    return (
        <motion.button
            onClick={handleClick}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-background ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={t('common.language')}
        >
            <Languages className="w-5 h-5" />
            <span className="text-sm font-medium">
                {currentLanguage === 'ar' ? 'EN' : 'عربي'}
            </span>
        </motion.button>
    )
}

export default LanguageToggle
