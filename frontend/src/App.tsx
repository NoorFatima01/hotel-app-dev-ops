import { Navigate, Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import { BrowserRouter } from "react-router-dom";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./context/AppContext";

function App() {
  const { isLogged } = useAppContext();
  return (
    <BrowserRouter>
      {/* <Router> */}
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <h1>Home</h1>
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <h1>Search</h1>
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />

        {isLogged && <Route path="/add-hotel" element={
          <Layout>
        <AddHotel />

          </Layout>
        } />}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <h1>All other</h1>
      {/* </Router> */}
    </BrowserRouter>
  );
}

export default App;
