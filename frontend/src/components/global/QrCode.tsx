import { useRef, useState, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { FaDownload, FaTimes, FaUpload } from "react-icons/fa";

interface QRWithImageProps {
  qrUrl: string;
}

const QRWithImage = ({ qrUrl }: QRWithImageProps) => {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const qrPreviewRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadClick = () => {
    setShowModal(true);
  };

  const handleLogoUpload = () => {
    document.getElementById("logoInput")?.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleGenerateQR = () => {
    if (!qrPreviewRef.current) return;

    qrPreviewRef.current.innerHTML = "";
    qrCodeRef.current = new QRCodeStyling({
      width: 250,
      height: 250,
      data: qrUrl,
      image: logoUrl || undefined,
      margin: 4,
      qrOptions: {
        errorCorrectionLevel: "H",
      },
      imageOptions: {
        ...(logoUrl && {
          crossOrigin: "anonymous",
          margin: 6,
          imageSize: 0.25,
          hideBackgroundDots: true,
        }),
      },
      dotsOptions: {
        color: "#000000",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    });

    qrCodeRef.current.append(qrPreviewRef.current);
  };

  const handleDownload = () => {
    qrCodeRef.current?.download({ name: "qr-code", extension: "png" });
    setShowModal(false);
  };

  useEffect(() => {
    handleGenerateQR();
  }, [showModal, logoUrl]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleDownloadClick}
        className="text-sm w-full py-3 rounded-xl font-bold bg-neutral-300 text-black cursor-pointer"
      >
        Download QR Code
      </button>

      {/* Hidden file input */}
      <input
        id="logoInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoChange}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-2 text-center max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-800">
              Customize QR Code
            </h2>
            <p className="text-sm text-gray-500">
              Upload a logo or preview your QR before downloading.
            </p>

            {/* QR Preview */}
            <div
              ref={qrPreviewRef}
              className="mx-auto bg-white rounded-md shadow p-0 w-20 text-center flex justify-center"
            />

            {/* Button Group */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleLogoUpload}
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold border border-transparent flex items-center justify-center gap-2"
              >
                <FaUpload className="-mt-0.5" />
                Upload Logo
              </button>

              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 rounded-xl bg-green-800 text-white text-sm font-semibold border border-transparent flex items-center justify-center gap-2"
              >
                <FaDownload className="-mt-0.5" />
                Download QR Code
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 rounded-xl bg-white text-red-600 text-sm font-semibold border border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
              >
                <FaTimes className="-mt-0.5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRWithImage;
