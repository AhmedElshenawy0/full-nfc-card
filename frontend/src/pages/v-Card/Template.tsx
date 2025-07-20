import { useSearchParams } from "react-router-dom";
import FirstUI from "../../components/v-card ui/FirstUI";
import SecondUI from "../../components/v-card ui/SecondUI";
import ThirdUI from "../../components/v-card ui/ThirdUI";
import { useGetOneSoldServicesQuery } from "../../store/apiSlice/Soldslice";
import { useEffect } from "react";
import FourthUI from "../../components/v-card ui/ForthUI";
import Snipper from "../../components/global/Snipper";

const VCard = () => {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  const {
    data: response,
    isSuccess,
    error,
    isError,
    isLoading,
  } = useGetOneSoldServicesQuery(id);

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
  }, [error, isError]);

  const vCardContent = response?.soldServices;
  console.log(response);
  if (isLoading) {
    return <Snipper />;
  }

  // Show error state if there's an error in fetching the data
  if (isError) {
    return <p>Error loading data</p>;
  }
  return isSuccess === true ? (
    <>
      {vCardContent?.vCardUi === "firstUI" && (
        <FirstUI data={vCardContent?.vCardupdatableContent} />
      )}
      {response?.soldServices?.vCardUi === "secondUI" && (
        <SecondUI data={vCardContent?.vCardupdatableContent} />
      )}
      {response?.soldServices?.vCardUi === "thirdUI" && (
        <ThirdUI data={vCardContent?.vCardupdatableContent} />
      )}
      {response?.soldServices?.vCardUi === "fourthUI" && (
        <FourthUI data={vCardContent?.vCardupdatableContent} />
      )}
    </>
  ) : (
    <p>No data</p>
  );
};

export default VCard;
