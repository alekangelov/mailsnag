import EmailList from "./components/Emails";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Layout from "./components/Layout";
import SettingsModal from "./components/SettingsModal";
import SingleEmail from "./components/SingleEmail";
import { DataProvider } from "./hooks/useData";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <SettingsModal />
      <Header />
      <DataProvider />
      <div className="flex-1">
        <Layout>
          <Outlet />
        </Layout>
      </div>
      <Footer />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <EmailList /> },
      { path: "/:id", element: <SingleEmail /> },
    ],
  },
]);

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
