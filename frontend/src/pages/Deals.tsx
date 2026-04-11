import { motion } from "framer-motion";
import { ImFire } from "react-icons/im";

export default function Deals() {
  const deals = [
    {
      id: 1,
      name: "Pharmacies",
      desc: "20% off on all products",
      link: "#",
    },
    { id: 2, name: "Resturants", desc: "Buy 1 Get 1 Free", link: "#" },
    {
      id: 3,
      name: "Store Three",
      desc: "Free delivery on orders over $50",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-6 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-3 mb-8"
      >
        <ImFire className="text-red-500 text-3xl" />
        <h3 className="text-3xl font-extrabold text-white tracking-wide">
          Hot Deals for You
        </h3>
      </motion.div>

      {/* Deal Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl"
      >
        {deals.map((deal, i) => (
          <motion.div
            key={deal.id}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
          >
            {/* Top Section with Coupon Effect */}
            <div className="bg-green-600 text-white px-6 pt-6 pb-16 relative">
              <h4 className="text-sm uppercase">Special Offer</h4>
              <h2 className="font-bold text-2xl mt-2">{deal.name}</h2>
              <div className="absolute -bottom-6 left-0 w-full flex justify-between">
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 bg-white rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 pt-10 text-center">
              <p className="text-lg font-semibold text-gray-800">{deal.desc}</p>
              <p className="text-sm text-gray-500 mt-1">
                Save big on your next purchase
              </p>
              <a href={deal.link} className="text-xs text-blue-600 mt-2 block">
                *Terms & conditions apply
              </a>
            </div>

            {/* Button Section */}
            <div className="border-t p-4 text-center">
              <button className="w-full py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition">
                Apply Code
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
