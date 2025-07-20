import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FiUploadCloud } from "react-icons/fi";
import toast from "react-hot-toast";
import { CustomError } from "../../types/types";
import { useCreateSoldServiceMutation } from "../../store/apiSlice/Soldslice";
import BtnSnipper from "../global/BtnSnipper";

const MenuTemplatesComponent: React.FC = () => {
  const navigate = useNavigate();
  const [menuImages, setMenuImages] = useState<File[]>([]);
  const [uniqueCode, setUniqueCode] = useState<string>("");

  const [searchParams] = useSearchParams();
  const service_type = searchParams.get("service-type");

  const [createSoldService, { isLoading, isError, isSuccess, error, data }] =
    useCreateSoldServiceMutation();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setMenuImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setMenuImages(menuImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!service_type) {
      toast.error("There is no type provided");
      return;
    }

    const formData = new FormData();
    formData.append("type", service_type);
    formData.append("uniqueCode", uniqueCode);
    formData.append("vCardUi", "");
    menuImages.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await createSoldService(formData).unwrap();
      console.log("Success:", response);
    } catch (error) {
      console.error("Error From Client Create Product", error);
    }
  };

  const customError = error as CustomError;

  useEffect(() => {
    if (isError && customError?.data?.message) {
      toast.error(customError.data.message);
    } else if (isSuccess) {
      toast.success("Menu has created successfully");
      navigate(`/client-dashboard`);
    }
  }, [isError, isSuccess, error, data]);

  return (
    <div className="flex flex-col items-center">
      {/* Upload Button */}
      <div className="mb-6 w-full">
        <div className="border-2 border-dashed rounded-lg p-4 text-center w-full cursor-pointer border-purple-400 bg-purple-900/20">
          <label
            htmlFor="image"
            className="text-gray-300 cursor-pointer flex flex-col-reverse"
          >
            <p className="mt-2 text-sm text-gray-500">
              Max image size: 3MB for each image
            </p>
            <span>Click here to Upload images</span>
            <FiUploadCloud size={30} className="mx-auto text-purple-500" />
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Image Preview */}
      {menuImages.length > 0 && (
        <div className="flex gap-2 flex-wrap w-full">
          {menuImages.map((image, index) => (
            <div
              className="mt-4 w-[calc(50%-8px)] aspect-[1/1] md:aspect-[1/1] relative"
              key={index}
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                className="w-full h-full rounded object-cover"
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute right-1 bottom-1 p-0 rounded-full w-fit cursor-pointer"
              >
                <AiFillDelete size={15} color="red" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Unique code Field */}
      <div className="mt-6 w-full">
        <label className="block text-sm text-gray-400 mb-2">
          Paste Your Unique Code
        </label>
        <input
          type="text"
          value={uniqueCode}
          onChange={(e) => setUniqueCode(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Submit Button */}
      {menuImages.length > 0 && (
        <button
          onClick={(e) => handleSubmit(e)}
          className="mt-6 cursor-pointer px-6 py-3 bg-green-800 rounded-lg shadow-lg hover:bg-green-900 transition-all duration-300"
        >
          {isLoading ? <BtnSnipper /> : "Confirm Selection"}
        </button>
      )}
    </div>
  );
};

export default MenuTemplatesComponent;

// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { AiFillDelete } from "react-icons/ai";
// import { FiUploadCloud } from "react-icons/fi";
// import toast from "react-hot-toast";
// import { CustomError } from "../../types/types";
// import { useCreateSoldServiceMutation } from "../../store/apiSlice/Soldslice";
// import BtnSnipper from "../global/BtnSnipper";

// const MenuTemplatesComponent: React.FC = () => {
//   const navigate = useNavigate();
//   const [menuImages, setMenuImages] = useState<string[]>([]);

//   const convertToBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const handleImageUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (event.target.files) {
//       const filesArray = Array.from(event.target.files);
//       const base64Images = await Promise.all(
//         filesArray.map((file) => convertToBase64(file))
//       );

//       setMenuImages((prevImages) => [...prevImages, ...base64Images]);
//     }
//   };

//   const handleDeleteImage = (index: number) => {
//     setMenuImages(menuImages.filter((_, i) => i !== index));
//   };

//   // Handle create menu service
//   const [uniqueCode, setUniqueCode] = useState<string>("");

//   const [searchParams] = useSearchParams();

//   //=> Get sevice type query
//   const service_type = searchParams.get("service-type");

//   const [createSoldService, { isLoading, isError, isSuccess, error, data }] =
//     useCreateSoldServiceMutation();
//   console.log(data);
//   console.log(error);
//   console.log(isError);

//   const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.preventDefault();
//     if (!service_type) {
//       toast.error("There is no type provided");
//     } else {
//       try {
//         const response = await createSoldService({
//           type: service_type,
//           content: menuImages,
//           vCardUi: "",
//           uniqueCode,
//         }).unwrap();

//         console.log("Sending Data:", response.message);
//       } catch (error) {
//         console.log(`Error From Client Create Product ${error}`);
//       }
//     }
//   };

//   const customError = error as CustomError;

//   useEffect(() => {
//     if (isError && customError?.data?.message) {
//       toast.error(customError.data.message);
//     } else if (isSuccess) {
//       navigate(`/client-dashboard`);
//     }
//   }, [isError, isSuccess, error, data]);
//   return (
//     <div className="flex flex-col items-center ">
//       {/* Upload Button */}
//       <div className="mb-6 w-full">
//         <div className="border-2 border-dashed rounded-lg p-4 text-center w-[100%] cursor-pointer border-purple-400 bg-purple-900/20">
//           <label
//             htmlFor="image"
//             className="text-gray-300 cursor-pointer flex flex-col-reverse"
//           >
//             <span>Click here to Upload images</span>
//             <FiUploadCloud size={30} className="mx-auto text-purple-500" />
//           </label>
//           <input
//             type="file"
//             id="image"
//             accept="image/*"
//             multiple
//             className="hidden"
//             onChange={handleImageUpload}
//           />
//         </div>
//       </div>
//       {menuImages.length > 0 && (
//         <div className="flex gap-2 flex-wrap w-full">
//           {menuImages.map((image, index) => (
//             <div
//               className="mt-4 w-[calc(50%-8px)] aspect-[1/1] md:aspect-[1/1] relative"
//               key={index}
//             >
//               <img
//                 src={image}
//                 alt=""
//                 className="w-full h-full rounded object-cover"
//               />
//               <button
//                 onClick={() => handleDeleteImage(index)}
//                 className="absolute right-1 bottom-1 p-0 rounded-full w-fit cursor-pointer"
//               >
//                 <AiFillDelete size={15} color="red" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//       {/* Unique code Field */}
//       <div className="mt-6">
//         <label className="block text-sm text-gray-400 mb-2">
//           Past Your Unique Code
//         </label>
//         <input
//           type="text"
//           value={uniqueCode}
//           onChange={(e) => setUniqueCode(e.target.value)}
//           className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
//         />
//       </div>
//       {/* Confirm Button */}
//       {menuImages.length > 0 && (
//         <button
//           onClick={(e) => handleSubmit(e)}
//           className="mt-6 cursor-pointer px-6 py-3 bg-green-700 rounded-lg shadow-lg hover:bg-green-900 transition-all duration-300"
//         >
//           {isLoading ? <BtnSnipper /> : "Confirm Selection"}
//         </button>
//       )}
//     </div>
//   );
// };

// export default MenuTemplatesComponent;
