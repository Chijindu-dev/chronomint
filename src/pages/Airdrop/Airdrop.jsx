import React from 'react';
import { motion } from 'framer-motion';
import AirdropCard from '../../components/AirdropCard/AirdropCard';

const Airdrop = () => {
  return (
    <div className="airdrop-root">
      <div className="container">
        <div className="airdrop-header">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="badge-accent"
          >
            Community Distribution
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gradient"
          >
            Chrono Community Airdrop
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="header-desc"
          >
            Verifying 50k+ active wallets on the Tempo Network.
            Claim your share of the 1,000,000 CHRONO allocation.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="airdrop-main"
        >
          <AirdropCard />
        </motion.div>

        <section className="eligibility-section">
          <h2 className="section-title">Eligibility Criteria</h2>
          <div className="criteria-grid">
            <div className="criteria-item card-glass">
              <div className="check-box">✓</div>
              <div className="crit-content">
                <h3>Early Adopter</h3>
                <p>Performed at least 5 transactions on Tempo Testnet before Dec 2025.</p>
              </div>
            </div>
            <div className="criteria-item card-glass">
              <div className="check-box">✓</div>
              <div className="crit-content">
                <h3>Liquidity Provider</h3>
                <p>Provided more than 100 TEMPO liquidity to native DEX pairs.</p>
              </div>
            </div>
            <div className="criteria-item card-glass">
              <div className="check-box">✓</div>
              <div className="crit-content">
                <h3>Governance Participant</h3>
                <p>Voted on at least one Tempo Improvement Proposal (TIP).</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .airdrop-root { padding: 120px 0 80px; min-height: 100vh; }
        .airdrop-header { text-align: center; margin-bottom: 64px; }
        .badge-accent { 
          display: inline-block; padding: 4px 12px; background: rgba(125, 64, 255, 0.1); 
          border: 1px solid rgba(125, 64, 255, 0.2); border-radius: 100px; color: var(--secondary); 
          font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 24px;
        }
        .airdrop-header h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 16px; }
        .header-desc { color: var(--text-dim); max-width: 540px; margin: 0 auto; line-height: 1.6; font-size: 1.1rem; }
        .airdrop-main { display: flex; justify-content: center; margin-bottom: 100px; }
        
        .eligibility-section { margin-top: 80px; }
        .criteria-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-top: 40px; }
        .criteria-item { padding: 32px; display: flex; gap: 24px; align-items: flex-start; }
        .check-box { 
          width: 32px; height: 32px; background: rgba(0, 242, 255, 0.1); border-radius: 8px; 
          display: flex; align-items: center; justify-content: center; color: var(--primary); font-weight: 700;
        }
        .crit-content h3 { font-size: 1.1rem; margin-bottom: 8px; color: #fff; }
        .crit-content p { font-size: 0.9rem; color: var(--text-dim); line-height: 1.5; }
      `}</style>
    </div>
  );
};

export default Airdrop;
