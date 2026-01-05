import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../../utils/WalletContext';
import { CONTRACT_ADDRESSES } from '../../contracts/addresses';
import './Dashboard.css';

const Dashboard = () => {
  const { account, connect, isWrongNetwork, switchToTempoNetwork } = useWallet();
  const [balances, setBalances] = useState({
    tempo: '0.00',
    chrono: '0.00',
    usdc: '0.00',
    totalValue: '0.00'
  });
  const [isConfigured, setIsConfigured] = useState(true);

  const fetchBalances = async () => {
    if (!account) return;
    try {
      // Mock data for balances
      setBalances({
        tempo: '12.56',
        chrono: '1250.00',
        usdc: '500.75',
        totalValue: '2250.31'
      });
    } catch (err) {
      console.error("Error fetching mock balances", err);
    }
  };

  useEffect(() => {
    fetchBalances();
    const interval = setInterval(fetchBalances, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, [account]);

  const stats = [
    { label: 'Total Portfolio Value', value: balances.totalValue, unit: 'USD', color: 'var(--primary)' },
    { label: 'CHRONO Holdings', value: balances.chrono, unit: 'CHRONO', color: 'var(--secondary)' },
    { label: 'USDC Balance', value: balances.usdc, unit: 'USDC', color: 'var(--success)' },
    { label: 'Native Balance', value: balances.tempo, unit: 'TEMPO', color: 'var(--text-dim)' },
  ];

  const [activities, setActivities] = useState([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);

  const fetchActivity = async () => {
    if (!account) return;

    try {
      setIsLoadingActivity(true);
      
      // Mock activity data
      const mockActivities = [
        { action: 'Received CHRONO', amount: '100.00 CHRONO', status: 'Confirmed', date: 'Jan 5, 2026', hash: '0x1a2b...c3d4' },
        { action: 'Sent CHRONO', amount: '50.00 CHRONO', status: 'Confirmed', date: 'Jan 4, 2026', hash: '0x5e6f...g7h8' },
        { action: 'Received USDC', amount: '200.00 USDC', status: 'Confirmed', date: 'Jan 3, 2026', hash: '0x9i0j...k1l2' },
        { action: 'Airdrop Claimed', amount: '1250.00 CHRONO', status: 'Confirmed', date: 'Jan 2, 2026', hash: '0xm3n4...o5p6' },
      ];

      setActivities(mockActivities);
    } catch (error) {
      console.error("Error fetching mock activity:", error);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchActivity();
    }
  }, [account]);

  return (
    <div className="dashboard-root">
      <div className="container">
        {account && isWrongNetwork && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="network-warning card-glass"
          >
            <div className="warning-content">
              <span className="warning-icon">⚠</span>
              <p>You are connected to the wrong network. Please switch to the <strong>Tempo Testnet</strong> to view your holdings.</p>
            </div>
            <button className="btn-main btn-small" onClick={switchToTempoNetwork}>Switch Network</button>
          </motion.div>
        )}
        {!account ? (
          <div className="locked-dashboard-wrapper">
            <div className="locked-bg-preview stats-grid">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="stat-card card-glass blurred">
                  <div className="skeleton-label" />
                  <div className="skeleton-value" />
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="locked-overlay card-glass"
            >
              <div className="lock-icon-large">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2 className="font-tech">Institutional Access Required</h2>
              <p className="text-dim">Connect your authorized wallet to decrypt your portfolio analytics and transaction history on the Tempo Blockchain.</p>
              <button className="btn-main font-tech" onClick={connect}>
                Establish Secure Connection
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            <div className="dashboard-header">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-gradient">User Overview</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <p className="header-desc">Track your positions across the ChronoMint ecosystem.</p>
                  {!isConfigured && (
                    <span className="config-badge">Config Required</span>
                  )}
                </div>
                <div className="user-address-badge">{account}</div>
              </motion.div>

              <a
                href={`https://explorer.tempo.network/address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost font-tech no-deco"
              >
                <span>External Explorer</span>
                <i className="arrow-icon">↗</i>
              </a>
            </div>

            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="stat-card card-glass"
                  style={{ borderLeft: `2px solid ${stat.color}` }}
                >
                  <span className="label-caps">{stat.label}</span>
                  <div className="stat-value-group">
                    <span className="stat-value">
                      {stat.unit === '%' ? (
                        stat.value
                      ) : (
                        (() => {
                          const n = parseFloat(stat.value);
                          // Force scientific notation for astronomical values (>= 1 Trillion) where standard suffixes fail
                          if (n >= 1e12 || n <= -1e12) {
                            return `$${n.toExponential(2).replace('+', '')}`; // e.g. $4.2424e20
                          }
                          if (n >= 1000000 || n <= -1000000) {
                            return `$${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short', minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(n)}`;
                          }
                          return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        })()
                      )}
                    </span>
                    <span className="stat-unit">{stat.unit === '%' ? '%' : 'USD'}</span>
                  </div>
                  {stat.unit === 'CHRONO' && (
                    <div className="stat-subtext text-dim" style={{ fontSize: '0.8rem', marginTop: '6px' }}>
                      {(() => {
                        const n = parseFloat(stat.value);
                        if (n >= 1000000 || n <= -1000000) {
                          return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 4 }).format(n);
                        }
                        return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
                      })()} {stat.unit}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <section className="activity-section">
              <div className="section-header">
                <h3 className="font-tech">Recent Activity</h3>
                <button className="text-link" onClick={() => { fetchBalances(); fetchActivity(); }}>Refresh Data</button>
              </div>

              <div className="card-glass table-container">
                <table className="activity-table">
                  <thead>
                    <tr>
                      <th className="label-caps">Action</th>
                      <th className="label-caps">Amount</th>
                      <th className="label-caps">Status</th>
                      <th className="label-caps">Date</th>
                      <th className="label-caps">Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.length > 0 ? (
                      activities.map((act, i) => (
                        <tr key={i}>
                          <td className="font-tech">{act.action}</td>
                          <td>{act.amount}</td>
                          <td><span className="status-pill">{act.status}</span></td>
                          <td className="text-dim">{act.date}</td>
                          <td className="hash-cell">
                            <a href={`https://explore.tempo.xyz/tx/${act.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                              {act.hash}
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                          {isLoadingActivity ? 'Syncing blockchain history...' : 'No recent transactions found on Tempo Testnet.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>


    </div>
  );
};

export default Dashboard;