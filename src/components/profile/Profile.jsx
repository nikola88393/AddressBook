import { Box, Button, Flex, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingElement from "../common/LoadingElement";
import { data } from "react-router";

const testUserData = {
  firstName: "Иван",
  lastName: "Иванов",
  email: "ivan@abv.bg",
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [refetechTrigger, setRefetechTrigger] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setLoading(true);

    const getUserData = async () => {
      try {
        const response = await axiosPrivate.get("api/auth/current-user");
        setUserData(response.data);
        dataform.setValues(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [refetechTrigger, axiosPrivate]);

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

  const passForm = useForm({
    mode: "uncontrolled",
    validate: {
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

  const handleUpdate = async (values) => {
    try {
      const response = await axiosPrivate.patch("api/auth/update", values);
      console.log(response.data);
      passForm.reset();
    } catch (error) {
      console.error(error);
    }
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
          <form onSubmit={dataform.onSubmit(handleUpdate)}>
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
          <form
            onSubmit={passForm.onSubmit((values) =>
              handleUpdate({ password: values.newPassword })
            )}
          >
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
