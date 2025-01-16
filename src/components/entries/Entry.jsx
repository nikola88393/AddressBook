import { TextInput, Button, Flex, Box, Modal } from "@mantine/core";
import { useLocation } from "react-router";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";

const additionalFields = [
  {
    id: 1,
    name: "ДДС",
    value: "BG123456789",
  },
  {
    id: 2,
    name: "МОЛ",
    value: "Иван Иванов",
  },
  {
    id: 3,
    name: "ЕИК",
    value: "123456789",
  },
];

const Entry = () => {
  const [isEdditing, setIsEdditing] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const location = useLocation();
  const entry = location.state;
  console.log(entry);

  const editForm = useForm({
    mode: "uncontrolled",
    initialValues: entry,
    validate: {},
  });

  const customFieldForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: (value) => (value === undefined ? "Името е задължително" : null),
      value: (value) =>
        value === undefined ? "Стойността е задължителна" : null,
    },
  });

  const handleClose = () => {
    customFieldForm.reset();
    setIsFieldEditing(false);
    close();
  };

  //add field
  const handleAddField = (values) => {
    console.log(values);
    close();
    customFieldForm.reset();
  };

  //edit field
  const handleEditField = (values) => {
    console.log(values);
    close();
    customFieldForm.reset();
  };
  //open modal for editting field
  const handleOpenEditField = (field) => {
    setIsFieldEditing(true);
    customFieldForm.setValues({ name: field.name, value: field.value });
    console.log(field);
    open();
  };

  if (!entry) {
    return <div>Entry not found</div>;
  }

  return (
    <Flex align="start" direction="column">
      <h1>Запис</h1>
      <Modal
        opened={opened}
        onClose={handleClose}
        title="Добавяне на допълнително поле"
      >
        <form
          onSubmit={customFieldForm.onSubmit(
            isFieldEditing ? handleEditField : handleAddField
          )}
        >
          <TextInput
            label="Име"
            key={customFieldForm.key("name")}
            {...customFieldForm.getInputProps("name")}
          />
          <TextInput
            label="Стойност"
            key={customFieldForm.key("value")}
            {...customFieldForm.getInputProps("value")}
          />
          <Button type="submit">{isFieldEditing ? "Запази" : "Добави"}</Button>
        </form>
      </Modal>
      <Flex
        align="start"
        justify="start"
        direction={{ base: "column", md: "row" }}
        gap={32}
        w="100%"
        maw={800}
      >
        <Box w={{ base: "100%", xs: "50%" }}>
          <h3>Основна информация</h3>
          <TextInput
            readOnly={!isEdditing}
            label="Име"
            key={editForm.key("firstName")}
            {...editForm.getInputProps("firstName")}
          />
          <TextInput
            readOnly={!isEdditing}
            label="Фамилия"
            key={editForm.key("lastName")}
            {...editForm.getInputProps("lastName")}
          />
          <TextInput
            readOnly={!isEdditing}
            label="Фирма"
            key={editForm.key("companyName")}
            {...editForm.getInputProps("companyName")}
          />
          <TextInput
            readOnly={!isEdditing}
            label="Адрес"
            key={editForm.key("address")}
            {...editForm.getInputProps("address")}
          />
          <TextInput
            readOnly={!isEdditing}
            label="Телефон"
            key={editForm.key("phoneNumber")}
            {...editForm.getInputProps("phoneNumber")}
          />
          <TextInput
            readOnly={!isEdditing}
            label="Имейл"
            key={editForm.key("email")}
            {...editForm.getInputProps("email")}
          />
          <TextInput
            readOnly={!isEdditing}
            label="Факс"
            key={editForm.key("faxNumber")}
            {...editForm.getInputProps("faxNumber")}
          />
          <TextInput
            readOnly={!isEdditing}
            label="Мобилен"
            key={editForm.key("mobilePhoneNumber")}
            {...editForm.getInputProps("mobilePhoneNumber")}
          />
          <TextInput
            readOnly={!isEdditing}
            label="Коментар"
            key={editForm.key("comment")}
            {...editForm.getInputProps("comment")}
          />
        </Box>
        <Box w={{ base: "100%", xs: "50%" }}>
          <Flex justify="space-between" align="center">
            <h3>Допълнителна информация</h3>
            <Button onClick={open}>+</Button>
          </Flex>

          {additionalFields.length > 0 ? (
            additionalFields.map((field) => {
              return (
                <Box key={field.id}>
                  <TextInput
                    w="100%"
                    label={field.name}
                    value={field.value}
                    readOnly
                  />
                  <Box mt="md" mb="md">
                    <Button mr="xs" onClick={() => handleOpenEditField(field)}>
                      Редактирай
                    </Button>
                    <Button
                      bg="red"
                      onClick={() =>
                        modals.openConfirmModal({
                          title: "Изтриване на поле",
                          centered: true,
                          children:
                            "Сигурни ли сте че искате да изтриете това поле?",
                          labels: { cancel: "Отказ", confirm: "Изтрий" },
                          confirmProps: { color: "red" },
                          onConfirm: () => {
                            console.log("delete");
                            modals.close();
                          },
                          onCancel: () => modals.close(),
                        })
                      }
                    >
                      Изтрий
                    </Button>
                  </Box>
                </Box>
              );
            })
          ) : (
            <p>Няма допълнителна информация</p>
          )}
        </Box>
      </Flex>
      {isEdditing ? (
        <Flex mt="md" gap={16}>
          <Button bg="red" onClick={() => setIsEdditing(!isEdditing)}>
            Отказ
          </Button>
          <Button>Запази</Button>
        </Flex>
      ) : (
        <Button mt="md" onClick={() => setIsEdditing(!isEdditing)}>
          Редактирай
        </Button>
      )}
    </Flex>
  );
};

export default Entry;
