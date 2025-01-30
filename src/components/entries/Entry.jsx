import { TextInput, Button, Flex, Box, Modal, Select } from "@mantine/core";
import { useParams } from "react-router";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useTags from "../../hooks/useTags";
import { Notification } from "@mantine/core";

const Entry = () => {
  const [isEdditing, setIsEdditing] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [refetechTrigger, setRefetechTrigger] = useState(0);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);
  const { entryId } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const { tags } = useTags();
  console.log(entryId);

  const editForm = useForm({
    mode: "uncontrolled",
    validate: {
      firstName: (value) => {
        if (!value) return "Името е задължително";
        return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)
          ? null
          : "Невалидно име (разрешени са букви, тирета и апострофи)";
      },
      lastName: (value) =>
        /^[a-zA-ZÀ-ÿ\s'-]*$/.test(value || "") ? null : "Невалидна фамилия",
      companyName: (value) =>
        /^[a-zA-Z0-9À-ÿ\s'&.,-]*$/.test(value || "")
          ? null
          : "Невалидно име на фирма",
      address: (value) =>
        /^[\w\s/,.-]*$/.test(value || "") ? null : "Невалиден адрес",
      phoneNumber: (value) => {
        if (!value) return "Телефонът е задължителен";
        return /^\+?[0-9\s-()]{6,}$/.test(value)
          ? null
          : "Невалиден формат на телефон";
      },
      email: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "")
          ? null
          : "Невалиден имейл адрес",
      faxNumber: (value) =>
        /^\+?[0-9\s-()]*$/.test(value || "") ? null : "Невалиден факс номер",
      mobilePhoneNumber: (value) =>
        /^\+?[0-9\s-()]*$/.test(value || "") ? null : "Невалиден мобилен номер",
    },
  });

  const setInitialValues = (data) => {
    editForm.setValues(data);
    if (data.tags?.length > 0) {
      editForm.setFieldValue(
        "tagId",
        tags.find((tag) => tag.id === data.tags[0].id).id
      );
    }
  };

  useEffect(() => {
    const getRecord = async () => {
      try {
        const response = await axiosPrivate.get(`api/user-record/${entryId}`);
        console.log(response);
        setRecord(response.data);
        setInitialValues(response.data);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message || "Грешка при зареждане на данните"
        );
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

  const updateRecord = async (values) => {
    console.log(typeof values);
    delete values.tags;
    delete values.customFields;
    delete values.id;
    delete values.userId;
    const { tagId, ...updatedRecord } = values;
    try {
      const response = await axiosPrivate.post(
        `api/user-record/update/${record.id}`,
        {
          tagId,
          updatedRecord,
        }
      );
      console.log(response);
      setRefetechTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Грешка при обновяване на данните"
      );
    }
  };

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
      setError(
        error.response?.data?.message || "Грешка при добавяне на данните"
      );
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
      console.log(error);
      setError(
        error.response?.data?.message || "Грешка при редактиране на данните"
      );
    }
  };

  const deleteCustomField = async (fieldId) => {
    try {
      const response = await axiosPrivate.delete(`api/custom-field/${fieldId}`);
      console.log(response);
      setRefetechTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Грешка при изтриване на данните"
      );
    }
  };

  //handle modal close
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
      {error && (
        <Notification onClose={() => setError(null)} color="red" title="Грешка">
          {error}
        </Notification>
      )}

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
            withAsterisk
            key={customFieldForm.key("name")}
            {...customFieldForm.getInputProps("name")}
          />
          <TextInput
            withAsterisk
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
          <form onSubmit={editForm.onSubmit(updateRecord)}>
            <h3>Основна информация</h3>
            <Select
              label="Етикет"
              readOnly={!isEdditing}
              data={tags.map((tag) => {
                return {
                  label: tag.name,
                  value: tag.id,
                };
              })}
              key={editForm.key("tagId")}
              {...editForm.getInputProps("tagId")}
            />
            <TextInput
              readOnly={!isEdditing}
              label="Име"
              withAsterisk
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
              withAsterisk
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
            {isEdditing ? (
              <Flex mt="md" gap={16}>
                <Button bg="red" onClick={() => setIsEdditing(!isEdditing)}>
                  Отказ
                </Button>
                <Button type="submit">Запази</Button>
              </Flex>
            ) : (
              <Button mt="md" onClick={() => setIsEdditing(!isEdditing)}>
                Редактирай
              </Button>
            )}
          </form>
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
    </Flex>
  );
};

export default Entry;
