import { AppShell } from "@mantine/core";
import Entries from "../main/Entries";
import propTypes from "prop-types";
import Tags from "../main/Tags";

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
    children: "children of element 3",
  },
];

const Main = ({ activeKey }) => {
  return (
    <AppShell.Main maw={1500} mr="auto" ml="auto">
      {elements[activeKey - 1].children}
    </AppShell.Main>
  );
};

Main.propTypes = {
  activeKey: propTypes.string,
};

export default Main;
