import {
  Tabs,
  TextInput,
  PasswordInput,
  Box,
  Flex,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const Auth = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  console.log(auth);

  const handleRegister = async (values) => {
    try {
      const response = await axiosPrivate.post("api/auth/register", {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (values) => {
    try {
      const response = await axiosPrivate.post("api/auth/login", values);
      setAuth({ accessToken: response.data.access_token });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loginForm = useForm({
    mode: "uncontrolled",
    validate: {
      email: (value) =>
        value === undefined
          ? "Имейлът е задължителен"
          : !/^\S+@\S+$/.test(value)
          ? "Моля, въведете валиден имейл"
          : null,
      password: (value) =>
        value === undefined ? "Паролата е задължителна" : null,
    },
  });

  const registrationForm = useForm({
    mode: "uncontrolled",
    validate: {
      firstName: (value) =>
        value === undefined ? "Името е задължително" : null,
      lastName: (value) =>
        value === undefined ? "Фамилията е задължителна" : null,
      email: (value) =>
        value === undefined
          ? "Имейлът е задължителен"
          : !/^\S+@\S+$/.test(value)
          ? "Моля, въведете валиден имейл"
          : null,
      password: (value) =>
        value === undefined ? "Паролата е задължителна" : null,
      confirmPassword: (value, values) =>
        value === undefined
          ? "Потвърдете паролата"
          : value !== values.password
          ? "Паролите не съвпадат"
          : null,
    },
  });

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/", { replace: true });
    }
  }, [auth, navigate]);

  return (
    <Flex justify="center">
      <Box p="lg" maw={400}>
        <h1>Вход/Регистрация</h1>
        <h2>Addrly</h2>

        <Tabs defaultValue="login">
          <Tabs.List grow>
            <Tabs.Tab value="login">Вход</Tabs.Tab>
            <Tabs.Tab value="registration">Регистрация</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="login">
            <form onSubmit={loginForm.onSubmit(handleLogin)}>
              <TextInput
                mt="xs"
                label="Имейл"
                key={loginForm.key("email")}
                {...loginForm.getInputProps("email")}
              />
              <PasswordInput
                mt="xs"
                label="Парола"
                key={loginForm.key("password")}
                {...loginForm.getInputProps("password")}
              />
              <Button mt="lg" type="submit" w="100%">
                Вход
              </Button>
            </form>
          </Tabs.Panel>
          <Tabs.Panel value="registration">
            <form onSubmit={registrationForm.onSubmit(handleRegister)}>
              <TextInput
                withAsterisk
                mt="xs"
                label="Име"
                key={registrationForm.key("firstName")}
                {...registrationForm.getInputProps("firstName")}
              />
              <TextInput
                withAsterisk
                mt="xs"
                label="Фамилия"
                key={registrationForm.key("lastName")}
                {...registrationForm.getInputProps("lastName")}
              />
              <TextInput
                withAsterisk
                mt="xs"
                label="Имейл"
                key={registrationForm.key("email")}
                {...registrationForm.getInputProps("email")}
              />
              <PasswordInput
                withAsterisk
                mt="xs"
                label="Парола"
                key={registrationForm.key("password")}
                {...registrationForm.getInputProps("password")}
              />
              <PasswordInput
                withAsterisk
                mt="xs"
                label="Повтори паролата"
                key={registrationForm.key("confirmPassword")}
                {...registrationForm.getInputProps("confirmPassword")}
              />
              <Button mt="lg" type="submit" w="100%">
                Регистрация
              </Button>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default Auth;
