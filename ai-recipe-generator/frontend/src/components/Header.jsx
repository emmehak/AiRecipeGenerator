import React, { useState, useEffect } from "react";
import { ChefHat, Sparkles } from "lucide-react";

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false); // Scrolling down
      } else {
        setShowHeader(true); // Scrolling up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`bg-white/60 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-50 transform transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-bounce" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                AI Recipe Generator
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Cook smart with AI-powered recipes
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2 shadow-inner">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span>AI Chef Online</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
