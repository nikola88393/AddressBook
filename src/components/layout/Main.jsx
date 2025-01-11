import { AppShell } from "@mantine/core";
import Entries from "../main/Entries";
import propTypes from "prop-types";
import Tags from "../main/Tags";
import Profile from "../main/Profile";

const elements = [
  {
    key: "1",
    children: <Entries />,
  },
  {
    key: "2",
    children: <Tags />,
  },
  {
    key: "3",
    children: <Profile />,
  },
];

const Main = ({ activeKey }) => {
  return <AppShell.Main>{elements[activeKey - 1].children}</AppShell.Main>;
};

Main.propTypes = {
  activeKey: propTypes.string,
};

export default Main;
