import { Outlet, useNavigate } from "react-router-dom";
import { useGetClientInfoQuery } from "../../store/apiSlice/AuthSlice";
import toast from "react-hot-toast";
import { ReactNode, useEffect, useState } from "react";
import Snipper from "../global/Snipper";

interface ProtectAuthRouteProps {
  children?: ReactNode;
}
interface ApiError {
  data?: {
    message?: string;
  };
}

const ProtectAuthRoute: React.FC<ProtectAuthRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetClientInfoQuery(undefined);
  console.log(error);
  console.log(data);

  // Check if a toast has been shown to prevent duplicate toasts
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (toastShown || isLoading) return;

    const isUnauthorized =
      (error as ApiError)?.data?.message === "Unauthorized";

    if (toastShown) return;

    if (isUnauthorized) {
      toast("You must sign up first.");
      navigate("/");
    }

    setToastShown(true);
  }, [data, error, navigate, isLoading, toastShown]);

  if (isLoading) return <Snipper />;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectAuthRoute;
