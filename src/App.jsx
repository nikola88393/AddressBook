import { Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import Auth from "./components/auth/Auth";
import RequireAuth from "./components/auth/RequireAuth";
import Error404 from "./components/common/Error404";

function App() {
  return (
    <Routes>
      <Route path="/authenticate" element={<Auth />} />
      {/* The app layout is requires authentication */}
      {/* <Route element={<RequireAuth />}> */}
      <Route path="/" element={<Layout />} />
      {/* </Route> */}

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
