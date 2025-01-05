import { Button, Flex } from "@mantine/core";
import { useNavigate } from "react-router";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <Flex
      align="center"
      justify="center"
      style={{ height: "100vh" }}
      direction="column"
    >
      <span style={{ fontSize: "2rem" }}>404</span>
      <p>За съжаление страницата не беше намерена</p>
      <Button onClick={() => navigate("/", { replace: true })}>Начало</Button>
    </Flex>
  );
};

export default Error404;
