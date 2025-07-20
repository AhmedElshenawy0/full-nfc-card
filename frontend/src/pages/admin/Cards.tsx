import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Typewriter from "typewriter-effect";
import {
  useDeleteCardMutation,
  useGetAllCardsQuery,
} from "../../store/apiSlice/CardSlice";
import Snipper from "../../components/global/Snipper";
import { Card, CustomError } from "../../types/types";
import BtnSnipper from "../../components/global/BtnSnipper";
import { FaUnlockAlt } from "react-icons/fa";
import copy from "copy-to-clipboard";

const Cards = () => {
  const navigate = useNavigate();
  const [shouldFetchCards, setShouldFetchCards] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, isLoading } = useGetAllCardsQuery(undefined, {
    skip: !shouldFetchCards,
  });

  console.log(data);

  useEffect(() => {
    setShouldFetchCards(true);
  }, []);

  const categories: any[] = [
    "All",
    ...new Set(data?.cards?.map((card: Card) => card.nfc_type)),
  ];

  const sortedCards = useMemo(() => {
    if (!Array.isArray(data?.cards)) return [];

    const filtered =
      selectedCategory === "All"
        ? data.cards
        : data.cards.filter((card: Card) => card.nfc_type === selectedCategory);

    return filtered.slice().sort((a: any, b: any) => {
      return Number(Boolean(b.client)) - Number(Boolean(a.client));
    });
  }, [data?.cards, selectedCategory]);

  const [deleteCard, { isSuccess, isError, error, isLoading: isUnassigning }] =
    useDeleteCardMutation();

  const handleDeleteCard = async (card: Card) => {
    if (!card?.client_id) {
      toast.error("This card has not been assigned to any client.");
      return;
    }
    if (isUnassigning) return;

    try {
      await deleteCard(card.unique_code).unwrap();
      setShowModal(false);
    } catch (err) {
      console.error("Delete Error:", err);
      toast.error("Failed to Deactivate card. Please try again.");
    }
  };

  const customError = error as CustomError;

  useEffect(() => {
    if (isError) {
      const msg =
        (customError?.data?.message as string) || "Deactivate failed.";
      toast.error(msg);
    } else if (isSuccess) {
      toast.success("Card Deactivated successfully.");
    }
  }, [isError, isSuccess, error]);

  const viewService = (card: any) => {
    if (!card.client_id) return toast.error("Invalid card");
    if (card?.sold_service?.type === "vCard") {
      window.open(
        `${window.location.origin}/template?id=${card?.sold_service?.id}`,
        "_blank"
      );
    } else if (card?.sold_service.type === "menu") {
      window.open(
        `${window.location.origin}/menu-template?id=${card?.sold_service?.id}`,
        "_blank"
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="p-2 bg-green-950 rounded-full absolute top-8 right-6 text-gray-400 hover:text-white transition"
        >
          <FaArrowLeft color="white" />
        </button>
        <h1 className="text-xl font-bold mb-4 text-center sm:text-left">
          <Typewriter
            options={{
              strings: ["Manage Your Cards", "Customize & Control"],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>
      </div>

      <div className="text-sm text-gray-300 mb-4">
        Total Cards: {sortedCards?.length || 0}
      </div>

      <div className="flex flex-wrap gap-4 mb-8 justify-center sm:justify-center">
        {categories.map((cardType) => (
          <button
            key={cardType}
            onClick={() => setSelectedCategory(cardType)}
            className={`px-3 py-2 min-w-[22%] rounded-full transition ${
              selectedCategory === cardType
                ? "bg-green-700 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
          >
            {cardType}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Snipper />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(sortedCards) &&
            sortedCards.map((card, i) => (
              <div
                key={card.id}
                className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all border border-gray-800"
              >
                <div className="absolute top-4 right-4 text-xs text-gray-500">
                  #{i + 1}
                </div>
                <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
                  {card.nfc_type}
                </h2>
                <p className="text-gray-400 mb-1 capitalize">
                  <span className="font-medium text-white">Type:</span>{" "}
                  {card.nfc_type}
                </p>
                <p className="text-gray-400 capitalize">
                  <span className="font-medium text-white ">Owner:</span>{" "}
                  {card.client?.first_name ? (
                    `${card.client.first_name} ${card.client.last_name}`
                  ) : (
                    <span className="italic text-red-400 font-semibold">
                      Not Active
                    </span>
                  )}
                </p>

                <div className="flex flex-col gap-2 mt-6 w-full">
                  {card?.client_id ? (
                    <button
                      onClick={() => {
                        setSelectedCard(card);
                        setShowModal(true);
                      }}
                      className="w-full font-medium bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-xl flex justify-center items-center gap-2"
                    >
                      <FaUnlockAlt />

                      <span className="text-sm">Deactivate</span>
                    </button>
                  ) : (
                    ""
                  )}
                  {!card?.client_id && !card?.sold_service?.id ? (
                    <button
                      onClick={() => {
                        if (!card.unique_code)
                          return toast.error("Invalid card");

                        const link = `${window.location.origin}?unique_code=${card.unique_code}`;

                        const success = copy(link);

                        if (success) {
                          toast.success("Link copied to clipboard 🔗");
                        } else {
                          toast.error("Failed to copy link");
                        }
                      }}
                      className="w-full font-medium bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl flex justify-center items-center gap-2"
                    >
                      🔗 <span className="text-sm">Generate Link</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => viewService(card)}
                      className="w-full font-medium bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl flex justify-center items-center gap-2"
                    >
                      <span className="text-sm">View</span>
                    </button>
                  )}

                  {/* Deactivate card */}
                  {showModal && selectedCard?.id === card.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
                      <div className="bg-white text-black rounded-xl p-6 w-[90%] max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                          Are you sure you want to deactivate this card?
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                          This will disconnect the assigned client. This action
                          cannot be undone.
                        </p>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setShowModal(false)}
                            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteCard(card)}
                            disabled={isUnassigning}
                            className={`px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${
                              isUnassigning
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            {isUnassigning ? (
                              <div className="flex items-center justify-center gap-2 text-center">
                                <BtnSnipper />
                                Deactivating...
                              </div>
                            ) : (
                              "Deactivate"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {sortedCards?.length === 0 && (
        <p className="text-center text-gray-400 mt-12">
          No cards available.{" "}
          <Link to="/admin/add-card" className="text-blue-400 hover:underline">
            Add a new card
          </Link>
          .
        </p>
      )}
    </div>
  );
};

export default Cards;
