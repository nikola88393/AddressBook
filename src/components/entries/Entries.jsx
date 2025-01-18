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
  const [addressBook, setAddressBook] = useState({ records: [], total: 0 });
  const [refetechTrigger, setRefetechTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setPage] = useState(1);
  const [exportData, setExportData] = useState(null);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState({ firstName: "", lastName: "" });

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

  const exportForm = useForm({
    mode: "uncontrolled",
    initialValues: {
      exportType: "csv",
    },
  });

  const searchForm = useForm({
    mode: "uncontrolled",
    validate: {
      search: (value) =>
        value === undefined ? "Търсенето е задължително" : null,
    },
  });

  // Fetch data from the server
  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        const response = await axiosPrivate.get(
          `api/user-record/?page=${activePage}${filter || ""}${
            search.firstName && `&firstName=${search.firstName}`
          }${search.lastName && `&lastName=${search.lastName}`}`
        );
        console.log(response);
        setAddressBook(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [refetechTrigger, axiosPrivate, activePage, filter, search]);

  // Add record
  const handleAddRecord = async (values) => {
    try {
      console.log(values);
      const { tagId, ...record } = values;
      const response = await axiosPrivate.post("api/user-record", {
        record,
        tagId,
      });
      console.log(response.data);
      setRefetechTrigger((prev) => prev + 1);
      addForm.reset();
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

  //Handle export records
  const handleExportRecords = async (values) => {
    try {
      const response = await axiosPrivate.get(
        `api/user-record/export-records?format=${values.exportType}`,
        { responseType: "blob" } // Important: Set response type to 'blob'
      );

      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a URL for the Blob
      const downloadUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `exported_records.${values.exportType}`; // Set the file name
      document.body.appendChild(a);
      a.click();

      // Clean up
      URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleFilter = (value) => {
    setSearch({ firstName: "", lastName: "" });
    setFilter(value);
  };

  const handleSearch = (values) => {
    setFilter("");
    const name = values.search.split(" ");
    setSearch({ firstName: name[0] || "", lastName: name[1] || "" });
    console.log({ firstName: name[0] || "", lastName: name[1] || "" });
  };

  return (
    <Box pos="relative" h="100%">
      <LoadingElement isLoading={isLoading} />
      <Flex
        align={{ base: "start", xs: "center" }}
        justify="space-between"
        direction={{ base: "column", xs: "row" }}
        mb={{ base: "lg", md: "0" }}
      >
        <h1>Записи</h1>
        <form onSubmit={exportForm.onSubmit(handleExportRecords)}>
          <Flex align="end" gap="md">
            <NativeSelect
              data={[
                { label: "CSV", value: "csv" },
                { label: "JSON", value: "json" },
                { label: "XLSX", value: "xlsx" },
              ]}
              key={exportForm.key("exportType")}
              {...exportForm.getInputProps("exportType")}
            />
            <Button type="submit">Експорт</Button>
            <Divider orientation="vertical" />
            <Button onClick={open}>+</Button>
          </Flex>
        </form>
      </Flex>

      <Flex
        direction={{ base: "column-reverse", md: "row" }}
        mb="xl"
        align={{ base: "start", md: "center" }}
        gap="md"
      >
        <Select
          data={[
            { label: "Всички", value: "" },
            {
              label: "Еднакви имена",
              value: "&sameFirstNameDiffLastName=true",
            },
            {
              label: "Еднакви фамилии",
              value: "&sameLastNameDiffFirstName=true",
            },
            { label: "Обобщено", value: "&mostUsedTags=true" },
          ]}
          onChange={handleFilter}
          placeholder="Филтриране"
          label="Филтриране"
          value={filter}
        />
        <form onSubmit={searchForm.onSubmit(handleSearch)}>
          <Flex w={{ base: "100%", md: "auto" }} gap="md" align="end">
            <TextInput
              w={{ base: "100%", md: "auto" }}
              placeholder="Търсене по име"
              label="Търсене по име"
              key={searchForm.key("search")}
              {...searchForm.getInputProps("search")}
            />
            <Button type="submit" mt>
              ?
            </Button>
          </Flex>
        </form>
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
              key={addForm.key("tagId")}
              {...addForm.getInputProps("tagId")}
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
        {addressBook.records.length === 0 ? (
          <div>Няма записи</div>
        ) : (
          addressBook.records.map((entry) => (
            <Box pos="relative" p={10} key={entry.id}>
              {entry.tags && entry.tags.length > 0 && (
                <Badge
                  radius="sm"
                  color={entry.tags[0].color}
                  style={{ zIndex: 2 }}
                  pos="absolute"
                  top={4}
                  left={30}
                >
                  {entry.tags[0].name}
                </Badge>
              )}
              <Card p="xl" withBorder>
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
      <Pagination
        w="fit-content"
        mr="auto"
        ml="auto"
        value={activePage}
        onChange={setPage}
        total={Math.ceil(addressBook.total / 10)}
      />
    </Box>
  );
};

export default Entries;
