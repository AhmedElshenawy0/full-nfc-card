import { useEffect } from "react";
import { ChangeBgColorProps } from "../../types/types";
import FirstUITest from "../v-card ui/FirstUiTest";
import FourthUiTest from "../v-card ui/FourthUiTest";
import SecondUiTest from "../v-card ui/SecondUiTest";
import ThirdUITest from "../v-card ui/ThirdUiTest";

const ChangeBgColor = ({
  tempMainBackground,
  formData,
  tempButtonBackground,
  setIsColorOpen,
  setTempMainBackground,
  setTempButtonBackground,
  ui,
  setFormData,
}: ChangeBgColorProps) => {
  console.log(ui);

  const renderVCardUI = () => {
    switch (ui) {
      case "fourthUI":
        return (
          <FourthUiTest
            formData={formData}
            tempMainBackground={tempMainBackground}
            tempButtonBackground={tempButtonBackground}
          />
        );
      case "thirdUI":
        return (
          <ThirdUITest
            formData={formData}
            tempMainBackground={tempMainBackground}
            tempButtonBackground={tempButtonBackground}
          />
        );
      case "firstUI":
        return (
          <FirstUITest
            formData={formData}
            tempMainBackground={tempMainBackground}
            tempButtonBackground={tempButtonBackground}
          />
        );
      case "secondUI":
        return (
          <SecondUiTest
            tempMainBackground={tempMainBackground}
            tempButtonBackground={tempButtonBackground}
            formData={formData}
          />
        );

      default:
        return (
          <div className="text-center text-red-400 py-4">
            Unsupported template type
          </div>
        );
    }
  };

  const handleSave = () => {
    setFormData({
      ...formData,
      mainBackground: tempMainBackground,
      buttonBackground: tempButtonBackground,
    });
    setIsColorOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex flex-col px-0 py-8 w-full z-50 right-0 absolute bg-[#1f0729] h-full top-0 gap-1 items-center space-y-2">
      {/* Controller color btns */}
      <div className="w-full max-w-xl space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">
            🎨 Customize Your Template Colors
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            Pick your preferred colors for the background and button.
          </p>
        </div>

        {/* Color Controls */}
        <div className="flex z-10 justify-between gap-4">
          {/* Main Background Color */}
          <div className="rounded-xl mx-2 w-fit h-fit shadow-lg flex items-center justify-end space-x-2">
            <span className="bg-white p-2 rounded-xl text-sm font-medium text-gray-700">
              Main Background
            </span>
            <div className="flex gap-2 items-center bg-white py-1 px-2 rounded-xl">
              <label
                htmlFor="mainBackground"
                className="w-8 h-8 rounded-full border-2 border-gray-400 shadow-md cursor-pointer transition-all hover:scale-110"
                style={{
                  backgroundColor:
                    tempMainBackground || formData.mainBackground,
                }}
                title="Click to change main background color"
              ></label>
              <input
                id="mainBackground"
                type="color"
                value={tempMainBackground || formData.mainBackground}
                onChange={(e) => setTempMainBackground(e.target.value)}
                className="hidden"
              />
              <span className="text-xs text-gray-500">
                {tempMainBackground || formData.mainBackground}
              </span>
            </div>
          </div>

          {/* Button Background Color */}
          <div className=" rounded-xl mx-2 w-fit h-fit shadow-lg flex items-center justify-center flex-row-reverse gap-2 space-x-2">
            <span className="bg-white p-2 rounded-xl text-sm font-medium text-gray-700">
              Button Background
            </span>
            <div className="flex gap-2 items-center bg-white py-1 px-2 rounded-xl">
              <label
                htmlFor="buttonBackground"
                className="w-8 h-8 rounded-full border-2 border-gray-400 shadow-md cursor-pointer transition-all hover:scale-110"
                style={{
                  backgroundColor:
                    tempButtonBackground || formData.buttonBackground,
                }}
                title="Click to change button background color"
              ></label>
              <input
                id="buttonBackground"
                type="color"
                value={tempButtonBackground || formData.buttonBackground}
                onChange={(e) => setTempButtonBackground(e.target.value)}
                className="hidden"
              />
              <span className="text-xs text-gray-500">
                {tempButtonBackground || formData.buttonBackground}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Show Template */}
      <div className="w-full">{renderVCardUI()}</div>
      {/* Buttons */}
      <div className="flex items-center px-2 w-full mt-5 gap-2">
        <button
          className="px-4 py-2 bg-gray-100 w-full text-black rounded-md hover:bg-gray-500 transition"
          onClick={() => setIsColorOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-800 w-full text-white rounded-md hover:bg-green-600 transition"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ChangeBgColor;
