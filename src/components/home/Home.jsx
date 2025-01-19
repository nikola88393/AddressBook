import { List } from "@mantine/core";

const Home = () => {
  return (
    <div>
      <h1>Начало</h1>
      <p>
        Проектът представлява адресна книга с основни функционалности за
        управление на потребителски записи, тагове и профили. Ето кратко
        описание на основните функционалности:
      </p>
      <br />
      <List type="ordered">
        <List.Item>Управление на потребителски записи:</List.Item>
        <List withPadding>
          <List.Item>
            Добавяне, редактиране и изтриване на потребителски записи.
          </List.Item>
          <List.Item>
            Търсене и филтриране на записи по име и фамилия.
          </List.Item>
          <List.Item>
            Експорт на записи в различни формати (CSV, JSON, XLSX).
          </List.Item>
          <List.Item>Добавяне на допълнителни полета към записите.</List.Item>
        </List>
        <List.Item>Управление на тагове:</List.Item>
        <List withPadding>
          <List.Item>Добавяне, редактиране и изтриване на тагове.</List.Item>
          <List.Item>Присвояване на тагове към потребителски записи.</List.Item>
        </List>
        <List.Item>Преглед и редакция на потребителския профил.</List.Item>
        <List withPadding>
          <List.Item>Преглед и редакция на потребителския профил.</List.Item>
          <List.Item>Промяна на парола.</List.Item>
        </List>
        <List.Item>Аутентикация и авторизация:</List.Item>
        <List withPadding>
          <List.Item>Регистрация и вход на потребители.</List.Item>
          <List.Item>
            Защитени маршрути, достъпни само за аутентикирани потребители.
          </List.Item>
          <List.Item>Автоматично обновяване на токена за достъп.</List.Item>
        </List>
        <List.Item>Интерфейс и навигация:</List.Item>
        <List withPadding>
          <List.Item>
            Удобен и интуитивен потребителски интерфейс с използване на Mantine
            UI компоненти.
          </List.Item>
          <List.Item>
            Навигация между различните секции на приложението (записи, тагове,
            профил).
          </List.Item>
        </List>
      </List>
      <br />
      <p>
        Тези функционалности осигуряват лесно и ефективно управление на
        контактите и информацията за тях в адресната книга.
      </p>
    </div>
  );
};

export default Home;
