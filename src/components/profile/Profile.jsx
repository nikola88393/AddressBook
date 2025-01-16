import { Box, Button, Flex, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingElement from "../common/LoadingElement";

const testUserData = {
  firstName: "Иван",
  lastName: "Иванов",
  email: "ivan@abv.bg",
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const axiosPrivate = useAxiosPrivate();

  const dataform = useForm({
    mode: "uncontrolled",
    // initialValues: userData,
    validate: {
      firstName: (value) =>
        value === undefined
          ? "Името е задължително"
          : value.length > 15
          ? "Името трябва да е по-малко от 15 символа"
          : value === userData.firstName
          ? "Името трявбва да бъде различно от текущото"
          : null,
      lastName: (value) =>
        value === undefined
          ? "Фамилията е задължителна"
          : value.length > 15
          ? "Фамилията трябва да е по-малко от 15 символа"
          : value === userData.lastName
          ? "Фамилията трявбва да бъде различна от текущата"
          : null,
      email: (value) =>
        value === undefined
          ? "Имейлът е задължителен"
          : !/^\S+@\S+$/.test(value)
          ? "Моля, въведете валиден имейл"
          : value === userData.email
          ? "Имейлът трявбва да бъде различен"
          : null,
    },
  });

  useEffect(() => {
    setLoading(true);

    const getData = async () => {
      try {
        // const response = await axiosPrivate.get("/users/me");
        // setUserData(response.data);
        setUserData(testUserData);
        dataform.setValues(testUserData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

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
    console.log("Submitting values:", values);
    setUserData(values);
    alert("Profile updated successfully!");
  };

  return (
    <Box pos="relative">
      <h1>Профил</h1>
      <LoadingElement isLoading={loading} />
      <Flex
        align="center"
        justify="start"
        direction={{ base: "column", md: "row" }}
        gap={32}
      >
        <Box pos="relative" maw={300} w={{ base: "100%", xs: "50%" }}>
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
        <Box pos="relative" maw={300} w={{ base: "100%", xs: "50%" }}>
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
