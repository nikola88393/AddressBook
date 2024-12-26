import { AppShell } from "@mantine/core";
import Entries from "../main/Entries";
import propTypes from "prop-types";

const elements = [
  {
    key: "1",
    description: <Entries />,
  },
  {
    key: "2",
    description: "Description of element 2",
  },
  {
    key: "3",
    description: "Description of element 3",
  },
];

const Main = ({ activeKey }) => {
  return <AppShell.Main>{elements[activeKey - 1].description}</AppShell.Main>;
};

Main.propTypes = {
  activeKey: propTypes.string,
};

export default Main;
