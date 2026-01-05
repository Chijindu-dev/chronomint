import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { TEMPO_NETWORK_PARAMS, isTempoNetwork, switchToTempoNetwork } from './tempoNetwork';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum, "any");
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          const network = await provider.getNetwork();
          const currentChainId = network.chainId;
          setChainId(currentChainId);
          setIsWrongNetwork(!isTempoNetwork(currentChainId));
        } else {
          setAccount(null);
        }
      } catch (error) {
        console.error("Connection check failed:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask to use this dApp");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const network = await provider.getNetwork();
      setChainId(network.chainId);
      setIsWrongNetwork(!isTempoNetwork(network.chainId));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on('chainChanged', (newChainId) => {
        setChainId(newChainId);
        setIsWrongNetwork(!isTempoNetwork(newChainId));
        // Reload is recommended by MetaMask for chain changes
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => { });
        window.ethereum.removeListener('chainChanged', () => { });
      }
    };
  }, [checkConnection]);

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setIsWrongNetwork(false);
  };

  const refreshData = () => {
    // Dispatch a custom event to notify other components to refresh their data
    window.dispatchEvent(new CustomEvent('dataRefresh', { detail: { timestamp: Date.now() } }));
  };

  const value = {
    account,
    chainId,
    isWrongNetwork,
    isLoading,
    connect,
    disconnect,
    switchToTempoNetwork,
    refreshData
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};