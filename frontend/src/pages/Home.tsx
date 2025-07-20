import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useVerifyCardQuery } from "../store/apiSlice/CardSlice";
import toast from "react-hot-toast";
import { CustomError } from "../types/types";
import Snipper from "../components/global/Snipper";
import copy from "copy-to-clipboard";

const RootLayout = () => {
  //=> Get unique_code query
  const [searchParams] = useSearchParams();

  const unique_code = searchParams.get("unique_code");

  //=> Verify card
  const {
    isError,
    error,
    isLoading,
    data: verifyCard,
  } = useVerifyCardQuery(unique_code, {
    skip: !unique_code, //=> Only fetch when unique_code is exist
  });

  //=> Handle Verify click btn
  const handleVerifyClick = () => {
    if (!unique_code) {
      toast.error("There is no card identifire provided");
    } else if (verifyCard?.message === "Go to signup") {
      navigate(`/signup?type=${verifyCard?.type}&cardId=${verifyCard?.cardId}`);
    }
  };

  //=> Handdle actions after verifying
  const navigate = useNavigate();
  const [showConfirmBtn, setShowConfirmBtn] = useState<boolean>(false);

  useEffect(() => {
    if (verifyCard?.message === "Go to signup") {
      setShowConfirmBtn(true);
      console.log(verifyCard);
    } else if (verifyCard?.message === "success") {
      toast.success(`Welcom,${verifyCard?.name}`);
      navigate("/client-dashboard");
    }
  }, [verifyCard, navigate]);
  console.log(error);

  //=> Handle error if exist
  useEffect(() => {
    const customError = error as CustomError;

    if (isError && customError?.data?.message) {
      toast.error(customError.data.message);
      if (customError?.status === 401) {
        navigate(
          `/signin?type=${customError?.data?.type}&cardId=${customError?.data?.cardId}`
        );
      }
    }
  }, [isError, error]);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!unique_code) return toast.error("Invalid card");

    const success = copy(unique_code);

    if (success) {
      setCopied(true);
      toast.success("Link copied to clipboard 🔗");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy");
    }
  };
  return (
    <div className="flex flex-col items-center ">
      {/* Input Section */}
      {unique_code ? (
        <div className="w-full max-w-md mx-auto mt-6 mb-6">
          <div className="flex items-center bg-[#ffffff] border border-[#5d2873] rounded-full shadow-md overflow-hidden">
            <input
              type="text"
              value={(unique_code as string) || ""}
              readOnly
              onClick={handleCopy}
              className="flex-grow px-5 py-2 text-sm text-black bg-transparent outline-none rounded-l-full placeholder:text-gray-300"
            />
            <button
              onClick={handleCopy}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-900 text-white text-sm font-semibold rounded-r-full transition duration-300 hover:brightness-110 shadow-md"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      ) : (
        ""
      )}

      {/* Video Section */}
      <div className="w-full max-w-lg mb-8 rounded-lg overflow-hidden shadow-xl">
        <iframe
          src="https://www.youtube.com/embed/Bovaj3UYDGA"
          className="w-full"
          height={180}
          title="YouTube Video"
          allowFullScreen
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        {showConfirmBtn ? (
          <button
            onClick={handleVerifyClick}
            className="cursor-pointer flex justify-center gap-2 py-2 bg-green-900 text-gray-100 w-full font-semibold rounded-full shadow-lg hover:bg-green-900 transition duration-500"
          >
            <span>Let's Get Started</span>
            {isLoading ? <Snipper /> : ""}
          </button>
        ) : (
          ""
        )}
        <p className="mt-4 text-sm text-gray-400">
          Activate your world with our innovative card solution!
        </p>
      </div>
    </div>
  );
};

export default RootLayout;

// sudo rm -rf /root/nfc/back-end/*
// sudo cp -r ./* /root/nfc/back-end
// sudo docker rm -f $(sudo docker ps -aq)
// sudo docker rmi -f nfc-app:latest
// sudo docker build -t nfc-app /root/nfc/
// sudo docker run -d -p 443:443 -p 5555:5555 --network=host nfc-app:latest
