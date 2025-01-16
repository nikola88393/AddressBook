import {
  AppShell,
  NavLink,
  Button,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { modals } from "@mantine/modals";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const navLinks = [
  { key: "1", label: "Записи", path: "/entries" },
  { key: "2", label: "Тагове", path: "/tags" },
  { key: "3", label: "Профил", path: "/profile" },
];

const Navigation = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorSheme = useComputedColorScheme("light");
  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const activeKey = navLinks.find(
    (link) => link.path === window.location.pathname
  )?.key;

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
            variant="filled"
            key={link.key}
            label={link.label}
            active={activeKey === link.key}
            onClick={() => navigate(link.path)}
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

export default Navigation;
