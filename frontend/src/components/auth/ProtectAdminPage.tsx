import { Outlet, useNavigate } from "react-router-dom";
import { useGetClientInfoQuery } from "../../store/apiSlice/AuthSlice";
import toast from "react-hot-toast";
import { ReactNode, useEffect, useState } from "react";
import Snipper from "../global/Snipper";

interface ProtectAdminPageProps {
  children?: ReactNode;
}
interface ApiError {
  data?: {
    message?: string;
  };
}

const ProtectAdminPage: React.FC<ProtectAdminPageProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data, isLoading, error, isError } = useGetClientInfoQuery(undefined);
  console.log(error);

  // Check if a toast has been shown to prevent duplicate toasts
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (toastShown || isLoading) return;

    if (data?.user?.email) {
      if (data?.user?.role !== "admin") {
        console.log("admin only");

        toast.error("Access Forbidden: Admins only");
        console.log("access forbidden");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      }
      setToastShown(true);
      return;
    }
    if ((error as ApiError | any)?.data?.message === "Unauthorized") {
      toast.error("You must sign in first.");
      navigate("/signin");
      setToastShown(true);
      return;
    }
  }, [data, error, navigate, isLoading, toastShown, isError]);

  if (isLoading) return <Snipper />;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectAdminPage;
