import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../../store/apiSlice/AuthSlice";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const cardType = searchParams.get("cardType");
  const cardId = searchParams.get("cardId");
  const navigate = useNavigate();

  const { data, isLoading, error, isSuccess } = useVerifyEmailQuery(token, {
    skip: !token,
  });

  useEffect(() => {
    const isVerified = data?.message;
    const hasCardInfo = cardType && cardId;

    if (isVerified && hasCardInfo && !isLoading && !error) {
      navigate(`/signin?type=${cardType}&cardId=${cardId}`);
    }
  }, [data, cardType, cardId, isSuccess, isLoading, error, navigate]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Verification failed.</p>;

  return <p>{data?.message}</p>;
};

export default VerifyEmail;
