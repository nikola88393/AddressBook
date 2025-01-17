import TagsContext from "../context/TagsProvider";
import { useContext } from "react";

const useTags = () => {
  return useContext(TagsContext);
};

export default useTags;
