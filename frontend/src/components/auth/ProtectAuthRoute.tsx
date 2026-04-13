import { Outlet, useNavigate } from "react-router-dom";
import { useGetClientInfoQuery } from "../../store/apiSlice/AuthSlice";
import { ReactNode, useEffect, useState } from "react";
import Snipper from "../global/Snipper";

interface ProtectAuthRouteProps {
  children?: ReactNode;
}

const ProtectAuthRoute: React.FC<ProtectAuthRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [toastShown, setToastShown] = useState(false);

  const { data, isLoading, error } = useGetClientInfoQuery(undefined, {});

  useEffect(() => {
    if (isLoading || toastShown) return;

    if (!data?.user && error) {
      // Silent redirect — no toast, same reason as ProtectAdminPage
      navigate("/", { replace: true });
      setToastShown(true);
    }
  }, [data, error, isLoading, toastShown, navigate]);

  if (isLoading) return <Snipper />;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectAuthRoute;
