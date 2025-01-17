import {
  Button,
  Flex,
  Badge,
  Card,
  Modal,
  TextInput,
  ColorInput,
  Box,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { modals } from "@mantine/modals";
import LoadingElement from "../common/LoadingElement";
import useTags from "../../hooks/useTags";
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Tags = () => {
  const [opened, { open, close }] = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTag, setEditedTag] = useState(null);
  const { tags, updateTag, deleteTag, createTag, isLoading } = useTags();

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

  const handleSubmit = (values) => {
    console.log(values);
    form.reset();
    close();
    createTag(values);
  };

  const handleSumbitEdit = (values) => {
    console.log(values);
    updateTag(editedTag, { name: values.name, color: values.color });
    form.reset();
    close();
    setIsEditing(false);
    setEditedTag(null);
  };

  const handleEdit = (values) => {
    setIsEditing(true);
    setEditedTag(values.id);
    form.setValues(values);
    open();
  };

  const handleClose = () => {
    form.reset();
    close();
    setIsEditing(false);
    setEditedTag(null);
  };

  const handleDelete = (id) => {
    deleteTag(id);
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
      {tags.length > 0 ? (
        tags.map((tag) => (
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
              <Stack>
                <Button onClick={() => handleEdit(tag)}>Редакция</Button>
                <Button
                  bg="red"
                  onClick={() =>
                    modals.openConfirmModal({
                      title: "Изтриване на етикет",
                      centered: true,
                      children:
                        "Сигурни ли сте, че искате да изтриете този етикет?",
                      labels: { cancel: "Отказ", confirm: "Изтрий" },
                      confirmProps: { color: "red" },
                      onConfirm: () => {
                        handleDelete(tag.id);
                        modals.close();
                      },
                      onCancel: () => modals.close(),
                    })
                  }
                >
                  Изтрий
                </Button>
              </Stack>
            </Flex>
          </Card>
        ))
      ) : (
        <div>Няма етикети</div>
      )}
    </Box>
  );
};

export default Tags;
