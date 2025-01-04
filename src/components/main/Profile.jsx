import { Box, Button, Flex, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

const testUserData = {
  firstName: "Иван",
  lastName: "Иванов",
  email: "ivan@abv.bg",
};

const Profile = () => {
  const [userData, setUserData] = useState(testUserData);

  const dataform = useForm({
    mode: "uncontrolled",
    initialValues: testUserData,
    validate: {
      firstName: (value) =>
        value === undefined
          ? "Името е задължително"
          : value.length > 15
          ? "Името трябва да е по-малко от 15 символа"
          : value === testUserData.firstName
          ? "Името трявбва да бъде различно от текущото"
          : null,
      lastName: (value) =>
        value === undefined
          ? "Фамилията е задължителна"
          : value.length > 15
          ? "Фамилията трябва да е по-малко от 15 символа"
          : value === testUserData.lastName
          ? "Фамилията трявбва да бъде различна от текущата"
          : null,
      email: (value) =>
        value === undefined
          ? "Имейлът е задължителен"
          : !/^\S+@\S+$/.test(value)
          ? "Моля, въведете валиден имейл"
          : value === testUserData.email
          ? "Имейлът трявбва да бъде различен"
          : null,
    },
  });

  const passForm = useForm({
    mode: "uncontrolled",
    validate: {
      oldPassword: (value) =>
        value === undefined ? "Старата парола е задължителна" : null,
      newPassword: (value) =>
        value === undefined ? "Новата парола е задължителна" : null,
      confirmPassword: (value, values) =>
        value === undefined
          ? "Потвърдете новата парола"
          : value !== values.newPassword
          ? "Паролите не съвпадат"
          : null,
    },
  });

  const handleSubmit = (values) => {
    if (!areValuesChanged(values)) {
      return;
    }
    console.log("Submitting values:", values);
    setUserData(values);
    alert("Profile updated successfully!");
  };

  const areValuesChanged = (values) => {
    return (
      values.firstName !== userData.firstName ||
      values.lastName !== userData.lastName ||
      values.email !== userData.email
    );
  };

  return (
    <Box>
      <h1>Профил</h1>
      <Flex
        align="center"
        justify="start"
        direction={{ base: "column", md: "row" }}
        gap={32}
      >
        <Box maw={300} w={{ base: "100%", xs: "50%" }}>
          <form onSubmit={dataform.onSubmit(handleSubmit)}>
            <TextInput
              mt="xs"
              mb="md"
              label="Име"
              key={dataform.key("firstName")}
              {...dataform.getInputProps("firstName")}
            />
            <TextInput
              mt="xs"
              label="Фамилия"
              key={dataform.key("lastName")}
              {...dataform.getInputProps("lastName")}
            />
            <TextInput
              mt="xs"
              label="Имейл"
              key={dataform.key("email")}
              {...dataform.getInputProps("email")}
            />
            <Button w="100%" type="submit" mt="sm">
              Запази
            </Button>
          </form>
        </Box>
        <Box maw={300} w={{ base: "100%", xs: "50%" }}>
          <form onSubmit={passForm.onSubmit((values) => console.log(values))}>
            <PasswordInput
              mt="xs"
              label="Стара парола"
              key={passForm.key("oldPassword")}
              {...passForm.getInputProps("oldPassword")}
            />
            <PasswordInput
              mt="xs"
              label="Нова парола"
              key={passForm.key("newPassword")}
              {...passForm.getInputProps("newPassword")}
            />
            <PasswordInput
              mt="xs"
              label="Потвърди паролата"
              key={passForm.key("confirmPassword")}
              {...passForm.getInputProps("confirmPassword")}
            />
            <Button w="100%" type="submit" mt="sm">
              Запази
            </Button>
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default Profile;
