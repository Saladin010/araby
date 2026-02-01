import { useEffect, useRef } from 'react'

/**
 * Custom hook for animating numbers with count-up effect
 */
export const useCountUp = (end, duration = 2000, start = 0) => {
    const countRef = useRef(null)

    useEffect(() => {
        if (!countRef.current) return

        let startTime = null
        const element = countRef.current

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(start + (end - start) * easeOut)

            element.textContent = current.toLocaleString('ar-EG')

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                element.textContent = end.toLocaleString('ar-EG')
            }
        }

        requestAnimationFrame(animate)
    }, [end, duration, start])

    return countRef
}

/**
 * Custom hook for intersection observer (scroll animations)
 */
export const useIntersectionObserver = (options = {}) => {
    const elementRef = useRef(null)
    const observerRef = useRef(null)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        observerRef.current = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                element.classList.add('fade-in')
            }
        }, {
            threshold: 0.1,
            ...options,
        })

        observerRef.current.observe(element)

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [options])

    return elementRef
}
