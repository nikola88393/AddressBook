import {
  Button,
  Flex,
  Badge,
  Card,
  Modal,
  TextInput,
  ColorInput,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import LoadingElement from "../common/LoadingElement";
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Tags = () => {
  // const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [opened, { open, close }] = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getTags = async () => {
      try {
        // const response = await axiosPrivate.get("/tags");
        // setTags(response.data);
        setTags([
          {
            id: 1,
            name: "Логистика",
            color: "blue",
          },
          {
            id: 2,
            name: "Детски магазин",
            color: "green",
          },
          {
            id: 3,
            name: "Доставчик",
            color: "red",
          },
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(() => {
      getTags();
    }, 2000);
  }, []);

  const form = useForm({
    mode: "uncontrolled",
    validate: {
      name: (value) =>
        value === undefined
          ? "Името на етикета е задължително"
          : value.length > 15
          ? "Името на етикета трябва да е по-малко от 15 символа"
          : null,
      color: (value) =>
        value === undefined ? "Цветът на етикета е задължителен" : null,
    },
  });

  const handleAddTag = (values) => {
    const newTag = {
      id: tags.length + 1,
      name: values.name,
      color: values.color,
    };
    setTags([...tags, newTag]);
  };

  const handleSubmit = (values) => {
    console.log(values);
    form.reset();
    close();
    handleAddTag(values);
  };

  const handleSumbitEdit = (values) => {
    console.log(values);
    setTags(
      tags.map((tag) =>
        tag.id === values.id
          ? { ...tag, name: values.name, color: values.color }
          : tag
      )
    );
    form.reset();
    close();
    setIsEditing(false);
  };

  const handleEdit = (values) => {
    setIsEditing(true);
    form.setValues(values);
    open();
  };

  const handleClose = () => {
    form.reset();
    close();
  };

  return (
    <Box pos="relative">
      <LoadingElement isLoading={isLoading} />
      <Modal opened={opened} onClose={handleClose} title="Добавяне на етикет">
        <form
          onSubmit={form.onSubmit((values) => {
            isEditing ? handleSumbitEdit(values) : handleSubmit(values);
          })}
        >
          <TextInput
            mt="xs"
            label="Име на етикета"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <ColorInput
            mt="xs"
            label="Цвят на етикета"
            key={form.key("color")}
            {...form.getInputProps("color")}
          />
          <Button mt="md" type="submit">
            {isEditing ? "Редакция" : "Добави"}
          </Button>
        </form>
      </Modal>
      <Flex align="center" justify="space-between">
        <h1>Етикети</h1>
        <Button onClick={open}>+</Button>
      </Flex>
      {tags.map((tag) => (
        <Card
          key={tag.id}
          shadow="xs"
          padding="xl"
          radius="md"
          style={{ marginBottom: "1rem" }}
        >
          <Flex align="center" justify="space-between">
            <Badge autoContrast color={tag.color}>
              {tag.name}
            </Badge>
            <Button
              onClick={() => handleEdit({ name: tag.name, color: tag.color })}
            >
              Редакция
            </Button>
          </Flex>
        </Card>
      ))}
    </Box>
  );
};

export default Tags;
