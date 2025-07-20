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

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-black to-[#3a0d4e] text-gray-200 px-4 py-6">
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

// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { RiUploadCloudLine } from "react-icons/ri";
// import { useCreateSoldServiceMutation } from "../../store/apiSlice/Soldslice";
// import toast from "react-hot-toast";
// import { CustomError, V_card_data } from "../../types/types";
// import BtnSnipper from "../../components/global/BtnSnipper";

// const CustomizeTemplate = () => {
//   const [formData, setFormData] = useState<V_card_data>({
//     name: "",
//     bio: "",
//     job: "",
//     about: "",
//     image: "",
//     phone: "",
//     address: "",
//     facebook_link: "",
//     instgram_link: "",
//     linkedin_link: "",
//     mainBackground: "",
//     buttonBackground: "",
//   });
//   const [imagePreview, setImagePreview] = useState<any>();
//   const [uniqueCode, setUniqueCode] = useState<string>("");
//   const [searchParams] = useSearchParams();

//   //=> Get sevice type query
//   const service_type = searchParams.get("service-type");
//   //=> Get v-card type type query
//   const v_card_ui = searchParams.get("v-card-ui");

//   //=> Handle image upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       setImagePreview(URL.createObjectURL(file));

//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, image: reader.result as string }));
//       };
//     }
//   };

//   //=> Handle create sold service
//   const navigate = useNavigate();

//   const [createSoldService, { isError, isSuccess, error, data, isLoading }] =
//     useCreateSoldServiceMutation();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log({
//       type: service_type,
//       content: formData,
//       vCardUi: v_card_ui,
//       uniqueCode,
//     });

//     try {
//       const response = await createSoldService({
//         type: service_type,
//         content: formData,
//         vCardUi: v_card_ui,
//         uniqueCode,
//       }).unwrap();

//       console.log("Sending Data:", response.message);
//     } catch (error) {
//       console.log(`Error From Client Create Product ${error}`);
//     }
//   };

//   // Check if there an error or success
//   const customError = error as CustomError;

//   useEffect(() => {
//     if (isError && customError?.data?.message) {
//       toast.error(customError.data.message);
//       console.log(customError.data.message);
//     } else if (isSuccess) {
//       navigate(`/client-dashboard`);
//     }
//   }, [isError, isSuccess, error, data]);

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-black to-[#3a0d4e] text-gray-200 px-4 py-6">
//       {/* Header */}
//       <h1 className="text-2xl font-bold text-white mb-6">
//         Customize Your Template
//       </h1>

//       {/* Form Container */}
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md p-6 rounded-lg shadow-lg space-y-6"
//       >
//         {/* Image URL Field */}
//         <div className="relative flex flex-col items-center">
//           {/* Profile Image */}
//           <div className="relative w-32 h-32">
//             <img
//               src={imagePreview || formData?.image}
//               alt="Profile Picture"
//               className="w-full h-full object-top rounded-full object-cover border-4 border-gray-700 shadow-lg"
//             />

//             {/* Upload Button */}
//             <label
//               htmlFor="image"
//               className="absolute bottom-1 right-1 bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-700 transition-all cursor-pointer"
//             >
//               <RiUploadCloudLine size={20} className="text-white" />
//             </label>
//           </div>

//           {/* Hidden File Input */}
//           <input
//             id="image"
//             type="file"
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="hidden"
//           />
//         </div>

//         {/* Name Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Name</label>
//           <input
//             type="text"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Job Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Job</label>
//           <input
//             type="text"
//             value={formData.job}
//             onChange={(e) => setFormData({ ...formData, job: e.target.value })}
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Bio Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Bio</label>
//           <input
//             type="text"
//             value={formData.bio}
//             onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* About Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">About</label>
//           <input
//             type="text"
//             value={formData.about}
//             onChange={(e) =>
//               setFormData({ ...formData, about: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />

//           {/* Character Counter */}
//           <div className="text-sm mt-1 text-gray-400">
//             Characters: {formData.about.length}/100
//           </div>

//           {/* Recommendation Message */}
//           {formData.about.length < 100 && (
//             <p className="text-yellow-400 text-xs mt-1">
//               It's recommended to write at least 100 characters for a better
//               description.
//             </p>
//           )}
//         </div>

//         {/* Phone Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Phone</label>
//           <input
//             type="text"
//             value={formData.phone}
//             onChange={(e) =>
//               setFormData({ ...formData, phone: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Address Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">Address</label>
//           <input
//             type="text"
//             value={formData.address}
//             onChange={(e) =>
//               setFormData({ ...formData, address: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Facebook Link Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">
//             Facebook Link
//           </label>
//           <input
//             type="text"
//             value={formData.facebook_link}
//             onChange={(e) =>
//               setFormData({ ...formData, facebook_link: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Instgram Link Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">
//             Instgram Link
//           </label>
//           <input
//             type="text"
//             value={formData.instgram_link}
//             onChange={(e) =>
//               setFormData({ ...formData, instgram_link: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>

//         {/* Linkedin Link Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">
//             Linkedin Link
//           </label>
//           <input
//             type="text"
//             value={formData.linkedin_link}
//             onChange={(e) =>
//               setFormData({ ...formData, linkedin_link: e.target.value })
//             }
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>
//         {/* Unique code Field */}
//         <div>
//           <label className="block text-sm text-gray-400 mb-2">
//             Unique Code
//           </label>
//           <input
//             type="text"
//             value={uniqueCode}
//             onChange={(e) => setUniqueCode(e.target.value)}
//             className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//           />
//         </div>
//         {/* Save Button */}
//         <button
//           type="submit"
//           className="w-full px-4 py-2 cursor-pointer bg-green-800 text-gray-100 rounded-lg shadow-md hover:bg-green-900 transition"
//         >
//           {isLoading ? <BtnSnipper /> : "Save Changes"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CustomizeTemplate;
