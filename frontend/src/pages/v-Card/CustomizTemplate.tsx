import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RiUploadCloudLine } from "react-icons/ri";
import { useCreateSoldServiceMutation } from "../../store/apiSlice/Soldslice";
import toast from "react-hot-toast";
import { CustomError } from "../../types/types";
import BtnSnipper from "../../components/global/BtnSnipper";
import image1 from "../../../public/images/profile.png";

const CustomizeTemplate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const service_type = searchParams.get("service-type");
  const v_card_ui = searchParams.get("v-card-ui");
  console.log(v_card_ui);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null); // ← added
  const [bgPreview, setBgPreview] = useState<string | null>(null); // ← added
  const [uniqueCode, setUniqueCode] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    job: "",
    about: "",
    phone: "",
    address: "",
    facebook_link: "",
    instgram_link: "",
    linkedin_link: "",
    mainBackground: "",
    buttonBackground: "",
  });
  console.log(formData);

  const [createSoldService, { isError, isSuccess, error, data, isLoading }] =
    useCreateSoldServiceMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ← added
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setBackgroundImage(file);
      setBgPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!service_type || !v_card_ui) {
      toast.error("Missing service type or v-card UI");
      return;
    }

    const form = new FormData();
    form.append("type", service_type);
    form.append("vCardUi", v_card_ui);
    form.append("uniqueCode", uniqueCode);

    if (profileImage) {
      form.append("profileImage", profileImage);
    }

    // ← added: only append background image for thirdUI
    if (backgroundImage && v_card_ui === "thirdUI") {
      form.append("backgroundImage", backgroundImage);
    }

    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    console.log("form", form);

    try {
      const response = await createSoldService(form).unwrap();
      console.log("vCard created:", response);
    } catch (err) {
      console.error("vCard submit error:", err);
    }
  };

  const customError = error as CustomError;

  useEffect(() => {
    if (isError && customError?.data?.message) {
      toast.error(customError.data.message);
    } else if (isSuccess) {
      navigate(`/client-dashboard`);
    }
  }, [isError, isSuccess, error, data]);

  return (
    <div className="min-h-screen relative flex flex-col items-center bg-gradient-to-br from-black to-[#3a0d4e] text-gray-200 px-4 py-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        Customize Your Template
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 rounded-lg shadow-lg space-y-6"
      >
        {/* Profile Image Preview */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-32 h-32">
            <img
              src={imagePreview || image1}
              alt="Profile Preview"
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

        {/* Background Image Upload — only for thirdUI */}
        {v_card_ui === "thirdUI" && (
          <div className="flex flex-col items-center gap-2">
            <label className="block text-sm text-gray-400 self-start">
              Background Image
            </label>
            <div
              className="w-full h-32 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer overflow-hidden relative"
              style={{
                backgroundImage: bgPreview ? `url(${bgPreview})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <label
                htmlFor="bgImage"
                className="cursor-pointer flex flex-col items-center gap-1"
              >
                <RiUploadCloudLine size={28} className="text-gray-400" />
                <span className="text-xs text-gray-400">
                  {bgPreview ? "Change Background" : "Upload Background"}
                </span>
              </label>
            </div>
            <input
              id="bgImage"
              type="file"
              accept="image/*"
              onChange={handleBgUpload}
              className="hidden"
            />
            <p className="text-xs text-gray-500">Max image size: 3MB</p>
          </div>
        )}

        {/* All Text Fields */}
        {[
          { label: "Name", key: "name" },
          { label: "Job", key: "job" },
          { label: "Bio", key: "bio" },
          { label: "About", key: "about" },
          { label: "Phone", key: "phone" },
          { label: "Address", key: "address" },
          { label: "Facebook Link", key: "facebook_link" },
          { label: "Instagram Link", key: "instgram_link" },
          { label: "LinkedIn Link", key: "linkedin_link" },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-sm text-gray-400 mb-2">{label}</label>
            <input
              type="text"
              value={(formData as any)[key]}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            {/* Character counter and tips */}
            {(key === "bio" ||
              key === "about" ||
              key === "facebook_link" ||
              key === "instgram_link" ||
              key === "linkedin_link") && (
              <>
                {key === "bio" &&
                  ((formData as any)[key].length < 70 ||
                    (formData as any)[key].length > 120) && (
                    <div className="text-yellow-400 text-xs mt-1 font-semibold">
                      <p className="text-gray-400">
                        Characters: {(formData as any)[key].length}
                      </p>
                      Recommended: 70–120 characters for a concise and catchy
                      bio.
                    </div>
                  )}
                {key === "about" &&
                  ((formData as any)[key].length < 200 ||
                    (formData as any)[key].length > 300) && (
                    <div className="text-yellow-400 text-xs mt-1 font-semibold">
                      <p className="text-gray-400">
                        Characters: {(formData as any)[key].length}
                      </p>
                      Recommended: 200–300 characters for a strong personal
                      introduction.
                    </div>
                  )}
                {key === "facebook_link" && !(formData as any)[key] && (
                  <p className="text-yellow-400 text-xs mt-1 font-semibold">
                    Recommended: It'll be awesome to add social media links
                  </p>
                )}
                {key === "instgram_link" && !(formData as any)[key] && (
                  <p className="text-yellow-400 text-xs mt-1 font-semibold">
                    Recommended: It'll be awesome to add social media links
                  </p>
                )}
                {key === "linkedin_link" && !(formData as any)[key] && (
                  <p className="text-yellow-400 text-xs mt-1 font-semibold">
                    Recommended: It'll be awesome to add social media links
                  </p>
                )}
              </>
            )}
          </div>
        ))}

        {/* Unique Code Field */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Unique Code
          </label>
          <input
            type="text"
            value={uniqueCode}
            onChange={(e) => setUniqueCode(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 cursor-pointer bg-green-800 text-gray-100 rounded-lg shadow-md hover:bg-green-900 transition"
        >
          {isLoading ? <BtnSnipper /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default CustomizeTemplate;
