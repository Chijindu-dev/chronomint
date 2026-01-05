import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../../contracts/addresses';
import { useWallet } from '../../utils/WalletContext';
import './AirdropCard.css';

const AirdropCard = () => {
  const { account, connect } = useWallet();
  const [isChecking, setIsChecking] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);
  const [step, setStep] = useState('initial'); // initial, tasks, checking, result
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [airdropAmount, setAirdropAmount] = useState('1,250');

  const [errorMessage, setErrorMessage] = useState(null);

  const checkEligibility = async () => {
    if (!account) {
      connect();
      return;
    }
    setStep('tasks');
    setErrorMessage(null);
  };

  const verifyTaskAndCheck = async () => {
    if (!taskCompleted) return;

    setStep('checking');
    setIsChecking(true);
    setErrorMessage(null);

    try {
      // Check if we have real contract addresses
      const airdropAddress = CONTRACT_ADDRESSES.AIRDROP;
      
      if (airdropAddress && ethers.isAddress(airdropAddress) && airdropAddress !== '0x5FbDB2315678afecb367f032d93F642f64180aa6') {
        // Try to fetch real eligibility data from blockchain
        const provider = window.ethereum
          ? new ethers.BrowserProvider(window.ethereum, "any")
          : new ethers.JsonRpcProvider("https://rpc.testnet.tempo.xyz", {
            name: "tempo",
            chainId: 42429,
            ensAddress: null
          });
        
        // Get airdrop contract
        const { AIRDROP_ABI } = await import('../../contracts/abis/index');
        const airdropContract = new ethers.Contract(airdropAddress, AIRDROP_ABI, provider);
        
        // Check eligibility and if already claimed
        const isEligible = await airdropContract.isEligible(account);
        const hasClaimed = await airdropContract.hasClaimed(account);
        
        if (hasClaimed) {
          setClaimStatus('claimed');
        } else if (isEligible) {
          setClaimStatus('eligible');
        } else {
          setClaimStatus('not-eligible');
        }
      } else {
        // Fallback to mock data for demo
        // Mock eligibility check - 70% chance of being eligible
        const isEligible = Math.random() > 0.3;
        const hasClaimed = Math.random() > 0.7; // 30% chance of already claimed

        if (hasClaimed) {
          setClaimStatus('claimed');
        } else if (isEligible) {
          setClaimStatus('eligible');
        } else {
          setClaimStatus('not-eligible');
        }
      }

      setStep('result');
      setIsChecking(false);
    } catch (err) {
      console.error("Eligibility check failed:", err);
      // Even in error, we stay professional and show a clear message
      setClaimStatus('error');
      setStep('result');
      setIsChecking(false);
    }
  };

  const handleClaim = async () => {
    setIsChecking(true);
    setErrorMessage(null);

    try {
      // Check if we have real contract addresses
      const airdropAddress = CONTRACT_ADDRESSES.AIRDROP;
      
      if (airdropAddress && ethers.isAddress(airdropAddress) && airdropAddress !== '0x5FbDB2315678afecb367f032d93F642f64180aa6') {
        const provider = window.ethereum
          ? new ethers.BrowserProvider(window.ethereum, "any")
          : new ethers.JsonRpcProvider("https://rpc.testnet.tempo.xyz", {
            name: "tempo",
            chainId: 42429,
            ensAddress: null
          });
        
        const signer = await provider.getSigner();
        
        // Get airdrop contract
        const { AIRDROP_ABI } = await import('../../contracts/abis/index');
        const airdropContract = new ethers.Contract(airdropAddress, AIRDROP_ABI, signer);
        
        // Send claim transaction
        const tx = await airdropContract.claim();
        setErrorMessage('Waiting for claim confirmation...');
        
        await tx.wait();
        setClaimStatus('claimed');
      } else {
        // Fallback to mock for demo
        setTimeout(() => {
          setClaimStatus('claimed');
        }, 2000);
      }
      
      // Trigger data refresh across the app
      window.dispatchEvent(new CustomEvent('dataRefresh', { detail: { action: 'claim', timestamp: Date.now() } }));
      
      setIsChecking(false);
    } catch (err) {
      console.error("Claim failed:", err);
      const msg = "Transaction failed. Please check your balance.";
      setErrorMessage(msg);
      setIsChecking(false);
    }
  };

  return (
    <div className="card-glass airdrop-card">
      <AnimatePresence mode="wait">
        {step === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="step-content"
          >
            <div className="portal-icon">
              <div className="ring" />
              <div className="ring" />
              <div className="center-orb" />
            </div>
            <h2>Airdrop Portal</h2>
            <p>Connect your wallet to check your CHRONO token eligibility across all Tempo snapshots.</p>
            <button className="btn-main font-tech start-btn" onClick={checkEligibility}>
              {!account ? 'Connect Wallet' : 'Check Eligibility'}
            </button>
          </motion.div>
        )}

        {step === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            <div className="task-badge">Step 1: Community Verification</div>
            <h2>Prerequisite Tasks</h2>
            <p>To ensure a fair distribution, please complete the following social task to qualify for the Genesis Airdrop.</p>

            <div className="task-card card-glass">
              <div className="task-info">
                <svg className="x-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <div className="task-text">
                  <span className="font-tech">Follow @Tempo</span>
                  <span className="text-dim">Official Blockchain Page</span>
                </div>
              </div>
              <button
                className={`task-btn ${taskCompleted ? 'completed' : ''}`}
                onClick={() => {
                  window.open('https://x.com/tempo', '_blank');
                  setTaskCompleted(true);
                }}
              >
                {taskCompleted ? '✓ Followed' : 'Follow'}
              </button>
            </div>

            <button
              className="btn-main font-tech start-btn"
              onClick={verifyTaskAndCheck}
              disabled={!taskCompleted}
            >
              Verify & Proceed
            </button>
            <button className="btn-ghost text-dim" style={{ marginTop: '12px' }} onClick={() => setStep('initial')}>
              Back
            </button>
          </motion.div>
        )}

        {step === 'checking' && (
          <motion.div
            key="checking"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="step-content"
          >
            <div className="loader-box">
              <div className="spinner" />
              <p className="label-caps">Syncing with Tempo Nodes...</p>
            </div>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="step-content"
          >
            {claimStatus === 'eligible' && (
              <div className="result-eligible">
                <div className="success-badge">Verification Passed</div>
                <h3>{parseFloat(airdropAmount).toLocaleString()} CHRONO</h3>
                <p>Allocated to your wallet from the community pools.</p>

                {errorMessage && (
                  <div className="error-message-inline">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <button className="btn-main font-tech claim-btn" onClick={handleClaim} disabled={isChecking}>
                  {isChecking ? 'Processing Claim...' : 'Claim Tokens Now'}
                </button>
              </div>
            )}

            {claimStatus === 'not-eligible' && (
              <div className="result-error">
                <div className="error-badge">No Allocation Found</div>
                <h3>Wallet Not Eligible</h3>
                <p>This wallet did not meet the minimum requirements for the Genesis Airdrop.</p>
                <button className="btn-ghost font-tech" onClick={() => setStep('initial')}>
                  Try Another Wallet
                </button>
              </div>
            )}

            {claimStatus === 'claimed' && (
              <div className="result-success">
                <div className="final-icon">✔</div>
                <h3>Tokens Claimed</h3>
                <p>Your CHRONO tokens have been successfully distributed to your wallet.</p>
                <button className="btn-ghost font-tech" onClick={() => {
                  if (window.location.pathname === '/dashboard') {
                    window.location.reload(); // Reload dashboard to see updated balances
                  } else {
                    window.location.href = '/dashboard'; // Go to dashboard to see updated balances
                  }
                }}>
                  View Dashboard
                </button>
              </div>
            )}

            {claimStatus === 'error' && (
              <div className="result-error">
                <div className="error-badge">Sync Failed</div>
                <h3>Network Timeout</h3>
                <p>We couldn't reach the Tempo nodes. Please try again later.</p>
                <button className="btn-ghost font-tech" onClick={() => setStep('initial')}>
                  Retry Check
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
};

export default AirdropCard;