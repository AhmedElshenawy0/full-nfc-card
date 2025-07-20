import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateCardMutation } from "../../store/apiSlice/CardSlice";
import { FaArrowLeft } from "react-icons/fa";
import BtnSnipper from "../../components/global/BtnSnipper";
import { CustomError } from "../../types/types";

const AddCard = () => {
  const navigate = useNavigate();
  const [nfc_type, setNfc_type] = useState("");
  const [nfc_shap, setNfc_shap] = useState("");

  //=> Create Card
  const [createCard, { isLoading, isSuccess, isError, error }] =
    useCreateCardMutation();

  const handleCreateCard = async () => {
    if (!nfc_type || !nfc_shap) {
      toast.error("Please select both card type and shape.");
      return;
    }

    try {
      await createCard({ nfc_shap, nfc_type });
    } catch (error) {
      console.log(error);
    }
  };

  //=> Error Handling
  const customError = error as CustomError;

  useEffect(() => {
    if (isError && !isSuccess && customError?.data?.message) {
      toast.dismiss();
      toast.error(customError.data.message);
    }
    if (isSuccess) {
      toast.success("Card added successfully!");
      setNfc_shap("");
      setNfc_type("");
    }
  }, [isError, error, isSuccess, navigate]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="p-2 bg-green-950 rounded-full absolute top-8 right-6 flex items-center cursor-pointer space-x-2 text-gray-400 hover:text-white transition"
      >
        <FaArrowLeft color="white" />
      </button>
      <h1 className="text-xl mt-3 font-bold mb-6">Add New Card</h1>

      {/* Card Type Selection */}
      <div className="w-full max-w-md mb-6">
        <label className="block text-gray-300 mb-2">Select Card Type</label>
        <select
          value={nfc_type}
          onChange={(e) => setNfc_type(e.target.value)}
          className="w-full p-3 bg-gray-800 text-gray-200 rounded-lg border border-gray-600 focus:ring-2 focus:ring-green-500"
        >
          <option value="" disabled>
            Select Type
          </option>
          <option value="vCard">V-Card</option>
          <option value="menu">Menu</option>
          {/* <option value="url">URL</option>
          <option value="file">File</option> */}
        </select>
      </div>

      {/* Card Shape Selection */}
      <div className="w-full max-w-md mb-6">
        <label className="block text-gray-300 mb-2">Select Card Shape</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="shape"
              value="medal"
              checked={nfc_shap === "medal"}
              onChange={(e) => setNfc_shap(e.target.value)}
              className="accent-green-500"
            />
            <span>Medal</span>
          </label>

          <label className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg cursor-pointer">
            <input
              type="radio"
              name="shape"
              value="card"
              checked={nfc_shap === "card"}
              onChange={(e) => setNfc_shap(e.target.value)}
              className="accent-green-500"
            />
            <span>Card</span>
          </label>
        </div>
      </div>

      {/* Add Card Button */}
      <button
        onClick={handleCreateCard}
        className="px-6 py-3 cursor-pointer bg-green-800 text-gray-100 font-semibold rounded-lg shadow-lg hover:bg-green-900 transition"
        disabled={isLoading}
      >
        {isLoading ? <BtnSnipper /> : "Add Card"}
      </button>
    </div>
  );
};

export default AddCard;
