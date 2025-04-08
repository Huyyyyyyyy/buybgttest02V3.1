import { createContext } from "react";
import { useWallet } from "../hooks/useWallet";

//create context
export const WalletContext = createContext();

// Create the provider
export const WalletProvider = ({ children }) => {
  const currentWallet = useWallet();
  return (
    <WalletContext.Provider value={currentWallet}>
      {children}
    </WalletContext.Provider>
  );
};
