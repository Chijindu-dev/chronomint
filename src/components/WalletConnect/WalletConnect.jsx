import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../../utils/WalletContext';

const WalletConnect = () => {
  const { account, connect, disconnect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatAddress = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="wallet-wrapper" onMouseLeave={() => setIsOpen(false)}>
      <AnimatePresence mode="wait">
        {!account ? (
          <motion.button
            key="connect"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--primary-glow)' }}
            whileTap={{ scale: 0.95 }}
            className="premium-connect-btn font-tech"
            onClick={connect}
          >
            <span className="btn-shine" />
            <div className="btn-content">
              <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Connect Wallet</span>
            </div>
          </motion.button>
        ) : (
          <div className="relative">
            <motion.div
              key="connected"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`premium-account-pill ${isOpen ? 'active' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsOpen(true)}
            >
              <div className="status-orb-group">
                <div className="status-orb" />
                <div className="status-orb-pulse" />
              </div>
              <div className="address-display font-tech">
                {formatAddress(account)}
              </div>
              <svg className={`chevron-icon ${isOpen ? 'up' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="wallet-dropdown card-glass"
                >
                  <div className="dropdown-header">
                    <span className="label-caps">Connected Wallet</span>
                    <button className="copy-btn" onClick={handleCopy}>
                      {copied ? 'Copied!' : 'Copy Address'}
                    </button>
                  </div>

                  <div className="dropdown-menu">
                    <a
                      href={`https://explorer.tempo.network/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="menu-item"
                    >
                      <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      <span>View on Explorer</span>
                    </a>

                    <button className="menu-item disconnect-item" onClick={disconnect}>
                      <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .wallet-wrapper { position: relative; z-index: 1000; }
        .relative { position: relative; }
        
        .premium-connect-btn {
          position: relative;
          height: 48px;
          padding: 0 28px;
          background: var(--btn-gradient);
          color: #000;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          overflow: hidden;
          display: flex;
          align-items: center;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lock-icon { width: 16px; height: 16px; }

        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: 0.6s;
        }

        .premium-connect-btn:hover .btn-shine {
          left: 100%;
          transition: 0.6s;
        }

        .premium-account-pill {
          height: 48px;
          padding: 0 16px 0 20px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border);
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: 0.3s;
        }

        .premium-account-pill:hover, .premium-account-pill.active {
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--primary-glow);
        }

        .chevron-icon { width: 16px; height: 16px; color: var(--text-dim); transition: 0.3s; }
        .chevron-icon.up { transform: rotate(180deg); }

        .wallet-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 240px;
          background: rgba(10, 10, 15, 0.95) !important;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          z-index: 1001;
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .copy-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .dropdown-menu { display: flex; flex-direction: column; gap: 8px; }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          color: var(--text-dim);
          text-decoration: none;
          font-size: 0.9rem;
          transition: 0.2s;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .menu-item:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        .disconnect-item { color: #ff4d4d; }
        .disconnect-item:hover { background: rgba(255, 77, 77, 0.1); color: #ff4d4d; }

        .menu-icon { width: 18px; height: 18px; }

        .status-orb-group { position: relative; width: 10px; height: 10px; }
        .status-orb { width: 100%; height: 100%; background: #00ff88; border-radius: 50%; box-shadow: 0 0 10px #00ff88; z-index: 2; position: relative; }
        .status-orb-pulse {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: #00ff88; border-radius: 50%; animation: orb-pulse 2s infinite; z-index: 1;
        }

        @keyframes orb-pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }

        .address-display { color: #fff; font-size: 0.9rem; letter-spacing: 0.02em; }
        
        /* Mobile-specific styles */
        @media (max-width: 639px) {
          .wallet-dropdown {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: calc(100% - 32px);
            max-width: 300px;
            z-index: 1001;
          }
          
          .premium-account-pill {
            padding: 0 12px 0 16px;
            height: 44px;
          }
          
          .premium-connect-btn {
            height: 44px;
            padding: 0 20px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WalletConnect;
