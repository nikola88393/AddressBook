import {
  Button,
  Flex,
  Badge,
  Card,
  Modal,
  TextInput,
  ColorInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useState } from "react";

const Tags = () => {
  const [tags, setTags] = useState([
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

  const [opened, { open, close }] = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);

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
    <>
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
    </>
  );
};

export default Tags;
