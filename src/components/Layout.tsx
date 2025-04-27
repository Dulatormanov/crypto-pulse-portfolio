import React from "react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-secondary">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">CryptoWatcher</Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className={`hover:text-primary transition-colors ${
                    location.pathname === "/" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Markets
                </Link>
              </li>
              <li>
                <Link 
                  to="/portfolio" 
                  className={`hover:text-primary transition-colors ${
                    location.pathname === "/portfolio" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Portfolio
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          {children}
        </div>
      </main>
      <footer className="border-t border-secondary py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CryptoWatcher. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
