import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = ({ cardId, type }: any) => {
  const handleLogin = () => {
    if (!cardId || !type) {
      toast.error("There is no credintial");
    } else {
      window.open(
        `/api/auth/google?cardType=${type}&cardId=${cardId}`,
        "_self"
      );
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex cursor-pointer items-center gap-2 justify-center w-full py-2 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
    >
      <FcGoogle className="w-fit h-6" />
      <p>Sign in with Google</p>
    </button>
  );
};
export default GoogleLoginButton;
