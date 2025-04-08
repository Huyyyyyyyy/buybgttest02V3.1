import { Outlet } from "react-router";
import Header from "../components/Header/Header";
import { WalletProvider } from "../context/WalletContext";
import Footer from "../components/Footer/Footer";
import { MobileProvider } from "../context/MobileContext";

const Layout = () => {
  return (
    <>
      <WalletProvider>
        <MobileProvider>
          <Header />
          <Outlet />
        </MobileProvider>
      </WalletProvider>
      <Footer />
    </>
  );
};

export default Layout;
