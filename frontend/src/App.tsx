import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import { SignIn } from "./pages/auth/SignIn";
import SelectTemplate from "./pages/SelectTemplate";
import CutomizeTemplate from "./pages/v-Card/CustomizTemplate";
import VCard from "./pages/v-Card/Template";
import ClientDashboard from "./pages/ClientDashboard";
import { AdminDashboard } from "./pages/admin/Admin";
import MenuTemplate from "./pages/menu/MenuTemplate";
import AddCard from "./pages/admin/AddCard";
import Cards from "./pages/admin/Cards";
import Clients from "./pages/admin/Clients";
import FileTemplate from "./pages/file/FileTemplate";
import EditTemplate from "./pages/v-Card/EditTemplate";
import EditMenu from "./pages/menu/EditMenu";
import ProtectedTemplate from "./components/auth/ProtectedTemplate";
import ProtectAuthRoute from "./components/auth/ProtectAuthRoute";
import Layout from "./Layout";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/global/ErrorBoundary";
import ProtectAdminPage from "./components/auth/ProtectAdminPage";
import VerifyEmail from "./pages/auth/VerifyEmail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signup", element: <Signup /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      {
        path: "/select-template",
        element: (
          <ProtectAuthRoute>
            <SelectTemplate />
          </ProtectAuthRoute>
        ),
      },
      {
        path: "/customize-template",
        element: (
          <ProtectAuthRoute>
            <CutomizeTemplate />
          </ProtectAuthRoute>
        ),
      },
      {
        path: "/template",
        element: <VCard />,
      },
      {
        path: "/edit-template",
        element: (
          <ProtectedTemplate>
            <EditTemplate />
          </ProtectedTemplate>
        ),
      },
      {
        path: "/menu-template",
        element: <MenuTemplate />,
      },
      {
        path: "/edit-menu",
        element: (
          <ProtectedTemplate>
            <EditMenu />
          </ProtectedTemplate>
        ),
      },
      {
        path: "/client-dashboard",
        element: (
          <ProtectAuthRoute>
            <ClientDashboard />
          </ProtectAuthRoute>
        ),
      },
      {
        element: <ProtectAdminPage />,
        children: [
          { path: "/admin-dashboard", element: <AdminDashboard /> },
          { path: "/add-card", element: <AddCard /> },
          { path: "/cards", element: <Cards /> },
          { path: "/clients", element: <Clients /> },
          { path: "/file-template", element: <FileTemplate /> },
        ],
      },
      {
        path: "/file-template",
        element: <FileTemplate />,
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <Toaster
        position="top-center"
        containerStyle={{
          zIndex: "100",
          fontSize: "14px",
        }}
      />
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
