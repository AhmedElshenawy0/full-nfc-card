import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FiUploadCloud } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  useGetOneSoldServicesQuery,
  useUpdateMenuServiceMutation,
} from "../../store/apiSlice/Soldslice";
import BtnSnipper from "../../components/global/BtnSnipper";
import { CustomError } from "../../types/types";

const EditMenu: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const soldServieId = searchParams.get("id");

  const { data: response } = useGetOneSoldServicesQuery(soldServieId);

  const menuService = response?.soldServices?.menuUpdatableContent;
  useEffect(() => {
    if (menuService) setImages(menuService);
  }, [menuService]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setNewImages((prevImages) => [...prevImages, ...filesArray]);
    }
  };

  const handleDeleteImage = (index: number, imageUrl: string) => {
    if (images.includes(imageUrl)) {
      setDeletedImages([...deletedImages, imageUrl]);
      setImages(images.filter((img) => img !== imageUrl));
    } else {
      setNewImages(newImages.filter((_, i) => i !== index - images.length));
    }
  };

  const [updateMenuService, { isLoading, isError, error, isSuccess }] =
    useUpdateMenuServiceMutation();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!soldServieId) return toast.error("Missing ID");

    if (newImages.length === 0 && deletedImages.length === 0) {
      toast("No changes to save");
      return;
    }
    try {
      const formData = new FormData();

      formData.append("type", "menu");

      deletedImages.forEach((img) => formData.append("deletedImages[]", img));

      newImages.forEach((file) => formData.append("files", file));

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      await updateMenuService({
        id: soldServieId,
        data: formData,
      }).unwrap();
    } catch (error) {
      toast.error("Error updating menu");
      console.log(error);
    }
  };

  //=> Error handling
  const customError = error as CustomError;

  useEffect(() => {
    if (isError) {
      const msg = customError?.data?.message as string;
      toast.error(msg);
    } else if (isSuccess) {
      toast.success("Menu updated successfully");
      navigate("/client-dashboard");
    }
  }, [isError, isSuccess, error]);
  return (
    <div className="flex flex-col items-center ">
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

      {[...images, ...newImages.map((file) => URL.createObjectURL(file))].map(
        (image, index) => (
          <div
            className="mt-4 w-[calc(50%-8px)] aspect-[1/1] md:aspect-[1/1] relative"
            key={index}
          >
            <img
              src={image}
              alt="Preview"
              className="w-full h-full rounded object-cover"
            />
            <button
              onClick={() => handleDeleteImage(index, image)}
              disabled={isLoading}
              className="absolute right-1 bottom-1 p-1 bg-red-700 rounded-full"
            >
              <AiFillDelete size={15} color="white" />
            </button>
          </div>
        )
      )}

      {(newImages.length > 0 || deletedImages.length > 0) && (
        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-3 bg-green-800 rounded-lg shadow-lg hover:bg-green-900 transition-all duration-300"
        >
          {isLoading ? <BtnSnipper /> : "Save"}
        </button>
      )}
    </div>
  );
};

export default EditMenu;
