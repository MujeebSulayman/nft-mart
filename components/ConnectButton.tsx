import React from 'react';
import { useWallet } from '../WalletProvider';

const ConnectButton: React.FC = () => {
  const { address, balance, connectWallet, disconnectWallet } = useWallet();

  return (
    <div>
      {address ? (
        <div>
          <p>Address: {address}</p>
          <p>Balance: {balance} ETH</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectButton;

