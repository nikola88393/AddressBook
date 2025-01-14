import { Flex, Loader } from "@mantine/core";

function Loading() {
  return (
    <Flex align="center" justify="center" h="100vh" w="100%">
      <Loader color="blue" />
    </Flex>
  );
}

export default Loading;
