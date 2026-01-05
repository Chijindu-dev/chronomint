import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountdownTimer from '../../components/CountdownTimer/CountdownTimer';

const Home = () => {
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    const handleDataRefresh = (event) => {
      const { action } = event.detail || {};
      if (action === 'purchase' || action === 'claim') {
        setShowNotification(true);
        // Hide notification after 5 seconds
        setTimeout(() => setShowNotification(false), 5000);
      }
    };
    
    window.addEventListener('dataRefresh', handleDataRefresh);
    
    return () => {
      window.removeEventListener('dataRefresh', handleDataRefresh);
    };
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="home-root">
      {/* Notification for successful transactions */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="notification-toast"
        >
          <div className="notification-content">
            <div className="notification-icon">✓</div>
            <div className="notification-text">
              Transaction successful! Check your dashboard for updated balances.
            </div>
            <button 
              className="notification-close"
              onClick={() => setShowNotification(false)}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Visual background elements */}
      <div className="glow-overlay" style={{ top: '10%', left: '15%', width: '400px', height: '400px', background: 'var(--primary-glow)' }} />
      <div className="glow-overlay" style={{ bottom: '10%', right: '10%', width: '500px', height: '500px', background: 'var(--secondary-glow)' }} />

      <section className="hero-section">
        <motion.div
          className="container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="badge-pill">
            <span className="dot" />
            Live on Tempo Mainnet
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-title">
            The Institutional Layer for <br />
            <span className="text-gradient">Time-Locked Assets</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-subtext">
            ChronoMint protocol enables secure, automated launchpads and airdrops
            on the Tempo blockchain. Built for precision-based liquidity.
          </motion.p>

          <motion.div variants={itemVariants} className="cta-group">
            <Link to="/presale" className="btn-main font-tech">Enter Launchpad</Link>
            <Link to="/airdrop" className="btn-ghost font-tech">Check Eligibility</Link>
          </motion.div>

          <motion.div variants={itemVariants} className="hero-timer-card card-glass">
            <div className="timer-header">
              <span className="label-caps">Genesis Presale Ends In</span>
              <div className="live-indicator">
                <div className="pulse" />
                Live Now
              </div>
            </div>
            <CountdownTimer targetDate="2026-03-01T00:00:00" />
            <div className="timer-footer">
              <div className="stat">
                <span className="label-caps">Current Stage</span>
                <span className="stat-val">Stage 1: Early Adopters</span>
              </div>
              <div className="stat">
                <span className="label-caps">Price</span>
                <span className="stat-val">1 CHRONO = 0.01 TEMPO</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="info-section">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Institutional Features</h2>
            <p className="section-desc">Zero-compromise security and transparency for the Tempo ecosystem.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card card-glass">
              <div className="icon-box">Vault</div>
              <h3>On-Chain Vesting</h3>
              <p>Smart contract enforced lockups with granular release schedules for investors.</p>
            </div>
            <div className="feature-card card-glass">
              <div className="icon-box">Shield</div>
              <h3>Anti-Bot Measures</h3>
              <p>Advanced wallet verification and transaction queuing to prevent sniping.</p>
            </div>
            <div className="feature-card card-glass">
              <div className="icon-box">Nodes</div>
              <h3>Native Tempo Integration</h3>
              <p>Optimized for Tempo's high-throughput architecture and low gas fees.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-root { position: relative; overflow: hidden; padding-top: var(--header-h); }
        .hero-section { padding: 80px 0 120px; text-align: center; }
        .badge-pill { 
          display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; 
          background: rgba(0, 242, 255, 0.1); border: 1px solid rgba(0, 242, 255, 0.2); 
          border-radius: 100px; color: var(--primary); font-size: 0.8rem; font-weight: 600; 
          margin-bottom: 32px;
        }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 10px var(--primary); }
        .hero-title { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.05; margin-bottom: 24px; }
        .hero-subtext { font-size: 1.15rem; color: var(--text-dim); max-width: 640px; margin: 0 auto 40px; }
        .cta-group { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 80px; }
        .hero-timer-card { max-width: 600px; margin: 0 auto; padding: 32px; text-align: left; position: relative; }
        .timer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .live-indicator { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 700; color: var(--accent); }
        .pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: glow-pulse 2s infinite; }
        .timer-footer { display: flex; gap: 40px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); }
        .stat { display: flex; flex-direction: column; gap: 4px; }
        .stat-val { font-family: 'Space Grotesk'; font-weight: 600; font-size: 1rem; color: #fff; }
        
        .info-section { padding: 120px 0; background: var(--bg-dark); }
        .section-head { text-align: center; margin-bottom: 64px; }
        .section-title { font-size: 2.5rem; margin-bottom: 16px; }
        .section-desc { color: var(--text-dim); max-width: 500px; margin: 0 auto; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .feature-card { padding: 40px; }
        .icon-box { width: 48px; height: 48px; background: rgba(255, 255, 255, 0.05); border-radius: 12px; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: var(--primary); }
        .feature-card h3 { margin-bottom: 12px; font-size: 1.25rem; }
        .feature-card p { color: var(--text-dim); font-size: 0.95rem; line-height: 1.6; }
        
        /* Notification toast */
        .notification-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 10000;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          max-width: 350px;
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .notification-icon {
          width: 24px;
          height: 24px;
          background: var(--success);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: bold;
          font-size: 0.8rem;
        }
        
        .notification-text {
          flex: 1;
          color: #fff;
          font-size: 0.9rem;
        }
        
        .notification-close {
          background: none;
          border: none;
          color: var(--text-dim);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default Home;
