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
  Select,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import LoadingElement from "../common/LoadingElement";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";
import useTags from "../../hooks/useTags";

const Entries = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { tags } = useTags();
  const [addressBook, setAddressBook] = useState([]);
  const [refetechTrigger, setRefetechTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const addForm = useForm({
    mode: "uncontrolled",
    validate: {
      firstName: (value) =>
        value === undefined ? "Името е задължително" : null,
      phoneNumber: (value) =>
        value === undefined ? "Телефонът е задължителен" : null,
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

  // Add record
  const handleAddRecord = async (values) => {
    try {
      console.log(values);
      const response = await axiosPrivate.post("api/user-record", values);
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

  return (
    <Box pos="relative">
      <LoadingElement isLoading={isLoading} />
      <Flex align="center" justify="space-between">
        <h1>Записи</h1>
        <Button onClick={open}>+</Button>
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
            <Select
              label="Етикет"
              data={tags.map((tag) => {
                return {
                  label: tag.name,
                  value: tag.id,
                };
              })}
              key={addForm.key("tag")}
              {...addForm.getInputProps("tag")}
            />
            <TextInput
              withAsterisk
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
              withAsterisk
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
            <Textarea
              label="Коментар"
              key={addForm.key("comment")}
              {...addForm.getInputProps("comment")}
            />
            <Button type="submit" mt="md">
              Запази
            </Button>
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
