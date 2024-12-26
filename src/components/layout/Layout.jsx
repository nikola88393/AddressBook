import { AppShell } from "@mantine/core";
import Header from "./Header";
import Navigation from "./Navigation";
import Main from "./Main";
import Footer from "./Footer";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const [activeKey, setActiveKey] = useState("1");

  const handleKeyChange = (key) => {
    setActiveKey(key);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      footer={{ height: 60 }}
      padding="md"
    >
      <Header opened={opened} toggle={toggle} />
      <Navigation activeKey={activeKey} handleKeyChange={handleKeyChange} />
      <Main activeKey={activeKey} />
      <Footer />
    </AppShell>
  );
}

export default Layout;
