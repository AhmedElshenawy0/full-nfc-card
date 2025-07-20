import { useEffect, useState } from "react";
import { useSignUpMutation } from "../../store/apiSlice/AuthSlice";
import { signUpValidation } from "../../utils/validation";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CustomError } from "../../types/types";
import BtnSnipper from "../../components/global/BtnSnipper";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    job: "",
    birthday: "",
    phone: "",
    city: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [signUp, { isLoading, error }] = useSignUpMutation();
  console.log(error);

  const navigate = useNavigate();

  const queryType = searchParams.get("type");
  const queryId = searchParams.get("cardId");

  const handleSignUpClick = async () => {
    //=> Validation
    const validation = signUpValidation.safeParse(formData);

    if (!validation.success) {
      toast.error(validation.error.errors[0].message, {
        duration: 5000,
      });
      return;
    }
    try {
      if (!queryType || !queryId) {
        toast.error("There is no credential");
        return;
      }
      const result = await signUp({
        ...formData,
        cardType: queryType,
        cardId: queryId,
      }).unwrap();
      console.log("User signed up successfully:", result);
      toast.success("Registration successful! Welcome aboard!", {
        duration: 5000,
      });
      navigate(
        `/signin?type=${queryType}&cardId=${queryId}&clietId=${result?.user?.id}`
      );
    } catch (err: any) {
      console.error("Error signing up:", err);
    }
  };

  const customError = error as CustomError;

  useEffect(() => {
    if (
      customError?.data?.message === "User is already exist. Please sign in"
    ) {
      toast.success(`${customError?.data?.message}`);
      navigate(`/signin?type=${queryType}&cardId=${queryId}`);
    }
  }, [error]);

  useEffect(() => {
    if (!queryType || !queryId) {
      toast.error("There is no creditials.");
      navigate("/");
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Input Section */}
      <div className="w-full max-w-md space-y-6">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm text-gray-400 mb-2"
          >
            First Name
          </label>
          <input
            name="firstName"
            id="firstName"
            type="text"
            onChange={(e) => handleChange(e)}
            placeholder="Enter your first name"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm text-gray-400 mb-2"
          >
            Last Name
          </label>
          <input
            name="lastName"
            id="lastName"
            type="text"
            onChange={(e) => handleChange(e)}
            placeholder="Enter your last name"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            onChange={(e) => handleChange(e)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Password */}
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
            onChange={(e) => handleChange(e)}
            placeholder="Create a password"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm text-gray-400 mb-2">
            Phone
          </label>
          <input
            name="phone"
            id="phone"
            type="tel"
            onChange={(e) => handleChange(e)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm text-gray-400 mb-2">
            City
          </label>
          <input
            name="city"
            id="city"
            type="text"
            onChange={(e) => handleChange(e)}
            placeholder="Enter your city"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Job */}
        <div>
          <label htmlFor="job" className="block text-sm text-gray-400 mb-2">
            Job
          </label>
          <input
            name="job"
            id="job"
            type="text"
            onChange={(e) => handleChange(e)}
            placeholder="Enter your job"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>

        {/* Birthday */}
        <div>
          <label
            htmlFor="birthday"
            className="block text-sm text-gray-400 mb-2"
          >
            Birthday
          </label>
          <input
            name="birthday"
            id="birthday"
            type="date"
            onChange={(e) => handleChange(e)}
            placeholder="Enter your birthday"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center w-full max-w-md mt-8">
        <button
          onClick={handleSignUpClick}
          disabled={isLoading}
          className="inline-block cursor-pointer px-8 py-3 bg-green-800 text-gray-100 w-full text-sm font-semibold rounded-lg shadow-lg hover:bg-green-900 transition"
        >
          {isLoading ? <BtnSnipper /> : "Sign Up Now"}
        </button>
        <p className="mt-4 text-sm text-gray-400">
          Have an account?{" "}
          <Link
            to={`/signin?type=${queryType}&cardId=${queryId}`}
            className="text-green-700 font-bold hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signup;
