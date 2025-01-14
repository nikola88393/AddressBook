import {
  AppShell,
  NavLink,
  Button,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import propTypes from "prop-types";
import { modals } from "@mantine/modals";
import useAuth from "../../hooks/useAuth";

const navLinks = [
  { key: "1", label: "Записи" },
  { key: "2", label: "Тагове" },
  { key: "3", label: "Профил" },
];

const Navigation = ({ activeKey, handleKeyChange }) => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorSheme = useComputedColorScheme("light");
  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();

  const toggleColorScheme = () => {
    setColorScheme(computedColorSheme === "light" ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      const response = await axiosPrivate.post("api/auth/logout");
      console.log(response.data);
      setAuth({});
    } catch (err) {
      console.error(err);
    }
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

      <Button
        bg="red"
        mt="xs"
        onClick={() =>
          modals.openConfirmModal({
            title: "Изход от профила",
            centered: true,
            children: "Сигурни ли сте, че искате да излезете от профила си?",
            labels: { cancel: "Отказ", confirm: "Изтрий" },
            confirmProps: { color: "red" },
            onConfirm: () => {
              handleLogout();
              modals.close();
            },
            onCancel: () => modals.close(),
          })
        }
      >
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
