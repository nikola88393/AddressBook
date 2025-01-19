import {
  Box,
  Button,
  Flex,
  Notification,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import LoadingElement from "../common/LoadingElement";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [refetechTrigger, setRefetechTrigger] = useState(0);
  const [error, setError] = useState(null);
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
        setError(error.response?.data?.message || "Възникна грешка");
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
          : null,
      lastName: (value) =>
        value === undefined
          ? "Фамилията е задължителна"
          : value.length > 15
          ? "Фамилията трябва да е по-малко от 15 символа"
          : null,
      email: (value) =>
        value === undefined
          ? "Имейлът е задължителен"
          : !/^\S+@\S+$/.test(value)
          ? "Моля, въведете валиден имейл"
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
    const hasChanged = Object.keys(values).some(
      (key) => values[key] !== userData[key]
    );

    if (!hasChanged) {
      return dataform.setErrors({
        firstName: "Няма промени",
        lastName: "Няма промени",
        email: "Няма промени",
      });
    }

    try {
      const response = await axiosPrivate.patch("api/auth/update", values);
      console.log(response.data);
      passForm.reset();
      setRefetechTrigger((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Възникна грешка");
    }
  };

  return (
    <Box pos="relative">
      {error && (
        <Notification color="red" title="Грешка" onClose={() => setError(null)}>
          {error}
        </Notification>
      )}
      <h1>Профил</h1>
      <LoadingElement isLoading={loading} />
      <Flex
        align="start"
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
