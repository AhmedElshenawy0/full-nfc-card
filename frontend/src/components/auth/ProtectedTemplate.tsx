import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useGetClientInfoQuery } from "../../store/apiSlice/AuthSlice";
import toast from "react-hot-toast";
import { ReactNode, useEffect } from "react";
import Snipper from "../global/Snipper";

interface ProtectedTemplateProps {
  children?: ReactNode;
}

const ProtectedTemplate: React.FC<ProtectedTemplateProps> = ({ children }) => {
  const { data, isLoading, isError, error } = useGetClientInfoQuery(undefined);

  const [searchParams] = useSearchParams();
  const soldId = searchParams.get("id");

  const targeted_sold_service = data?.user?.soldServices?.find(
    (ele: any) => ele?.id === soldId
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!data?.user) {
      toast("Please sign up to continue.");
      navigate("/signup");
      return;
    }

    if (soldId && !targeted_sold_service?.type) {
      if (data.user.soldServices.length > 0) {
        toast("You are not allowed to access this card.");

        navigate("/client-dashboard");
        return;
      } else {
        toast.error("You don’t have any active cards. Please sign up.");
        navigate("/signin");
        return;
      }
    }
  }, [data, error, isLoading, navigate, soldId, targeted_sold_service]);

  if (isLoading) return <Snipper />;
  if (isError) return <p>Error loading data</p>;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedTemplate;
