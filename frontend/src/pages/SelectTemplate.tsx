import { useSearchParams } from "react-router-dom";
import VCardTemplatesComponent from "../components/templates/VCardTemplatesComponent";
import MenuTemplatesComponent from "../components/templates/MenuTemplatesComponent";
import colors from "tailwindcss/colors";

const SelectTemplate = () => {
  const [searchParams] = useSearchParams();

  const param = searchParams.get("service-type");
  console.log(colors.purple[400]);

  console.log(param);

  return (
    <>
      {param === "vCard" && <VCardTemplatesComponent />}
      {param === "menu" && <MenuTemplatesComponent />}
    </>
  );
};

export default SelectTemplate;
