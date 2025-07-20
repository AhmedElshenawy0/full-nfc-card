import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
// import Typewriter from "typewriter-effect";
import "swiper/css";
import "../../index.css";
import { useGetOneSoldServicesQuery } from "../../store/apiSlice/Soldslice";
import Snipper from "../../components/global/Snipper";
import { useState } from "react";
import { FiX } from "react-icons/fi";

const MenuTemplate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const id = searchParams.get("id");

  const { data: response, isLoading } = useGetOneSoldServicesQuery(id);

  const menuService = response?.soldServices;

  if (!id) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-xl">
        Invalid or missing menu ID
      </div>
    );
  }

  if (isLoading) return <Snipper />;
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black to-[#3a0d4e] text-gray-200 p-0">
      {/* <div className="text-xl sm:text-4xl md:text-5xl font-extrabold text-white text-center mb-4 tracking-wide drop-shadow-md">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString("Welcom To Bad Elhara")
              .pauseFor(2000)
              .deleteAll()
              .start();
          }}
          options={{
            loop: true,
            delay: 100,
          }}
        />
      </div> */}

      {menuService?.menuUpdatableContent?.length > 0 ? (
        <div className="w-full flex items-center justify-center">
          <div className="w-[100%] ">
            <Swiper
              effect="cards"
              grabCursor={true}
              modules={[EffectCards]}
              style={{
                width: "100%",
                padding: "10px 30px",
                overflow: "hidden",
              }}
              className="w-[100%]  h-[90vh] rounded-xl overflow-hidden"
            >
              {menuService?.menuUpdatableContent.map(
                (image: string, index: number) => (
                  <SwiperSlide
                    key={index}
                    className="w-full aspect-[3/4] flex items-center justify-center rounded-xl overflow-hidden shadow-lg border border-gray-700 bg-black"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={image}
                        alt={`Menu Page ${index + 1}`}
                        className="w-full h-[70%] object-cover cursor-pointer"
                        onClick={() => setPreviewImage(image)}
                        loading="lazy"
                      />
                    </div>
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-12">
          No menu items available.
        </p>
      )}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-2 text-white text-2xl bg-green-900 rounded-full w-10 h-10 flex items-center justify-center "
            >
              <FiX size={20} className="text-white" />{" "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuTemplate;
