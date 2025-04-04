import { Outlet } from "react-router";
import Header from "../components/Header/Header";
import { useWallet } from "../hooks/useWallet";
import WalletContext from "../context/WalletContext";
import Footer from "../components/Footer/Footer";

const Layout = () => {
  const currentWallet = useWallet();
  return (
    <>
      <WalletContext.Provider value={currentWallet}>
        <Header />
        <Outlet />
      </WalletContext.Provider>
      <Footer />
    </>
  );
};

export default Layout;
