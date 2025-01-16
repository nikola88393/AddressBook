import { AppShell } from "@mantine/core";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router";

function Layout() {
  const [opened, { toggle }] = useDisclosure();

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
      layout="alt"
    >
      <Header opened={opened} toggle={toggle} />
      <Navigation />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}

export default Layout;
