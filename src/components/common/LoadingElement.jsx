import { LoadingOverlay } from "@mantine/core";
import propTypes from "prop-types";

const LoadingElement = ({ isLoading }) => {
  return (
    <LoadingOverlay
      visible={isLoading}
      zIndex={1000}
      overlayProps={{ blur: 2 }}
      loaderProps={{ color: "pink", type: "bars" }}
    />
  );
};

LoadingElement.propTypes = {
  isLoading: propTypes.bool.isRequired,
};

export default LoadingElement;
