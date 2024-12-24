import {
  AppShell,
  NavLink,
  Button,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";

import propTypes from "prop-types";

const navLinks = [
  { key: "1", label: "Записи" },
  { key: "2", label: "Тагове" },
  { key: "3", label: "Профил" },
];

const Navigation = ({ activeKey, handleKeyChange }) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorSheme = useComputedColorScheme("light");

  const toggleColorScheme = () => {
    setColorScheme(computedColorSheme === "light" ? "dark" : "light");
  };

  return (
    <AppShell.Navbar p="md">
      {navLinks.map((link) => {
        return (
          <NavLink
            key={link.key}
            label={link.label}
            active={activeKey === link.key}
            onClick={() => handleKeyChange(link.key)}
          />
        );
      })}

      <Button mt="auto" onClick={toggleColorScheme}>
        Toggle theme
      </Button>

      <Button bg="red" mt="xs">
        Изход
      </Button>
    </AppShell.Navbar>
  );
};

Navigation.propTypes = {
  activeKey: propTypes.string,
  handleKeyChange: propTypes.func,
};

export default Navigation;
