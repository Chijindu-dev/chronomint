import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CONTRACT_ADDRESSES } from '../../contracts/addresses';
import { useWallet } from '../../utils/WalletContext';
import './PresaleCard.css';

const PresaleCard = () => {
  const { account, isWrongNetwork, connect, switchToTempoNetwork } = useWallet();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Contract states
  const [totalRaised, setTotalRaised] = useState(0);
  const [hardCap, setHardCap] = useState(10000); // 10,000 USDC
  const [rate, setRate] = useState(100); // 100 CHRONO per USDC
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const fetchContractData = async () => {
    try {
      // Mock data
      setTotalRaised(6500); // 6500 USDC raised
      setHardCap(10000); // 10000 USDC hard cap
      setRate(100); // 100 CHRONO per USDC
      if (account) {
        setUsdcBalance(2500); // Mock USDC balance
        setAllowance(1000); // Mock allowance
      }
    } catch (err) {
      console.error("Error fetching mock presale data:", err);
    }
  };

  useEffect(() => {
    fetchContractData();
    const interval = setInterval(fetchContractData, 15000);
    return () => clearInterval(interval);
  }, [account]);

  const progress = hardCap > 0 ? (totalRaised * 10000) / hardCap / 100 : 0;
  const totalRaisedFormatted = totalRaised.toFixed(2);
  const hardCapFormatted = hardCap.toFixed(2);
  const usdcBalanceFormatted = usdcBalance.toFixed(2);

  const handleApprove = async () => {
    if (!account) {
      connect();
      return;
    }
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    setStatus({ type: 'info', message: 'Requesting approval...' });

    try {
      // Simulate approval process
      setTimeout(() => {
        setStatus({ type: 'success', message: 'Approval confirmed! You can now buy tokens.' });
        setAllowance(parseFloat(amount)); // Update allowance to the approved amount
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `Approval failed: ${err.message || "Unknown error"}` });
      setIsLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!account) {
      connect();
      return;
    }
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    setStatus({ type: 'info', message: 'Initiating purchase...' });

    try {
      // Simulate purchase process
      setTimeout(() => {
        setStatus({ type: 'success', message: 'Success! CHRONO tokens allocated to your wallet.' });
        setAmount('');
        setUsdcBalance(prev => prev - parseFloat(amount)); // Update mock balance
        setTotalRaised(prev => prev + parseFloat(amount)); // Update total raised
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Purchase error:", err);
      setStatus({ type: 'error', message: `Failed: ${err.message || "Unknown error"}` });
      setIsLoading(false);
    }
  };

  const needsApproval = account && amount && parseFloat(amount) > 0 && allowance < parseFloat(amount);

  const getButtonText = () => {
    if (!account) return 'Connect Wallet';
    if (isLoading) return 'Processing...';
    if (needsApproval) return 'Approve USDC';
    return 'Buy CHRONO';
  };

  const handleButtonClick = () => {
    if (!account) {
      connect();
      return;
    }
    if (needsApproval) {
      handleApprove();
    } else {
      handleBuy();
    }
  };

  return (
    <div className="card-glass purchase-card">
      <div className="card-head">
        <h2 className="card-title">Buy CHRONO</h2>
        <div className="badge-live">Live on Testnet</div>
      </div>

      <div className="allocation-box">
        <div className="alloc-head">
          <span className="label-caps">Total Raised</span>
          <span className="alloc-percent">{progress.toFixed(1)}%</span>
        </div>
        <div className="progress-bar-bg">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="progress-bar-fill"
          >
            <div className="progress-glow" />
          </motion.div>
        </div>
        <div className="alloc-foot">
          <span>{parseFloat(totalRaisedFormatted).toLocaleString()} USDC</span>
          <span>{parseFloat(hardCapFormatted).toLocaleString()} CAP</span>
        </div>
      </div>

      {account && (
        <div className="wallet-balance-box">
          <div className="balance-row">
            <span className="balance-label-text">Your USDC Balance</span>
            <span className="balance-value usdc">{parseFloat(usdcBalanceFormatted).toLocaleString()} USDC</span>
          </div>
          {allowance > 0 && (
            <div className="balance-row">
              <span className="balance-label-text">
                <span className="approval-badge">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                  </svg>
                  Approved
                </span>
              </span>
              <span className="balance-value">{parseFloat(allowance).toLocaleString()} USDC</span>
            </div>
          )}
        </div>
      )}

      <div className="input-group">
        <div className="input-label">
          <span className="label-caps">Amount to Invest</span>
          <span className="balance-label">Payment: USDC</span>
        </div>
        <div className="input-wrapper">
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="unit-tag">USDC</div>
        </div>
        <div className="receive-estimate">
          You receive: <span className="text-primary font-tech">{(parseFloat(amount) * rate || 0).toLocaleString()} CHRONO</span>
        </div>
      </div>

      <button
        className="btn-main font-tech purchase-btn"
        onClick={handleButtonClick}
        disabled={isLoading || (account && !amount)}
      >
        {getButtonText()}
      </button>

      {status && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`status-alert ${status.type}`}
        >
          {status.message}
        </motion.div>
      )}
    </div>
  );
};

export default PresaleCard;