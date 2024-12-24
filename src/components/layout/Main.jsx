import { AppShell } from "@mantine/core";
import propTypes from "prop-types";

const elements = [
  {
    key: "1",
    title: "Element 1",
    description: "Description of element 1",
  },
  {
    key: "2",
    title: "Element 2",
    description: "Description of element 2",
  },
  {
    key: "3",
    title: "Element 3",
    description: "Description of element 3",
  },
];

const Main = ({ activeKey }) => {
  return (
    <AppShell.Main maw={1400} ml="auto" mr="auto">
      <h1>{elements[activeKey - 1].title}</h1>
      <p>{elements[activeKey - 1].description}</p>
    </AppShell.Main>
  );
};

Main.propTypes = {
  activeKey: propTypes.string,
};

export default Main;
