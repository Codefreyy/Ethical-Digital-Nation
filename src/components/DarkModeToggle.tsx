import useDarkMode from "@/hooks/useDarkMode"
import { Moon, Sun } from "lucide-react"
import { useRef } from "react"

function DarkModeToggle() {
  const togglerRef = useRef<HTMLButtonElement>(null)
  const { isDark, setIsDark } = useDarkMode() // get the dark mode state and setter function from the custom hook

  const handleToggleDarkMode = () => {
    togglerRef.current?.blur() // remove focus from the button after clicking
    setIsDark(!isDark)
  }
  return (
    // <div className="w-8 h-8 flex items-center">
    <button
      ref={togglerRef}
      className=" dark:text-slate-500 hover:cursor-pointer"
      onClick={() => {
        handleToggleDarkMode() // when the button is clicked, toggle the dark mode state
      }}
    >
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
    // </div>
  )
}

export default DarkModeToggle
