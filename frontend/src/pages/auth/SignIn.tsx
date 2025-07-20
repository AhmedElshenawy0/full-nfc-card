import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetClientInfoQuery,
  useSignInMutation,
  useCheckUserRoleMutation,
} from "../../store/apiSlice/AuthSlice";
import { signInValidation } from "../../utils/validation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import GoogleLoginButton from "../../components/auth/GoogleBtn";
import BtnSnipper from "../../components/global/BtnSnipper";

export const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryError = searchParams.get("error");
  const queryType = searchParams.get("type");
  const cardId = searchParams.get("cardId") as string;
  const isAuth = searchParams.get("auth") === "true";
  const gCardId = searchParams.get("gCardId") as string;
  const gType = searchParams.get("gCardType") as any;
  console.log(queryType);
  console.log(cardId);

  const {
    data,
    isSuccess,
    refetch: refetchUserInfo,
  } = useGetClientInfoQuery(undefined);

  useEffect(() => {
    // Handle query error if exist
    if (queryError) {
      const decodedError = decodeURIComponent(queryError);
      toast.error(decodedError, { duration: 5000 });
      searchParams.delete("error");
      setSearchParams(searchParams, { replace: true });
    }
    if (!isSuccess || !data?.user) return;

    // Handle query error if exist
    if (data?.user?.role === "admin") {
      navigate("/admin-dashboard");
    } else if (isAuth) {
      const userSolds = data.user.soldServices ?? [];
      const userCard = userSolds.find((ele: any) => ele?.card_id === gCardId);
      console.log("here...", userCard);

      if (!userCard?.id) {
        if (gType === "vCard") {
          navigate(`/select-template?service-type=${gType}`);
        } else if (gType === "menu") {
          navigate(`/select-template?service-type=${gType}`);
        } else if (gType === "file") {
          navigate(`/file-template?service-type=${gType}`);
        }
      } else {
        navigate(`/client-dashboard`);
      }
    }
  }, [queryError, gCardId, gType, isAuth, data?.user, isSuccess]);

  // Handle Sign In
  const [signIn, { isLoading }] = useSignInMutation();

  const [checkUserRole] = useCheckUserRoleMutation();

  const handleSignInClick = async () => {
    // => Validation
    const validation = signInValidation.safeParse({ email, password });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message, {
        duration: 5000,
      });
      return;
    }

    try {
      const res = await checkUserRole(email).unwrap();
      console.log(res);

      if (res?.client?.role !== "admin") {
        if (!queryType || !cardId) {
          toast.error("There are no credentials for your card.", {
            duration: 5000,
          });
          return;
        }
        console.log("error 111");
      }
      console.log("error 222");

      const result = await signIn({
        email,
        password,
        cardType: queryType,
        cardId,
      }).unwrap();
      console.log(result);

      toast.success(`${result.message}`, {
        duration: 5000,
      });

      await refetchUserInfo();
      const userSolds = result?.user?.soldServices;
      const userCard = userSolds?.find((ele: any) => ele?.card_id === cardId);

      console.log(userSolds);
      console.log(userCard);
      console.log(cardId);

      if (result?.user?.email) {
        if (!userCard?.id) {
          if (queryType === "vCard") {
            navigate(`/select-template?service-type=${queryType}`);
          } else if (queryType === "menu") {
            navigate(`/select-template?service-type=${queryType}`);
          } else if (queryType === "file") {
            navigate(`/file-template?service-type=${queryType}}`);
          }
        } else {
          navigate(`/client-dashboard`);
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "An error occurred", {
        duration: 5000,
      });
    }
  };
  return (
    <div className=" flex flex-col items-center justify-center ">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-md space-y-6"
      >
        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 shadow-lg"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm text-gray-400 mb-2"
          >
            Password
          </label>
          <input
            name="password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 shadow-lg"
          />
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center w-full max-w-md mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignInClick}
          className="flex justify-center items-center cursor-pointer px-8 py-2 rounded-full bg-green-900 text-gray-100 w-full font-semibold shadow-lg hover:bg-green-950 transition-all duration-300"
        >
          {isLoading ? <BtnSnipper /> : "Sign in"}
        </motion.button>
        <p className="mt-4 text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-green-700 font-bold hover:underline"
          >
            Sign up here
          </Link>
        </p>
      </motion.div>

      {/* Google Login Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-6 w-full max-w-md flex justify-center"
      >
        <GoogleLoginButton type={queryType} cardId={cardId} />
      </motion.div>
    </div>
  );
};
