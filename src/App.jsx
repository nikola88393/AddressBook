import { Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import Auth from "./components/auth/Auth";
import RequireAuth from "./components/auth/RequireAuth";
import Error404 from "./components/common/Error404";
import Entries from "./components/entries/Entries";
import Tags from "./components/tags/Tags";
import Profile from "./components/profile/Profile";
import Entry from "./components/entries/Entry";
import Home from "./components/home/Home";

function App() {
  return (
    <Routes>
      <Route path="/authenticate" element={<Auth />} />
      {/* The app layout is requires authentication */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route index path="/entries" element={<Entries />} />
          <Route path="/entries/:entryId" element={<Entry />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
