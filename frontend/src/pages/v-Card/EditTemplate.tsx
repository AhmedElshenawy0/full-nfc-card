import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetOneSoldServicesQuery,
  useUpdateSoldServiceMutation,
} from "../../store/apiSlice/Soldslice";
import { CustomError, V_card_data } from "../../types/types";
import ChangeBgColor from "../../components/templates/ChangeBgColor";
import ChangeTheme from "../../components/templates/ChangeTheme";
import { FaCheck } from "react-icons/fa";
import {
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  ConfigProvider,
  theme,
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const CustomizeTemplate = () => {
  const [formData, setFormData] = useState<V_card_data>({
    name: "",
    bio: "",
    job: "",
    about: "",
    image: "",
    phone: "",
    address: "",
    facebook_link: "",
    instgram_link: "",
    linkedin_link: "",
    mainBackground: "",
    buttonBackground: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [antForm] = Form.useForm();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const service_Id = searchParams.get("id");

  const { data: response } = useGetOneSoldServicesQuery(service_Id);
  const vCardContent = response?.soldServices?.vCardupdatableContent;
  const [selectedTheme, setTheme] = useState("");

  useEffect(() => {
    if (vCardContent) {
      const data = {
        name: vCardContent.name || "",
        bio: vCardContent.bio || "",
        job: vCardContent.job || "",
        about: vCardContent.about || "",
        image: vCardContent.image || "",
        phone: vCardContent.phone || "",
        address: vCardContent.address || "",
        facebook_link: vCardContent.facebook_link || "",
        instgram_link: vCardContent.instgram_link || "",
        linkedin_link: vCardContent.linkedin_link || "",
        mainBackground: vCardContent.mainBackground || "",
        buttonBackground: vCardContent.buttonBackground || "",
      };
      setFormData(data);
      antForm.setFieldsValue(data);
      setImagePreview(vCardContent.image);
    }
  }, [vCardContent]);

  // Prevent antd auto-upload, handle preview manually
  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    return false;
  };

  const [updateSoldService, { isError, error, isLoading }] =
    useUpdateSoldServiceMutation();

  const handleSubmit = async () => {
    try {
      const values = antForm.getFieldsValue();
      const mergedData = { ...formData, ...values };

      const formDataData = new FormData();
      formDataData.append("type", "vCard");
      if (selectedTheme) formDataData.append("vCardUi", selectedTheme);

      Object.entries(mergedData).forEach(([key, value]) => {
        formDataData.append(key, (value as string) ?? "");
      });

      if (imageFile) {
        formDataData.append("profileImage", imageFile);
      }

      await updateSoldService({
        id: service_Id,
        data: formDataData,
        theme: selectedTheme,
      }).unwrap();

      toast.success("Sold service updated successfully");
      navigate("/client-dashboard");
    } catch (err) {
      toast.error("Something went wrong while updating");
      console.log(err);
    }
  };

  const [tempMainBackground, setTempMainBackground] = useState(
    formData.mainBackground,
  );
  const [tempButtonBackground, setTempButtonBackground] = useState(
    formData.buttonBackground,
  );
  const [textColor, setTextColor] = useState("black");
  const [btnColor, setBtnColor] = useState("black");

  useEffect(() => {
    if (isColorOpen) {
      setTempMainBackground(formData.mainBackground);
      setTempButtonBackground(formData.buttonBackground);
    }
  }, [isColorOpen]);

  useEffect(() => {
    const isDark = (hex: string) => {
      if (!hex) return false;
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 130;
    };
    setTextColor(isDark(tempMainBackground) ? "#fff" : "#000");
    setBtnColor(isDark(tempButtonBackground) ? "#fff" : "#000");
  }, [tempMainBackground, tempButtonBackground]);

  const customError = error as CustomError;
  useEffect(() => {
    if (isError && customError?.data?.message) {
      toast.error(customError.data.message);
    }
  }, [isError, error]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionLabel = (text: string) => (
    <Text
      style={{
        color: "#a855f7",
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      {text}
    </Text>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#a855f7",
          colorBgContainer: "#13131a",
          colorBgElevated: "#1c1c26",
          colorBorder: "rgba(255,255,255,0.07)",
          borderRadius: 12,
          colorText: "#e5e7eb",
          colorTextSecondary: "#9ca3af",
        },
        components: {
          Input: {
            colorBgContainer: "#1c1c26",
            colorBorder: "rgba(255,255,255,0.07)",
            hoverBorderColor: "#a855f7",
            activeBorderColor: "#a855f7",
          },
          Card: {
            colorBgContainer: "#13131a",
            colorBorderSecondary: "rgba(255,255,255,0.06)",
          },
          Button: {
            colorBgContainer: "#1c1c26",
          },
        },
      }}
    >
      <div
        style={{ backgroundColor: "#0d0d10" }}
        className="flex flex-col min-h-screen items-center px-4 py-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Text
            style={{
              color: "#a855f7",
              letterSpacing: "0.18em",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              display: "block",
              marginBottom: 8,
            }}
          >
            Template Editor
          </Text>
          <Title level={2} style={{ color: "#fff", margin: 0 }}>
            Edit Your Card
          </Title>
          <div
            style={{
              width: 48,
              height: 2,
              background: "linear-gradient(to right, #a855f7, #3b82f6)",
              borderRadius: 9999,
              margin: "12px auto 0",
            }}
          />
        </div>

        <Form
          form={antForm}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ width: "100%", maxWidth: 448 }}
          requiredMark={false}
        >
          {/* Profile Image */}
          <Card style={{ marginBottom: 16, textAlign: "center" }}>
            <Upload
              showUploadList={false}
              beforeUpload={handleImageUpload}
              accept="image/*"
            >
              <div
                style={{
                  display: "inline-block",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <Avatar
                  src={imagePreview || formData.image}
                  size={112}
                  style={{ border: "2px solid rgba(255,255,255,0.1)" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    background: "#1c1c26",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <UploadOutlined style={{ color: "#fff", fontSize: 13 }} />
                </div>
              </div>
            </Upload>
            <Text
              type="secondary"
              style={{ fontSize: 12, marginTop: 8, display: "block" }}
            >
              Click avatar to change · Max 3MB
            </Text>
          </Card>

          {/* Personal Info */}
          <Card
            title={sectionLabel("Personal Info")}
            style={{ marginBottom: 16 }}
          >
            {[
              ["name", "Full Name"],
              ["job", "Job Title"],
              ["bio", "Bio"],
              ["about", "About"],
            ].map(([key, label]) => (
              <Form.Item
                key={key}
                name={key}
                label={label}
                style={{ marginBottom: 12 }}
              >
                <Input
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </Form.Item>
            ))}
          </Card>

          {/* Contact */}
          <Card title={sectionLabel("Contact")} style={{ marginBottom: 16 }}>
            {[
              ["phone", "Phone Number"],
              ["address", "Address"],
            ].map(([key, label]) => (
              <Form.Item
                key={key}
                name={key}
                label={label}
                style={{ marginBottom: 12 }}
              >
                <Input
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </Form.Item>
            ))}
          </Card>

          {/* Social Links */}
          <Card
            title={sectionLabel("Social Links")}
            style={{ marginBottom: 16 }}
          >
            {[
              ["facebook_link", "Facebook"],
              ["instgram_link", "Instagram"],
              ["linkedin_link", "LinkedIn"],
            ].map(([key, label]) => (
              <Form.Item
                key={key}
                name={key}
                label={label}
                style={{ marginBottom: 12 }}
              >
                <Input
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                />
              </Form.Item>
            ))}
          </Card>

          {/* Appearance */}
          <Card title={sectionLabel("Appearance")} style={{ marginBottom: 16 }}>
            {/* Change Color */}
            <Button
              type="default"
              block
              onClick={() => setIsColorOpen(true)}
              style={{
                height: 44,
                marginBottom: 10,
                background:
                  "linear-gradient(to right, rgba(126,34,206,0.25), rgba(29,78,216,0.2))",
                borderColor: "rgba(168,85,247,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>🎨 Change Colors</span>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Customize →
              </Text>
            </Button>

            {/* {isColorOpen && (
              <ChangeBgColor
                tempMainBackground={tempMainBackground}
                tempButtonBackground={tempButtonBackground}
                setTempMainBackground={setTempMainBackground}
                setTempButtonBackground={setTempButtonBackground}
                setIsColorOpen={setIsColorOpen}
                setFormData={setFormData}
                formData={formData}
                ui={response?.soldServices?.vCardUi}
              />
            )} */}

            {/* Change Theme */}
            <Button
              type="default"
              block
              onClick={() => setIsThemeOpen(true)}
              style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>✦ Change Theme</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {selectedTheme || response?.soldServices?.vCardUi}
                </Text>
                <FaCheck style={{ color: "#4ade80", fontSize: 12 }} />
              </span>
            </Button>
          </Card>

          {/* Color Preview */}

          {/* Submit */}
          <Form.Item>
            <Button
              htmlType="submit"
              block
              loading={isLoading}
              style={{
                height: 46,
                background: "linear-gradient(to right, #15803d, #059669)",
                borderColor: "transparent",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                borderRadius: 12,
              }}
            >
              {!isLoading && "Save Changes"}
            </Button>
          </Form.Item>
        </Form>
        {isColorOpen && (
          <ChangeBgColor
            tempMainBackground={tempMainBackground}
            tempButtonBackground={tempButtonBackground}
            setTempMainBackground={setTempMainBackground}
            setTempButtonBackground={setTempButtonBackground}
            setIsColorOpen={setIsColorOpen}
            setFormData={setFormData}
            formData={formData}
            ui={response?.soldServices?.vCardUi}
          />
        )}

        {isThemeOpen && (
          <ChangeTheme
            setIsThemeOpen={setIsThemeOpen}
            setTheme={setTheme}
            theme={selectedTheme}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

export default CustomizeTemplate;
