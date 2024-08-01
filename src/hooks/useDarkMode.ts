import { useEffect, useState } from 'react'

const matchDark = '(prefers-color-scheme: dark)' // store the media query in a variable

export default function useDarkMode() {
    const [isDark, setIsDark] = useState(
        () => {
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia(matchDark).matches;
            }
            return false; // Default value if window is not available
        }
    ) // check if the user prefers dark mode
    useEffect(() => {
        const mediaQuery = window.matchMedia(matchDark)

        const handleChange = () => {
            setIsDark(mediaQuery.matches) // update the state based on the media query
        }

        mediaQuery.addEventListener('change', handleChange) // listen for changes in the media query
        return () => mediaQuery.removeEventListener('change', handleChange) // clean up the event listener
    }, [setIsDark, isDark])

    useEffect(() => {
        if (isDark) {
            // add or remove the dark class based on the state
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

    return { isDark, setIsDark }
}
