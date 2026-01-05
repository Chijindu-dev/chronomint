import React, { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connect = async () => {
    setIsLoading(true);
    // Simulate connection delay
    setTimeout(() => {
      const mockAccount = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
      setAccount(mockAccount);
      setChainId(42429); // Tempo testnet chain ID
      setIsWrongNetwork(false);
      setIsLoading(false);
    }, 1000);
  };

  const disconnect = () => {
    setAccount(null);
    setChainId(null);
    setIsWrongNetwork(false);
  };

  const value = {
    account,
    chainId,
    isWrongNetwork,
    isLoading,
    connect,
    disconnect,
    switchToTempoNetwork: () => {}
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};