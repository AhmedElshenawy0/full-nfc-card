import { useEffect } from "react";
import { ChangeBgColorProps } from "../../types/types";
import FirstUITest from "../v-card ui/FirstUiTest";
import FourthUiTest from "../v-card ui/FourthUiTest";
import SecondUiTest from "../v-card ui/SecondUiTest";
import ThirdUITest from "../v-card ui/ThirdUiTest";
import { ConfigProvider, Typography, Button, theme as antTheme } from "antd";
import { CloseOutlined, BgColorsOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

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
          <div
            style={{ textAlign: "center", color: "#f87171", padding: "16px 0" }}
          >
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
    <ConfigProvider
      theme={{
        algorithm: antTheme.darkAlgorithm,
        token: {
          colorPrimary: "#a855f7",
          colorBgContainer: "#13131a",
          borderRadius: 12,
        },
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          minHeight: "100%",
          backgroundColor: "#0d0d10",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "28px 16px 32px",
          gap: 24,
          overflow: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            width: "100%",
            maxWidth: 448,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Text
              style={{
                color: "#a855f7",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                display: "block",
                marginBottom: 4,
              }}
            >
              Appearance
            </Text>
            <Title level={3} style={{ color: "#fff", margin: 0 }}>
              Customize Colors
            </Title>
          </div>
          <button
            onClick={() => setIsColorOpen(false)}
            style={{
              background: "#1c1c26",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#9ca3af",
              flexShrink: 0,
            }}
          >
            <CloseOutlined style={{ fontSize: 14 }} />
          </button>
        </div>

        <Text
          type="secondary"
          style={{ fontSize: 13, maxWidth: 448, width: "100%" }}
        >
          Pick your preferred colors for the background and button.
        </Text>

        {/* Color Controls */}
        <div
          style={{
            width: "100%",
            maxWidth: 448,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {/* Main Background */}
          <div
            style={{
              backgroundColor: "#13131a",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Main BG
            </Text>
            <label
              htmlFor="mainBackground"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor:
                    tempMainBackground || formData.mainBackground,
                  border: "2px solid rgba(255,255,255,0.15)",
                  flexShrink: 0,
                  boxShadow: `0 0 10px ${tempMainBackground || formData.mainBackground}55`,
                  transition: "box-shadow 0.2s",
                }}
              />
              <Text
                style={{
                  color: "#6b7280",
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
              >
                {tempMainBackground || formData.mainBackground || "—"}
              </Text>
            </label>
            <input
              id="mainBackground"
              type="color"
              value={tempMainBackground || formData.mainBackground}
              onChange={(e) => setTempMainBackground(e.target.value)}
              style={{ display: "none" }}
            />
          </div>

          {/* Button Background */}
          <div
            style={{
              backgroundColor: "#13131a",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Button BG
            </Text>
            <label
              htmlFor="buttonBackground"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor:
                    tempButtonBackground || formData.buttonBackground,
                  border: "2px solid rgba(255,255,255,0.15)",
                  flexShrink: 0,
                  boxShadow: `0 0 10px ${tempButtonBackground || formData.buttonBackground}55`,
                  transition: "box-shadow 0.2s",
                }}
              />
              <Text
                style={{
                  color: "#6b7280",
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
              >
                {tempButtonBackground || formData.buttonBackground || "—"}
              </Text>
            </label>
            <input
              id="buttonBackground"
              type="color"
              value={tempButtonBackground || formData.buttonBackground}
              onChange={(e) => setTempButtonBackground(e.target.value)}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Live Preview */}
        <div
          style={{
            width: "100%",
            maxWidth: 448,
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              padding: "8px 14px",
              backgroundColor: "#13131a",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <BgColorsOutlined style={{ color: "#a855f7", fontSize: 13 }} />
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Live Preview
            </Text>
          </div>
          <div style={{ pointerEvents: "none" }}>{renderVCardUI()}</div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            width: "100%",
            maxWidth: 448,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <Button
            block
            onClick={() => setIsColorOpen(false)}
            style={{
              height: 44,
              backgroundColor: "#1c1c26",
              borderColor: "rgba(255,255,255,0.08)",
              color: "#d1d5db",
              borderRadius: 12,
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            block
            onClick={handleSave}
            style={{
              height: 44,
              background: "linear-gradient(to right, #15803d, #059669)",
              borderColor: "transparent",
              color: "#fff",
              borderRadius: 12,
              fontWeight: 600,
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ChangeBgColor;
