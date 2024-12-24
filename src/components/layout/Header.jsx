import { Burger, AppShell, Center, Box } from "@mantine/core";
import propTypes from "prop-types";

const Header = ({ opened, toggle }) => {
  return (
    <AppShell.Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      {/* Burger menu on the left */}
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

      {/* Centered logo */}
      <Center style={{ flex: 1 }}>
        <Box>
          <h1>Addrly</h1>
        </Box>
      </Center>
    </AppShell.Header>
  );
};
Header.propTypes = {
  opened: propTypes.bool,
  toggle: propTypes.func,
};

export default Header;
