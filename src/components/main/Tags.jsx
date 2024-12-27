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

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      color: "#ffffff",
    },

    // validate: {
    //   name: (value) =>
    //     value.length > 0 ? true : "Името на етикета е задължително",
    //   color: (value) =>
    //     value.length > 0 ? true : "Цветът на етикета е задължителен",
    // },
  });

  const handleAddTag = (values) => {
    const newTag = {
      id: tags.length + 1,
      name: values.name,
      color: values.color,
    };
    setTags([...tags, newTag]);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Добавяне на етикет">
        <form
          onSubmit={form.onSubmit((values) => {
            console.log(values);
            handleAddTag(values);
          })}
        >
          <TextInput
            label="Име на етикета"
            placeholder="Име на етикета"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
          <ColorInput
            label="Цвят на етикета"
            placeholder="Цвят на етикета"
            key={form.key("color")}
            {...form.getInputProps("color")}
          />
          <Button type="submit">Добави</Button>
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
            <Button>Редакция</Button>
          </Flex>
        </Card>
      ))}
    </>
  );
};

export default Tags;
