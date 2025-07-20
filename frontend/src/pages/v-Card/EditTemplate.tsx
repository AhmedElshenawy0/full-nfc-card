import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiUploadCloudLine } from "react-icons/ri";
import toast from "react-hot-toast";
import {
  useGetOneSoldServicesQuery,
  useUpdateSoldServiceMutation,
} from "../../store/apiSlice/Soldslice";
import { CustomError, V_card_data } from "../../types/types";
import BtnSnipper from "../../components/global/BtnSnipper";
import ChangeBgColor from "../../components/templates/ChangeBgColor";
import ChangeTheme from "../../components/templates/ChangeTheme";
import { FaCheck } from "react-icons/fa";

const CustomizeTemplate = () => {
  const [formData, setFormData] = useState<V_card_data>({
    name: "",
    bio: "",
    job: "",
    about: "",
    image: "",
    phone: "",
    address: "",
    facebook_link: "",
    instgram_link: "",
    linkedin_link: "",
    mainBackground: "",
    buttonBackground: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service_Id = searchParams.get("id");

  const { data: response } = useGetOneSoldServicesQuery(service_Id);
  const vCardContent = response?.soldServices?.vCardupdatableContent;
  const [theme, setTheme] = useState("");

  useEffect(() => {
    if (vCardContent) {
      setFormData({
        name: vCardContent.name || "",
        bio: vCardContent.bio || "",
        job: vCardContent.job || "",
        about: vCardContent.about || "",
        image: vCardContent.image || "",
        phone: vCardContent.phone || "",
        address: vCardContent.address || "",
        facebook_link: vCardContent.facebook_link || "",
        instgram_link: vCardContent.instgram_link || "",
        linkedin_link: vCardContent.linkedin_link || "",
        mainBackground: vCardContent.mainBackground || "",
        buttonBackground: vCardContent.buttonBackground || "",
      });
      setImagePreview(vCardContent.image);
    }
  }, [vCardContent]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const [updateSoldService, { isError, error, isLoading }] =
    useUpdateSoldServiceMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formDataData = new FormData();
      formDataData.append("type", "vCard");
      theme ? formDataData.append("vCardUi", theme) : "";

      Object.entries(formData).forEach(([key, value]) => {
        formDataData.append(key, value ?? "");
      });

      if (imageFile) {
        formDataData.append("profileImage", imageFile);
      }

      await updateSoldService({
        id: service_Id,
        data: formDataData,
        theme,
      }).unwrap();
      toast.success("Sold service updated successfully");
      navigate("/client-dashboard");
    } catch (err) {
      toast.error("Something went wrong while updating");
      console.log(err);
    }
  };

  const [tempMainBackground, setTempMainBackground] = useState(
    formData.mainBackground
  );
  const [tempButtonBackground, setTempButtonBackground] = useState(
    formData.buttonBackground
  );
  const [textColor, setTextColor] = useState("text-black");
  const [btnColor, setBtnColor] = useState("text-black");

  useEffect(() => {
    if (isColorOpen) {
      setTempMainBackground(formData.mainBackground);
      setTempButtonBackground(formData.buttonBackground);
    }
  }, [isColorOpen]);

  useEffect(() => {
    const isDark = (hex: string) => {
      if (!hex) return false;
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 130;
    };

    setTextColor(isDark(tempMainBackground) ? "text-white" : "text-black");
    setBtnColor(isDark(tempButtonBackground) ? "text-white" : "text-black");
  }, [tempMainBackground, tempButtonBackground]);

  const customError = error as CustomError;
  useEffect(() => {
    if (isError && customError?.data?.message) {
      toast.error(customError.data.message);
    }
  }, [isError, error]);
  console.log("theme is ", theme);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center text-gray-200 px-0 py-0">
      <h1 className="text-2xl font-bold text-white mb-6">Edit Your Template</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 rounded-lg shadow-lg space-y-6"
      >
        {/* Profile Image */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-32 h-32">
            <img
              src={imagePreview ?? formData.image ?? ""}
              alt="Profile"
              className="w-full h-full object-top rounded-full object-cover border-4 border-gray-700 shadow-lg"
            />
            <label
              htmlFor="image"
              className="absolute bottom-1 right-1 bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition-all cursor-pointer"
            >
              <RiUploadCloudLine size={20} className="text-white" />
            </label>
          </div>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="mt-2 text-sm text-gray-500">Max image size: 3MB</p>
        </div>

        {/* Text Fields */}
        {[
          ["name", "Name"],
          ["job", "Job"],
          ["bio", "Bio"],
          ["about", "About"],
          ["phone", "Phone"],
          ["address", "Address"],
          ["facebook_link", "Facebook Link"],
          ["instgram_link", "Instagram Link"],
          ["linkedin_link", "LinkedIn Link"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm text-gray-400 mb-2">{label}</label>
            <input
              type="text"
              value={(formData[key as keyof V_card_data] || "") as string}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        ))}

        {/* 🎨 Change color */}
        <div className="relative p-[2px] rounded-xl bg-[length:200%_200%] bg-gradient-to-r from-green-600 via-[#a531d6] to-blue-500 animate-[borderMove_4s_linear_infinite]">
          <div className="rounded-xl bg-gray-900 p-2 text-white">
            <button
              type="button"
              onClick={() => setIsColorOpen(true)}
              className="text-lg mx-auto w-full font-semibold text-center cursor-pointer"
            >
              🎨 Change color
            </button>
          </div>
        </div>

        {isColorOpen && (
          <ChangeBgColor
            tempMainBackground={tempMainBackground}
            tempButtonBackground={tempButtonBackground}
            setTempMainBackground={setTempMainBackground}
            setTempButtonBackground={setTempButtonBackground}
            setIsColorOpen={setIsColorOpen}
            setFormData={setFormData}
            formData={formData}
            ui={response?.soldServices?.vCardUi}
          />
        )}

        {/*  Change Theme */}
        <div className="relative p-[2px] rounded-xl bg-[length:200%_200%] bg-gradient-to-r from-white via-[#a531d6] to-white ">
          <div className="rounded-xl bg-gray-900 p-2 text-white">
            <button
              type="button"
              onClick={() => setIsThemeOpen(true)}
              className="text-lg mx-auto w-full font-semibold text-center cursor-pointer"
            >
              Change Theme
            </button>
          </div>
          <div className="text-center font-bold text-black flex justify-center gap-2 items-center">
            {theme ? theme : response?.soldServices?.vCardUi}
            <FaCheck className="text-green-600 w-4 h-4 font-bold " />
          </div>
        </div>

        {isThemeOpen && (
          <ChangeTheme
            setIsThemeOpen={setIsThemeOpen}
            setTheme={setTheme}
            theme={theme}
          />
        )}
        {/* Preview Colors */}
        <div className="flex items-center gap-2 w-full">
          <div
            style={{ backgroundColor: formData.mainBackground }}
            className={`${textColor} p-6 rounded-lg shadow-md font-semibold`}
          >
            This is how your main background will look!
          </div>
          <div
            style={{ backgroundColor: formData.buttonBackground }}
            className={`${btnColor} p-6 rounded-lg shadow-md font-semibold`}
          >
            This is how your button background will look!
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full px-4 py-2 cursor-pointer font-semibold bg-green-800 text-gray-100 rounded-lg shadow-md hover:bg-green-900 transition"
        >
          {isLoading ? <BtnSnipper /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default CustomizeTemplate;
