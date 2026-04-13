import FirstUITest from "../v-card ui/FirstUiTest";
import { dummyData } from "../../utils/dummyData";
import ThirdUITest from "../v-card ui/ThirdUiTest";
import SecondUiTest from "../v-card ui/SecondUiTest";
import FourthUiTest from "../v-card ui/FourthUiTest";
import { ConfigProvider, Typography, theme as antTheme } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

const { Text } = Typography;

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
      label: "Theme 1",
      component: (
        <FourthUiTest
          formData={dummyData[0]}
          tempMainBackground={null}
          tempButtonBackground={null}
        />
      ),
    },
    {
      id: 2,
      type: "secondUI",
      label: "Theme 2",
      component: (
        <SecondUiTest
          formData={dummyData[1]}
          tempMainBackground={null}
          tempButtonBackground={null}
        />
      ),
    },
    {
      id: 3,
      type: "thirdUI",
      label: "Theme 3",
      component: (
        <ThirdUITest
          formData={dummyData[2]}
          tempMainBackground={null}
          tempButtonBackground={null}
        />
      ),
    },
    {
      id: 4,
      type: "firstUI",
      label: "Theme 4",
      component: (
        <FirstUITest
          formData={dummyData[3]}
          tempMainBackground={null}
          tempButtonBackground={null}
        />
      ),
    },
  ];

  const handleUpdateUi = (type: string) => {
    setTheme(type);
    setIsThemeOpen(false);
  };

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
          position: "fixed", // ← was "absolute"
          right: 0,
          top: 0,
          left: 0, // ← add this
          bottom: 0, // ← add this
          width: "100%",
          height: "100vh", // ← full viewport height
          backgroundColor: "#0d0d10",
          zIndex: 50,
          padding: "28px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto", // ← scroll happens here
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
            marginBottom: 24,
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
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
                display: "block",
              }}
            >
              Choose a Theme
            </Text>
          </div>
          <button
            onClick={() => setIsThemeOpen(false)}
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
          style={{
            fontSize: 13,
            marginBottom: 24,
            display: "block",
            maxWidth: 448,
            width: "100%",
          }}
        >
          Select a template to customize it for your needs.
        </Text>

        {/* Theme Grid */}
        <div
          style={{
            width: "100%",
            maxWidth: 448,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 16,
          }}
        >
          {vCardStyles.map((ele) => {
            const isSelected = theme === ele.type;
            return (
              <div
                key={ele.id}
                onClick={() => handleUpdateUi(ele.type)}
                style={{
                  position: "relative",
                  borderRadius: 16,
                  border: isSelected
                    ? "2px solid #a855f7"
                    : "2px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  boxShadow: isSelected
                    ? "0 0 0 4px rgba(168,85,247,0.15)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(168,85,247,0.4)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(255,255,255,0.06)";
                }}
              >
                {/* Selected badge */}
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: 10,
                      background: "#a855f7",
                      borderRadius: "50%",
                      width: 26,
                      height: 26,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(168,85,247,0.5)",
                    }}
                  >
                    <CheckOutlined style={{ color: "#fff", fontSize: 12 }} />
                  </div>
                )}

                {/* Label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    padding: "20px 14px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {ele.label}
                  </Text>
                  {isSelected && (
                    <Text
                      style={{
                        color: "#c084fc",
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      Selected
                    </Text>
                  )}
                </div>

                {/* Component Preview */}
                <div style={{ pointerEvents: "none" }}>{ele.component}</div>
              </div>
            );
          })}
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ChangeTheme;
