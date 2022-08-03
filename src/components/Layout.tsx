import { createContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import HomeDark from "../assets/home-dark.svg";
import HomeLight from "../assets/home-light.svg";
import WalletDark from "../assets/wallet-dark.svg";
import WalletLight from "../assets/wallet-light.svg";
import SunLight from "../assets/sun-light.svg";
import SunDark from "../assets/sun-dark.svg";

export const ThemeContext = createContext('dark');

export default function Layout() {
  const location = useLocation();

  const [theme, setTheme] = useState<string>('dark');

  return (
    <ThemeContext.Provider value={theme}>
      <div className={theme}>
        <div className="dark:bg-black-c dark:text-white min-h-screen">
          <div className="shadow-lg">
            <nav className="container mx-auto flex justify-between items-center">
              <div className="mx-auto flex justify-center">
                <Link to="home" className={`flex items-center hover:bg-gray-300 dark:hover:bg-gray-900 p-5 ${(location.pathname === '/' || location.pathname === '/home') && 'pb-4 border-b-4 border-green-400'}`}>
                  <img src={theme === 'light' ? HomeDark : HomeLight} className="w-4 mr-3" alt="home" />
                  Home
                </Link>
                <Link to="wallet" className={`flex items-center hover:bg-gray-300 dark:hover:bg-gray-900 p-5 ${location.pathname === '/wallet' && 'pb-4 border-b-4 border-green-400'}`}>
                  <img src={theme === 'light' ? WalletDark : WalletLight} className="w-4 mr-3" alt="wallet" />
                  Wallet
                </Link>
              </div>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                <img src={theme === 'dark' ? SunLight : SunDark} alt="theme" className="w-8" />
              </button>
            </nav>
          </div>
          <div className="container mx-auto content">
            <Outlet />
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}