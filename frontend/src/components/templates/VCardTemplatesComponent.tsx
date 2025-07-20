import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import FourthUiTest from "../v-card ui/FourthUiTest";
import SecondUiTest from "../v-card ui/SecondUiTest";
import { dummyData } from "../../utils/dummyData";
import FirstUITest from "../v-card ui/FirstUiTest";
import ThirdUITest from "../v-card ui/ThirdUiTest";

const VCardTemplatesComponent = () => {
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
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const serviceType = searchParams.get("service-type");

  const onTemplateSelect = (v_card_type: string) => {
    if (!serviceType) {
      toast.error("there is no type provided");
      console.log(serviceType);
    } else {
      navigate(
        `/customize-template?service-type=${serviceType}&v-card-ui=${v_card_type}`
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center w-full max-w-md mb-8">
        <p className="font-bold text-lg text-purple-700 bg-purple-50 px-4 py-2 rounded-md shadow-sm">
          Select a template to customize it for your needs.
        </p>
      </div>
      {/* Template Selection */}
      <div className="w-full grid grid-cols-1 gap-6 place-items-center">
        {vCardStyles.map((ele) => {
          return (
            <div
              key={ele?.id}
              className={`border-2 p-0 rounded-lg cursor-pointer hover:border-purple-500 transition max-w-[500px]`}
              onClick={() => onTemplateSelect(ele?.type)}
            >
              {ele?.component}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VCardTemplatesComponent;
