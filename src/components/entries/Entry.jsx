import { TextInput, Button, Flex, Box, Modal } from "@mantine/core";
import { useParams } from "react-router";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Entry = () => {
  const [isEdditing, setIsEdditing] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [refetechTrigger, setRefetechTrigger] = useState(0);
  const [record, setRecord] = useState(null);
  const { entryId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  console.log(entryId);

  const editForm = useForm({
    mode: "uncontrolled",
    validate: {},
  });

  useEffect(() => {
    const getRecord = async () => {
      try {
        const response = await axiosPrivate.get(`api/user-record/${entryId}`);
        console.log(response);
        setRecord(response.data);
        editForm.setValues(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getRecord();
  }, [axiosPrivate, entryId, refetechTrigger]);

  const customFieldForm = useForm({
    mode: "uncontrolled",
    validate: {
      name: (value) => (value === undefined ? "Името е задължително" : null),
      value: (value) =>
        value === undefined ? "Стойността е задължителна" : null,
    },
  });

  const addCustomField = async (values) => {
    try {
      const response = await axiosPrivate.post(
        `api/custom-field/${entryId}`,
        values
      );
      console.log(response);
      close();
      setRefetechTrigger((prev) => prev + 1);
      setIsFieldEditing(false);
      setEditingFieldId(null);
      customFieldForm.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const editCustomField = async (values) => {
    try {
      const response = await axiosPrivate.patch(
        `api/custom-field/${editingFieldId}`,
        values
      );
      console.log(response);
      close();
      setRefetechTrigger((prev) => prev + 1);
      setIsFieldEditing(false);
      setEditingFieldId(null);
      customFieldForm.reset();
    } catch (error) {
      console;
    }
  };

  const deleteCustomField = async (fieldId) => {
    try {
      const response = await axiosPrivate.delete(`api/custom-field/${fieldId}`);
      console.log(response);
      setRefetechTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    customFieldForm.reset();
    setIsFieldEditing(false);
    setEditingFieldId(null);
    close();
  };

  //open modal for editting field
  const handleOpenEditField = (field) => {
    setIsFieldEditing(true);
    setEditingFieldId(field.id);
    customFieldForm.setValues({ name: field.name, value: field.value });
    console.log(field);
    open();
  };

  if (!record) {
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
            isFieldEditing ? editCustomField : addCustomField
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

          {record.customFields.length > 0 ? (
            record.customFields.map((field) => {
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
                            deleteCustomField(field.id);
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
