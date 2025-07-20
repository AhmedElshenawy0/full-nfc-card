import FirstUITest from "../v-card ui/FirstUiTest";
import { dummyData } from "../../utils/dummyData";
import ThirdUITest from "../v-card ui/ThirdUiTest";
import SecondUiTest from "../v-card ui/SecondUiTest";
import FourthUiTest from "../v-card ui/FourthUiTest";

const ChangeTheme = ({
  setIsThemeOpen,
  setTheme,
  theme,
}: {
  setIsThemeOpen: any;
  setTheme: any;
  theme: any;
}) => {
  const vCardStyles = [
    {
      id: 1,
      type: "fourthUI",
      component: (
        <FourthUiTest
          formData={dummyData}
          tempMainBackground={null}
          tempButtonBackground={null}
        />
      ),
    },
    {
      id: 2,
      type: "secondUI",
      component: (
        <SecondUiTest
          formData={dummyData}
          tempMainBackground={null}
          tempButtonBackground={null}
        />
      ),
    },
    {
      id: 3,
      type: "thirdUI",
      component: (
        <ThirdUITest
          formData={dummyData}
          tempMainBackground={null}
          tempButtonBackground={null}
        />
      ),
    },
    {
      id: 4,
      type: "firstUI",
      component: (
        <FirstUITest
          formData={dummyData}
          tempMainBackground={null}
          tempButtonBackground={null}
        />
      ),
    },
  ];
  console.log(theme);

  const handleUpdateUi = (type: string) => {
    setTheme(type);
    setIsThemeOpen(false);
  };
  return (
    <div className="right-0 w-full absolute top-0 bg-black px-3 py-7 flex flex-col items-center">
      <div className="text-center w-full max-w-md mb-8">
        <p className="font-bold text-lg text-purple-700 bg-purple-50 px-4 py-2 rounded-md shadow-sm">
          Select a template to customize it for your needs.
        </p>
      </div>
      {/* Template Selection */}
      <div className="relative w-full grid grid-cols-1 gap-6">
        {vCardStyles.map((ele) => {
          return (
            <div
              key={ele?.id}
              className={`border-2 p-0 rounded-lg cursor-pointer hover:border-purple-500 transition`}
              onClick={() => handleUpdateUi(ele?.type)}
            >
              {ele?.component}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChangeTheme;
