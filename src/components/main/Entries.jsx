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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { modals } from "@mantine/modals";

const addressBookData = [
  {
    id: 1,
    firstName: "Иван",
    lastName: "Петров",
    companyName: "Петров Логистика",
    address: "гр. София, ул. 'Иван Вазов' 15",
    phoneNumber: "02/1234567",
    emailAddress: "ivan.petrov@email.com",
    faxNumber: "02/7654321",
    mobilePhoneNumber: "0888123456",
    comment: "Основен контакт за логистика",
    badge: "Логистика",
    badgeColor: "blue",
  },
  {
    id: 2,
    firstName: "Мария",
    lastName: "Иванова",
    companyName: "Детски свят",
    address: "гр. Пловдив, ул. 'Марица' 23",
    phoneNumber: "032/223344",
    emailAddress: "maria.ivanova@email.bg",
    faxNumber: "032/443322",
    mobilePhoneNumber: "0899123456",
    comment: "Клиент за играчки",
    badge: "Детски магазин",
    badgeColor: "green",
  },
  {
    id: 3,
    firstName: "Георги Георги Георги",
    lastName: "Димитров",
    companyName: "Димитров ЕООД",
    address: "гр. Варна, бул. 'Черно море' 12",
    phoneNumber: "052/334455",
    emailAddress: "georgi.dimitrov@mail.bg",
    faxNumber: "052/554433",
    mobilePhoneNumber: "0878123456",
    comment: "Доставчик на офис консумативи",
    badge: "Доставчик",
    badgeColor: "red",
  },
  {
    id: 4,
    firstName: "Елена",
    lastName: "Костова",
    companyName: "Костова Стил",
    address: "гр. Бургас, ул. 'Александровска' 48",
    phoneNumber: "056/112233",
    emailAddress: "elena.kostova@mail.com",
    faxNumber: "056/332211",
    mobilePhoneNumber: "0886123456",
    comment: "Контакт за дизайнерски услуги",
    badge: "Дизайнер",
    badgeColor: "purple",
  },
  {
    id: 5,
    firstName: "Николай",
    lastName: "Тодоров",
    companyName: "Тодоров Имоти",
    address: "гр. Русе, ул. 'Дунав' 10",
    phoneNumber: "082/445566",
    emailAddress: "nikolay.todorov@mail.bg",
    faxNumber: "082/665544",
    mobilePhoneNumber: "0885123456",
    comment: "Брокер на недвижими имоти",
    badge: "Брокер",
    badgeColor: "orange",
  },
];
const Entries = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [activeEntry, setActiveEntry] = useState(null);
  const [addressBook, setAddressBook] = useState(addressBookData);

  const handleOpen = (entry) => {
    console.log(entry);
    setActiveEntry(entry);
    open();
  };
  const handleInputChange = (field, value) => {
    setActiveEntry((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setAddressBook((prev) =>
      prev.map((entry) =>
        entry.id === activeEntry.id ? { ...activeEntry } : entry
      )
    );
    close();
  };

  const deleteEntry = (id) => {
    setAddressBook((prev) => prev.filter((entry) => entry.id !== id));
  };
  return (
    <>
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
        {activeEntry ? (
          <div>
            <TextInput
              label="Име"
              value={activeEntry.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
            <TextInput
              label="Фамилия"
              value={activeEntry.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
            <TextInput
              label="Фирма"
              value={activeEntry.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
            />
            <TextInput
              label="Адрес"
              value={activeEntry.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
            <TextInput
              label="Телефон"
              value={activeEntry.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
            <TextInput
              label="Имейл"
              value={activeEntry.emailAddress}
              onChange={(e) =>
                handleInputChange("emailAddress", e.target.value)
              }
            />
            <TextInput
              label="Факс"
              value={activeEntry.faxNumber}
              onChange={(e) => handleInputChange("faxNumber", e.target.value)}
            />
            <TextInput
              label="Мобилен"
              value={activeEntry.mobilePhoneNumber}
              onChange={(e) =>
                handleInputChange("mobilePhoneNumber", e.target.value)
              }
            />
            <TextInput
              label="Коментар"
              value={activeEntry.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
            />
            <Button onClick={handleSave} mt="md">
              Запази
            </Button>
          </div>
        ) : (
          <p>Няма избрани данни.</p>
        )}
      </Modal>
      <Divider my="sm" />
      <Stack>
        {addressBook.map((entry) => {
          return (
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
                    <span>{entry.emailAddress}</span>
                    <span>{entry.phoneNumber}</span>
                  </Flex>
                  <Flex direction={{ base: "row", xl: "column" }} gap="xs">
                    <Button onClick={() => handleOpen(entry)}>Виж</Button>
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
                            deleteEntry(entry.id);
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
          );
        })}
      </Stack>
      <Pagination w="fit-content" mr="auto" ml="auto" mt="lg" />
    </>
  );
};

export default Entries;
