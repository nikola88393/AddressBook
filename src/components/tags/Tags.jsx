import {
  Button,
  Flex,
  Badge,
  Card,
  Modal,
  TextInput,
  ColorInput,
  Box,
  Notification,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import LoadingElement from "../common/LoadingElement";
import useTags from "../../hooks/useTags";
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Tags = () => {
  const [opened, { open, close }] = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTag, setEditedTag] = useState(null);

  const {
    tags,
    updateTag,
    deleteTag,
    createTag,
    isLoading,
    setRefetchTrigger,
    error,
  } = useTags();

  useEffect(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, [setRefetchTrigger]);

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
      {error && (
        <Notification color="red" title="Грешка">
          {error.response?.data?.message || "Възникна грешка"}
        </Notification>
      )}

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
            padding="xl"
            radius="md"
            style={{ marginBottom: "1rem" }}
            withBorder
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              gap="xl"
              justify="space-between"
              align={{ base: "start", md: "center" }}
            >
              <Badge autoContrast size="lg" color={tag.color}>
                {tag.name}
              </Badge>
              <Flex direction={{ base: "row", xl: "column" }} gap="xs">
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
              </Flex>
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
