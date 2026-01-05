import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
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
  const [totalRaised, setTotalRaised] = useState(0n);
  const [hardCap, setHardCap] = useState(10000n * 10n ** 6n); // 10,000 USDC (6 decimals)
  const [rate, setRate] = useState(100n);
  const [usdcBalance, setUsdcBalance] = useState(0n);
  const [allowance, setAllowance] = useState(0n);

  const fetchContractData = async () => {
    try {
      const presaleAddress = CONTRACT_ADDRESSES.PRESALE;
      if (!presaleAddress || !ethers.isAddress(presaleAddress)) {
        console.warn("Presale address is not yet configured.");
        return;
      }

      const provider = new ethers.JsonRpcProvider("https://rpc.testnet.tempo.xyz", {
        name: "tempo",
        chainId: 42429,
        ensAddress: null
      });
      const presaleContract = new ethers.Contract(presaleAddress, PRESALE_ABI, provider);
      const paymentToken = new ethers.Contract(CONTRACT_ADDRESSES.PAYMENT_TOKEN, PAYMENT_TOKEN_ABI, provider);

      const raised = await presaleContract.totalRaised();
      const cap = await presaleContract.hardCap();
      const currentRate = await presaleContract.rate();

      setTotalRaised(raised);
      setHardCap(cap);
      setRate(currentRate);

      // Fetch user's USDC balance and allowance if connected
      if (account) {
        const balance = await paymentToken.balanceOf(account);
        const approved = await paymentToken.allowance(account, presaleAddress);
        setUsdcBalance(balance);
        setAllowance(approved);
      }
    } catch (err) {
      console.error("Error fetching presale data:", err);
    }
  };

  useEffect(() => {
    fetchContractData();
    const interval = setInterval(fetchContractData, 15000);
    return () => clearInterval(interval);
  }, [account]);

  const progress = hardCap > 0n ? Number((totalRaised * 10000n) / hardCap) / 100 : 0;
  const totalRaisedFormatted = ethers.formatUnits(totalRaised, 6);
  const hardCapFormatted = ethers.formatUnits(hardCap, 6);
  const usdcBalanceFormatted = ethers.formatUnits(usdcBalance, 6);

  const handleApprove = async () => {
    if (!account) {
      connect();
      return;
    }
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    setStatus({ type: 'info', message: 'Requesting approval...' });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const paymentToken = new ethers.Contract(CONTRACT_ADDRESSES.PAYMENT_TOKEN, PAYMENT_TOKEN_ABI, signer);

      const parsedAmount = ethers.parseUnits(amount, 6); // USDC has 6 decimals

      const tx = await paymentToken.approve(CONTRACT_ADDRESSES.PRESALE, parsedAmount, {
        gasLimit: 100000
      });
      setStatus({ type: 'info', message: 'Approval sent. Waiting for confirmation...' });
      await tx.wait();

      setStatus({ type: 'success', message: 'Approval confirmed! You can now buy tokens.' });
      fetchContractData(); // Refresh allowance
    } catch (err) {
      console.error(err);
      const errorMessage = err.reason || err.shortMessage || err.message || "Unknown error";
      setStatus({ type: 'error', message: `Approval failed: ${errorMessage}` });
    } finally {
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
      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const presaleContract = new ethers.Contract(CONTRACT_ADDRESSES.PRESALE, PRESALE_ABI, signer);

      const parsedAmount = ethers.parseUnits(amount, 6); // USDC has 6 decimals

      // Check balance
      if (usdcBalance < parsedAmount) {
        throw new Error(`Insufficient USDC. You have ${usdcBalanceFormatted} but need ${amount}.`);
      }

      // Check allowance
      if (allowance < parsedAmount) {
        throw new Error("Insufficient allowance. Please approve first.");
      }

      setStatus({ type: 'info', message: 'Please confirm in wallet...' });
      const tx = await presaleContract.buyTokens(parsedAmount, {
        gasLimit: 300000
      });

      setStatus({ type: 'info', message: 'Transaction sent. Waiting for confirmation...' });
      const receipt = await tx.wait();
      console.log("Purchase confirmed:", receipt.hash);

      setStatus({ type: 'success', message: 'Success! CHRONO tokens allocated to your wallet.' });
      setAmount('');

      // Refresh data
      setTimeout(() => {
        fetchContractData();
      }, 2000);
    } catch (err) {
      console.error("Purchase error:", err);
      const errorMessage = err.reason || err.shortMessage || err.message || "Unknown error";
      setStatus({ type: 'error', message: `Failed: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  const parsedAmount = amount ? ethers.parseUnits(amount, 6) : 0n;
  const needsApproval = account && parsedAmount > 0n && allowance < parsedAmount;

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
          {allowance > 0n && (
            <div className="balance-row">
              <span className="balance-label-text">
                <span className="approval-badge">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                  </svg>
                  Approved
                </span>
              </span>
              <span className="balance-value">{parseFloat(ethers.formatUnits(allowance, 6)).toLocaleString()} USDC</span>
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
          You receive: <span className="text-primary font-tech">{(parseFloat(amount) * Number(rate) || 0).toLocaleString()} CHRONO</span>
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
