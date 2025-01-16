import {
  Modal,
  Button,
  TextInput,
  Stack,
  Card,
  Pagination,
  Flex,
  NativeSelect,
  Divider,
  Badge,
  Box,
  Tabs,
  Fieldset,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import LoadingElement from "../common/LoadingElement";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";

const Entries = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeEntry, setActiveEntry] = useState(null);
  const [addressBook, setAddressBook] = useState([]);
  const [refetechTrigger, setRefetechTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [customFields, setCustomFields] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const addForm = useForm({
    mode: "uncontrolled",
    validate: {
      firstName: (value) =>
        value === undefined ? "Името е задължително" : null,
      lastName: (value) =>
        value === undefined ? "Фамилията е задължителна" : null,
      companyName: (value) =>
        value === undefined ? "Фирмата е задължителна" : null,
      address: (value) =>
        value === undefined ? "Адресът е задължителен" : null,
      phoneNumber: (value) =>
        value === undefined ? "Телефонът е задължителен" : null,
      email: (value) => (value === undefined ? "Имейлът е задължителен" : null),
      faxNumber: (value) =>
        value === undefined ? "Факсът е задължителен" : null,
      mobilePhoneNumber: (value) =>
        value === undefined ? "Мобилният е задължителен" : null,
      comment: (value) =>
        value === undefined ? "Коментарът е задължителен" : null,
    },
  });

  // Fetch data from the server
  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        const response = await axiosPrivate.get("api/user-record");
        console.log(response);
        setAddressBook(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [refetechTrigger, axiosPrivate]);

  const handleOpen = () => {
    // console.log(entry);
    // setActiveEntry(entry);
    open();
  };

  // Add record
  const handleAddRecord = async (values) => {
    const customFieldValues = customFields.reduce((acc, field) => {
      acc[field.name] = values[field.name];
      return acc;
    }, {});

    const payload = { ...values, ...customFieldValues };

    try {
      const response = await axiosPrivate.post("api/user-record", payload);
      console.log(response.data);
      setRefetechTrigger((prev) => prev + 1);
      close();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete record
  const handleDeleteRecord = async (id) => {
    try {
      const response = await axiosPrivate.delete("api/user-record/delete", {
        data: { recordId: id },
      });
      console.log(response.data);
      setRefetechTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCustomField = () => {
    setCustomFields((prev) => [
      ...prev,
      { id: Date.now(), name: "", label: "", type: "text" },
    ]);
  };

  const handleCustomFieldChange = (id, field, value) => {
    setCustomFields((prev) =>
      prev.map((customField) =>
        customField.id === id ? { ...customField, [field]: value } : customField
      )
    );
  };

  const handleRemoveCustomField = (id) => {
    setCustomFields((prev) =>
      prev.filter((customField) => customField.id !== id)
    );
  };

  return (
    <Box pos="relative">
      <LoadingElement isLoading={isLoading} />
      <Flex align="center" justify="space-between">
        <h1>Записи</h1>
        <Button onClick={() => handleOpen({})}>+</Button>
      </Flex>

      <Flex
        direction={{ base: "column-reverse", md: "row" }}
        mb="xl"
        align={{ base: "start", md: "center" }}
        gap="md"
      >
        <Flex
          w={{ base: "100%", md: "auto" }}
          direction={{ base: "column", xs: "row" }}
          align="center"
          gap="md"
        >
          <NativeSelect
            label="Подреди по"
            w={{ base: "100%", md: "auto" }}
            data={["Всички", "Еднакви имена", "Еднакви фамилии", "Обобщено"]}
          />
          <NativeSelect
            label="Етикети"
            w={{ base: "100%", md: "auto" }}
            data={["Всички", "Еднакви имена", "Еднакви фамилии", "Обобщено"]}
          />
        </Flex>
        <Flex w={{ base: "100%", md: "auto" }} gap="md" align="end">
          <TextInput
            w={{ base: "100%", md: "auto" }}
            placeholder="Търсене по име"
            label="Търсене по име"
          />
          <Button>?</Button>
        </Flex>
      </Flex>
      <Modal opened={opened} onClose={close} title="Детайли за контакт">
        <div>
          <form onSubmit={addForm.onSubmit(handleAddRecord)}>
            <Tabs defaultValue="details" variant="outline">
              <Tabs.List grow>
                <Tabs.Tab value="details">Детайли</Tabs.Tab>
                <Tabs.Tab value="additional">Допълнителни</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="details">
                <TextInput
                  label="Име"
                  key={addForm.key("firstName")}
                  {...addForm.getInputProps("firstName")}
                />
                <TextInput
                  label="Фамилия"
                  key={addForm.key("lastName")}
                  {...addForm.getInputProps("lastName")}
                />
                <TextInput
                  label="Фирма"
                  key={addForm.key("companyName")}
                  {...addForm.getInputProps("companyName")}
                />
                <TextInput
                  label="Адрес"
                  key={addForm.key("address")}
                  {...addForm.getInputProps("address")}
                />
                <TextInput
                  label="Телефон"
                  key={addForm.key("phoneNumber")}
                  {...addForm.getInputProps("phoneNumber")}
                />
                <TextInput
                  label="Имейл"
                  key={addForm.key("email")}
                  {...addForm.getInputProps("email")}
                />
                <TextInput
                  label="Факс"
                  key={addForm.key("faxNumber")}
                  {...addForm.getInputProps("faxNumber")}
                />
                <TextInput
                  label="Мобилен"
                  key={addForm.key("mobilePhoneNumber")}
                  {...addForm.getInputProps("mobilePhoneNumber")}
                />
                <TextInput
                  label="Коментар"
                  key={addForm.key("comment")}
                  {...addForm.getInputProps("comment")}
                />
                <Button type="submit" mt="md">
                  Запази
                </Button>
              </Tabs.Panel>
              <Tabs.Panel value="additional">
                {customFields.map((field) => (
                  <Flex key={field.id} gap="sm" mb="sm">
                    <TextInput
                      placeholder="Име на полето"
                      value={field.name}
                      onChange={(e) =>
                        handleCustomFieldChange(
                          field.id,
                          "name",
                          e.target.value
                        )
                      }
                    />
                    <TextInput
                      placeholder="Етикет на полето"
                      value={field.label}
                      onChange={(e) =>
                        handleCustomFieldChange(
                          field.id,
                          "label",
                          e.target.value
                        )
                      }
                    />
                    <NativeSelect
                      data={["text", "number", "email", "date"]}
                      value={field.type}
                      onChange={(e) =>
                        handleCustomFieldChange(
                          field.id,
                          "type",
                          e.target.value
                        )
                      }
                    />
                    <Button
                      color="red"
                      onClick={() => handleRemoveCustomField(field.id)}
                    >
                      X
                    </Button>
                  </Flex>
                ))}
                <Button onClick={handleAddCustomField} mt="sm">
                  Добави поле +
                </Button>
              </Tabs.Panel>
            </Tabs>
          </form>
        </div>
      </Modal>
      <Divider my="sm" />
      <Stack>
        {addressBook.length === 0 ? (
          <div>Няма записи</div>
        ) : (
          addressBook.map((entry) => (
            <Box pos="relative" p={10} key={entry.id}>
              {entry.badge && (
                <Badge
                  radius="sm"
                  color={entry.badgeColor}
                  style={{ zIndex: 2 }}
                  pos="absolute"
                  top={4}
                  left={30}
                >
                  {entry.badge}
                </Badge>
              )}
              <Card p="xl">
                <Flex
                  direction={{ base: "column", md: "row" }}
                  gap="md"
                  justify="space-between"
                  align={{ base: "start", md: "center" }}
                >
                  <Flex direction={{ base: "column", md: "row" }} gap="xl">
                    <span>{entry.firstName + " " + entry.lastName}</span>
                    <span>{entry.email}</span>
                    <span>{entry.phoneNumber}</span>
                  </Flex>
                  <Flex direction={{ base: "row", xl: "column" }} gap="xs">
                    <Button
                      onClick={() =>
                        navigate(`/entries/${entry.id}`, { state: entry })
                      }
                    >
                      Виж
                    </Button>
                    <Button
                      color="red"
                      onClick={() =>
                        modals.openConfirmModal({
                          title: "Изтриване на контакт",
                          centered: true,
                          children:
                            "Сигурни ли сте, че искате да изтриете този контакт?",
                          labels: { cancel: "Отказ", confirm: "Изтрий" },
                          confirmProps: { color: "red" },
                          onConfirm: () => {
                            handleDeleteRecord(entry.id);
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
            </Box>
          ))
        )}
      </Stack>
      <Pagination w="fit-content" mr="auto" ml="auto" mt="lg" />
    </Box>
  );
};

export default Entries;
