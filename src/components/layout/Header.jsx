import { Burger, AppShell, Center, Box } from "@mantine/core";
import propTypes from "prop-types";
import { useNavigate } from "react-router";

const Header = ({ opened, toggle }) => {
  const navigate = useNavigate();
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
          <h1 onClick={() => navigate("/")}>Addrly</h1>
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
