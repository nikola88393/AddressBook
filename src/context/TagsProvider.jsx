import { createContext, useEffect, useState } from "react";
import propTypes from "prop-types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const TagsContext = createContext({});

export const TagsProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [refetechTrigger, setRefetechTrigger] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosPrivate("api/tag");
        console.log(response);
        setTags(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [refetechTrigger, axiosPrivate]);

  const updateTag = async (id, values) => {
    try {
      const response = await axiosPrivate.patch(`api/tag/${id}/`, values);
      setRefetechTrigger((prev) => prev + 1);
      console.log(response);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const deleteTag = async (id) => {
    try {
      const response = await axiosPrivate.delete(`api/tag/delete`, {
        data: { tagId: id },
      });
      setRefetechTrigger((prev) => prev + 1);
      console.log(response);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const createTag = async (values) => {
    try {
      const response = await axiosPrivate.post("api/tag/", values);
      setRefetechTrigger((prev) => prev + 1);
      console.log(response);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  return (
    <TagsContext.Provider
      value={{ tags, isLoading, updateTag, createTag, deleteTag, error }}
    >
      {children}
    </TagsContext.Provider>
  );
};

TagsProvider.propTypes = {
  children: propTypes.node,
};

export default TagsContext;