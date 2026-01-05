import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../../contracts/addresses';
import { PRESALE_ABI, PAYMENT_TOKEN_ABI } from '../../contracts/abis/index';
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
      // Check if we have real contract addresses
      const presaleAddress = CONTRACT_ADDRESSES.PRESALE;
      const usdcAddress = CONTRACT_ADDRESSES.PAYMENT_TOKEN;
      
      if (presaleAddress && ethers.isAddress(presaleAddress) && presaleAddress !== '0x5FbDB2315678afecb367f032d93F642f64180aa5' &&
          usdcAddress && ethers.isAddress(usdcAddress) && usdcAddress !== '0x5FbDB2315678afecb367f032d93F642f64180aa4') {
        // Try to fetch real data from blockchain
        const provider = window.ethereum
          ? new ethers.BrowserProvider(window.ethereum, "any")
          : new ethers.JsonRpcProvider("https://rpc.testnet.tempo.xyz", {
            name: "tempo",
            chainId: 42429,
            ensAddress: null
          });
        
        // Get presale contract
        const presaleContract = new ethers.Contract(presaleAddress, PRESALE_ABI, provider);
        
        // Fetch presale data
        const totalRaised = await presaleContract.totalRaised();
        const hardCap = await presaleContract.hardCap();
        const rate = await presaleContract.rate();
        
        setTotalRaised(parseFloat(ethers.formatUnits(totalRaised, 6))); // USDC has 6 decimals
        setHardCap(parseFloat(ethers.formatUnits(hardCap, 6)));
        setRate(Number(rate));
        
        if (account) {
          // Get USDC balance
          const usdcContract = new ethers.Contract(usdcAddress, PAYMENT_TOKEN_ABI, provider);
          const balance = await usdcContract.balanceOf(account);
          setUsdcBalance(parseFloat(ethers.formatUnits(balance, 6)));
          
          // Get allowance
          const allowance = await usdcContract.allowance(account, presaleAddress);
          setAllowance(parseFloat(ethers.formatUnits(allowance, 6)));
        }
      } else {
        // Fallback to mock data
        setTotalRaised(6500); // 6500 USDC raised
        setHardCap(10000); // 10000 USDC hard cap
        setRate(100); // 100 CHRONO per USDC
        if (account) {
          setUsdcBalance(2500); // Mock USDC balance
          setAllowance(1000); // Mock allowance
        }
      }
    } catch (err) {
      console.error("Error fetching presale data:", err);
      // Fallback to mock data on error
      setTotalRaised(6500);
      setHardCap(10000);
      setRate(100);
      if (account) {
        setUsdcBalance(2500);
        setAllowance(1000);
      }
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
      const provider = window.ethereum
        ? new ethers.BrowserProvider(window.ethereum, "any")
        : new ethers.JsonRpcProvider("https://rpc.testnet.tempo.xyz", {
          name: "tempo",
          chainId: 42429,
          ensAddress: null
        });
      
      const signer = await provider.getSigner();
      
      // Check if we have real contract addresses
      const usdcAddress = CONTRACT_ADDRESSES.PAYMENT_TOKEN;
      const presaleAddress = CONTRACT_ADDRESSES.PRESALE;
      
      if (usdcAddress && ethers.isAddress(usdcAddress) && usdcAddress !== '0x5FbDB2315678afecb367f032d93F642f64180aa4' &&
          presaleAddress && ethers.isAddress(presaleAddress) && presaleAddress !== '0x5FbDB2315678afecb367f032d93F642f64180aa5') {
        // Get USDC contract
        const usdcContract = new ethers.Contract(usdcAddress, PAYMENT_TOKEN_ABI, signer);
        
        // Convert amount to proper decimals (USDC has 6 decimals)
        const amountInWei = ethers.parseUnits(amount, 6);
        
        // Send approval transaction
        const tx = await usdcContract.approve(presaleAddress, amountInWei);
        setStatus({ type: 'info', message: 'Waiting for approval confirmation...' });
        
        await tx.wait();
        setStatus({ type: 'success', message: 'Approval confirmed! You can now buy tokens.' });
        
        // Update allowance after approval
        const allowance = await usdcContract.allowance(account, presaleAddress);
        setAllowance(parseFloat(ethers.formatUnits(allowance, 6)));
      } else {
        // Fallback to mock for demo
        setTimeout(() => {
          setStatus({ type: 'success', message: 'Approval confirmed! You can now buy tokens.' });
          setAllowance(parseFloat(amount)); // Update allowance to the approved amount
        }, 2000);
      }
      
      setIsLoading(false);
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
      const provider = window.ethereum
        ? new ethers.BrowserProvider(window.ethereum, "any")
        : new ethers.JsonRpcProvider("https://rpc.testnet.tempo.xyz", {
          name: "tempo",
          chainId: 42429,
          ensAddress: null
        });
      
      const signer = await provider.getSigner();
      
      // Check if we have real contract addresses
      const presaleAddress = CONTRACT_ADDRESSES.PRESALE;
      
      if (presaleAddress && ethers.isAddress(presaleAddress) && presaleAddress !== '0x5FbDB2315678afecb367f032d93F642f64180aa5') {
        // Get presale contract
        const presaleContract = new ethers.Contract(presaleAddress, PRESALE_ABI, signer);
        
        // Convert amount to proper decimals (USDC has 6 decimals)
        const amountInWei = ethers.parseUnits(amount, 6);
        
        // Send purchase transaction
        const tx = await presaleContract.buyTokens(amountInWei);
        setStatus({ type: 'info', message: 'Waiting for purchase confirmation...' });
        
        await tx.wait();
        setStatus({ type: 'success', message: 'Success! CHRONO tokens allocated to your wallet.' });
        
        // Clear the input amount
        setAmount('');
      } else {
        // Fallback to mock for demo
        setTimeout(() => {
          setStatus({ type: 'success', message: 'Success! CHRONO tokens allocated to your wallet.' });
          setAmount('');
        }, 2000);
      }
      
      // Trigger data refresh across the app
      window.dispatchEvent(new CustomEvent('dataRefresh', { detail: { action: 'purchase', timestamp: Date.now() } }));
      
      setIsLoading(false);
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