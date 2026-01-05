import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Presale from './pages/Presale/Presale';
import Airdrop from './pages/Airdrop/Airdrop';
import Dashboard from './pages/Dashboard/Dashboard';
import AnimatedBackground from './components/AnimatedBackground';
import { WalletProvider, useWallet } from './utils/WalletContext';
import './styles/global.css';
import './styles/responsive.css';



const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/presale" element={<PageWrapper><Presale /></PageWrapper>} />
        <Route path="/airdrop" element={<PageWrapper><Airdrop /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="app-wrapper" style={{ position: 'relative', minHeight: '100vh' }}>
          <AnimatedBackground />

          <Header />
          <main style={{ minHeight: 'calc(100vh - var(--header-h))' }}>
            <AnimatedRoutes />
          </main>

          <footer style={{
            padding: '80px 0 40px',
            borderTop: '1px solid var(--border)',
            marginTop: '120px',
            position: 'relative',
            background: 'rgba(2, 2, 4, 0.4)',
            backdropFilter: 'blur(10px)'
          }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px', textAlign: 'left' }}>
                <div>
                  <h4 className="font-tech" style={{ marginBottom: '20px', fontSize: '1.2rem' }}>CHRONO<span className="text-primary">MINT</span></h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>The institutional gateway for launchpads and community rewards on Tempo.</p>
                </div>
                <div>
                  <h5 className="label-caps" style={{ marginBottom: '20px' }}>Ecosystem</h5>
                  <ul style={{ listStyle: 'none', color: 'var(--text-dim)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li>Tempo Explorer</li>
                    <li>Bridge</li>
                    <li>Governance</li>
                  </ul>
                </div>
                <div>
                  <h5 className="label-caps" style={{ marginBottom: '20px' }}>Community</h5>
                  <ul style={{ listStyle: 'none', color: 'var(--text-dim)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li>Twitter / X</li>
                    <li>Discord</li>
                    <li>Telegram</li>
                  </ul>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>&copy; 2026 ChronoMint Protocol. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>Terms of Service</span>
                  <span>Privacy Policy</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
