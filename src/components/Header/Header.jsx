import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WalletConnect from '../WalletConnect/WalletConnect';
import Logo from '../Logo';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Launchpad', path: '/presale' },
    { name: 'Airdrops', path: '/airdrop' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-content">
        <Link to="/" className="brand" onClick={() => setIsMenuOpen(false)}>
          <Logo />
          <span className="brand-text">CHRONO<span className="text-primary">MINT</span></span>
        </Link>

        <nav className="nav-main">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div layoutId="nav-underline" className="nav-underline" />
              )}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div className="wallet-wrapper">
            <WalletConnect />
          </div>

          <button
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="hamburger" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="mobile-nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mobile-wallet">
              <div className="wallet-label">Wallet</div>
              <WalletConnect />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
