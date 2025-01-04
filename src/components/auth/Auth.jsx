import {
  Tabs,
  TextInput,
  PasswordInput,
  Box,
  Flex,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";

const Auth = () => {
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
            <form
              onSubmit={loginForm.onSubmit((values) => console.log(values))}
            >
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
              <Button mt="md" type="submit" w="100%">
                Вход
              </Button>
            </form>
          </Tabs.Panel>
          <Tabs.Panel value="registration">
            <form
              onSubmit={registrationForm.onSubmit((values) =>
                console.log(values)
              )}
            >
              <TextInput
                mt="xs"
                label="Имейл"
                key={registrationForm.key("email")}
                {...registrationForm.getInputProps("email")}
              />
              <PasswordInput
                mt="xs"
                label="Парола"
                key={registrationForm.key("password")}
                {...registrationForm.getInputProps("password")}
              />
              <PasswordInput
                mt="xs"
                label="Повтори паролата"
                key={registrationForm.key("confirmPassword")}
                {...registrationForm.getInputProps("confirmPassword")}
              />
              <Button mt="md" type="submit" w="100%">
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
