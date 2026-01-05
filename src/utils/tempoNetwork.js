export const TEMPO_NETWORK_PARAMS = {
  chainId: '0xA5BD', // 42429
  chainName: 'Tempo Testnet (Andantino)',
  nativeCurrency: {
    name: 'Andantino',
    symbol: 'TEMPO',
    decimals: 18
  },
  rpcUrls: ['https://rpc.testnet.tempo.xyz'],
  blockExplorerUrls: ['https://explore.tempo.xyz']
};

export const isTempoNetwork = (chainId) => {
  return chainId === TEMPO_NETWORK_PARAMS.chainId || chainId === parseInt(TEMPO_NETWORK_PARAMS.chainId, 16);
};

export const switchToTempoNetwork = async () => {
  if (!window.ethereum) return;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: TEMPO_NETWORK_PARAMS.chainId }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [TEMPO_NETWORK_PARAMS],
        });
      } catch (addError) {
        console.error('Error adding Tempo network:', addError);
      }
    }
    console.error('Error switching to Tempo network:', switchError);
  }
};