import Link from 'next/link'

const ThemeSwitcher = () => {
  if (typeof window !== 'undefined') {
    const { useState } = require('react')
    const [theme, setTheme] = useState('light')

    const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
      <button className='' onClick={toggleTheme}>
        Cambiar a {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
      </button>
    )
  }
  return null
}

const Header = () => {
  return (
    <nav className="layout flex items-center justify-between py-4">
      <ThemeSwitcher />
      <ul className="flex items-center justify-between space-x-3 text-xs md:space-x-4 md:text-base">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/#posts" className="hover:underline">
            Posts
          </Link>
        </li>
        <li>
          <Link href="/#projects" className="hover:underline">
            Projects
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Header