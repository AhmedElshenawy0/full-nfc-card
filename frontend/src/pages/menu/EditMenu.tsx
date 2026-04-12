import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FiUploadCloud } from "react-icons/fi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdNfc } from "react-icons/md";
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

      await updateMenuService({
        id: soldServieId,
        data: formData,
      }).unwrap();
    } catch (error) {
      toast.error("Error updating menu");
      console.log(error);
    }
  };

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

  const allImages = [
    ...images,
    ...newImages.map((file) => URL.createObjectURL(file)),
  ];

  const hasChanges = newImages.length > 0 || deletedImages.length > 0;

  return (
    <div className="min-h-screen bg-transparent px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header
            ✅ كان: bg-violet-500/10 border-violet-500/20
            ✅ بقى: bg-purple-900/20 border-purple-500/20 — متماشي مع brand colors
        */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center">
            <MdNfc size={18} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-white text-[15px] font-medium leading-none mb-1">
              Menu Images
            </h1>
            <p className="text-gray-500 text-[12px]">
              Shown when customers tap your NFC card
            </p>
          </div>
        </div>

        {/* Upload Zone
            ✅ كان: border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10
            ✅ بقى: border-purple-500/25 bg-white/5 hover:bg-white/[0.07] — شفاف يكشف الـ layout bg
        */}
        <label
          htmlFor="image"
          className="group flex flex-col items-center justify-center gap-3 w-full rounded-2xl border border-dashed border-purple-500/25 bg-white/5 hover:bg-white/[0.07] hover:border-purple-500/40 transition-all duration-200 cursor-pointer p-8 mb-6 backdrop-blur-sm"
        >
          <div className="w-11 h-11 rounded-xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <FiUploadCloud size={20} className="text-purple-400" />
          </div>
          <div className="text-center">
            <p className="text-gray-300 text-[13px] font-medium">
              Click to upload images
            </p>
            <p className="text-gray-500 text-[11px] mt-0.5">
              Max 3 MB per image · JPG, PNG, WEBP
            </p>
          </div>
          <input
            type="file"
            id="image"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {/* Status Chips
            ✅ كان: bg-gray-800 border-gray-700
            ✅ بقى: bg-white/5 border-white/10 — شفاف
        */}
        {hasChanges && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {images.length > 0 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                {images.length} saved
              </span>
            )}
            {newImages.length > 0 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-900/20 text-purple-300 border border-purple-500/25">
                +{newImages.length} new
              </span>
            )}
            {deletedImages.length > 0 && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                -{deletedImages.length} removed
              </span>
            )}
          </div>
        )}

        {/* Empty State
            ✅ كان: bg-gray-800/60
            ✅ بقى: bg-white/5 — شفاف
        */}
        {allImages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <HiOutlinePhotograph size={22} className="text-gray-600" />
            </div>
            <p className="text-gray-600 text-[13px]">No menu images yet</p>
          </div>
        )}

        {/* Image Grid
            ✅ كان: bg-gray-900
            ✅ بقى: bg-white/5 backdrop-blur-sm — شفاف مع blur
        */}
        {allImages.length > 0 && (
          <>
            <p className="text-[11px] text-gray-600 uppercase tracking-widest mb-3">
              Preview
            </p>
            <div className="grid grid-cols-3 gap-3">
              {allImages.map((image, index) => {
                const isNew = index >= images.length;
                return (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    <img
                      src={image}
                      alt={`Menu image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* New badge
                        ✅ كان: bg-violet-500/80
                        ✅ بقى: bg-purple-600/80 — brand color
                    */}
                    {isNew && (
                      <span className="absolute top-2 left-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-600/80 text-white backdrop-blur-sm">
                        new
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteImage(index, image)}
                      disabled={isLoading}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-red-500/80 transition-colors duration-150 disabled:opacity-50"
                    >
                      <AiFillDelete size={12} color="white" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Save Button
            ✅ كان: bg-violet-600 hover:bg-violet-500
            ✅ بقى: bg-green-800 hover:bg-green-700 — brand green
            + border + backdrop-blur عشان يتناسق مع الـ layout
        */}
        {hasChanges && (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-6 w-full py-3.5 rounded-xl bg-green-800 hover:bg-green-700 active:scale-[0.98] text-white text-[14px] font-medium transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-green-600/30"
          >
            {isLoading ? <BtnSnipper /> : "Save changes"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EditMenu;
