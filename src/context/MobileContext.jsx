import { createContext, useState } from "react";

//create context
export const MobileContext = createContext();

// Create the provider
export const MobileProvider = ({ children }) => {
  const [drawer, setDrawer] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawer({ ...drawer, [anchor]: open });
  };

  const handleClick = (url) => {
    window.open(url, "_blank");
  };

  const contextMobileData = {
    data: { drawer },
    functions: { toggleDrawer, handleClick },
  };

  return (
    <MobileContext.Provider value={contextMobileData}>
      {children}
    </MobileContext.Provider>
  );
};
