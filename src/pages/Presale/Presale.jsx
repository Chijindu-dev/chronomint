import React from 'react';
import { motion } from 'framer-motion';
import PresaleCard from '../../components/PresaleCard/PresaleCard';

const Presale = () => {
  return (
    <div className="presale-root">
      <div className="container">
        <div className="presale-header">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gradient"
          >
            Token Launchpad
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="header-desc"
          >
            Participate in the future of the Tempo ecosystem.
            All tokens are distributed via secure, audited smart contracts.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="presale-main"
        >
          <PresaleCard />
        </motion.div>

        <div className="presale-info-grid">
          <div className="info-card card-glass">
            <span className="label-caps">Vesting Schedule</span>
            <p>10% TGE, 3 Months Cliff, then monthly linear unlock for 12 months.</p>
          </div>
          <div className="info-card card-glass">
            <span className="label-caps">Whitelisting</span>
            <p>Stage 1 is open to early ecosystem participants. No KYC required.</p>
          </div>
          <div className="info-card card-glass">
            <span className="label-caps">Network</span>
            <p>Deployed on Tempo Mainnet. Gas paid in TEMPO token.</p>
          </div>
        </div>
      </div>

      <style>{`
        .presale-root { padding: 120px 0 80px; min-height: 100vh; }
        .presale-header { text-align: center; margin-bottom: 60px; }
        .presale-header h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 16px; }
        .header-desc { color: var(--text-dim); max-width: 500px; margin: 0 auto; line-height: 1.6; }
        .presale-main { display: flex; justify-content: center; margin-bottom: 64px; }
        .presale-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .info-card { padding: 32px; }
        .info-card p { margin-top: 12px; color: var(--text-dim); font-size: 0.95rem; }
      `}</style>
    </div>
  );
};

export default Presale;
