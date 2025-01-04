import { Route, Routes } from "react-router";
import Layout from "./components/layout/Layout";
import Auth from "./components/auth/Auth";
import RequireAuth from "./components/auth/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/authenticate" element={<Auth />} />
      {/* The app layout is requires authentication */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Layout />} />
      </Route>
    </Routes>
  );
}

export default App;
