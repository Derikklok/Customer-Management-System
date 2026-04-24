import { useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Breadcrumb,
  Button,
  Space,
  Upload,
  App,
  Divider,
  Alert,
} from "antd";
import { ArrowLeftOutlined, InboxOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { bulkCreateCustomers } from "../../services/customer.service";


const { Content, Header } = Layout;
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const BulkUpdatePage = () => {
  const { message, notification } = App.useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<any[]>([]);

  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Please select a file first!");
      return;
    }

    const file = fileList[0].originFileObj || fileList[0];
    setUploading(true);

    try {
      const response = await bulkCreateCustomers(file);
      notification.success({
        message: "Upload Successful",
        description: response.message,
        duration: 0,
      });
      setFileList([]);
      
      // Invalidate the cache to trigger a refresh on the dashboard
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      navigate("/");

    } catch (error: any) {
      console.error("Upload Error:", error);
      message.error(error.response?.data?.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const props = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      // Check file type
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isExcel) {
        message.error(`${file.name} is not an excel file`);
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; // Prevent automatic upload
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          zIndex: 1,
        }}
      >
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/")} type="text" />
          <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
            Bulk Create Customers
          </Title>
        </Space>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Breadcrumb 
          style={{ marginBottom: "16px" }}
          items={[
            { title: "Home", onClick: () => navigate("/"), className: "cursor-pointer" },
            { title: "Customers", onClick: () => navigate("/"), className: "cursor-pointer" },
            { title: "Bulk Create" },
          ]}
        />
        
        <Card
          variant="borderless"
          style={{
            borderRadius: "8px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <Space orientation="vertical" size="large" style={{ width: "100%" }}>

            <div>
              <Title level={5}>Excel File Upload</Title>
              <Paragraph type="secondary">
                Upload an Excel file (.xlsx) containing customer records. The system will process the records in the background.
              </Paragraph>
            </div>

            <Alert
              message="Important Instructions"
              description={
                <ul style={{ paddingLeft: "16px", margin: 0 }}>
                  <li>The Excel file should have exactly 1 header row (it will be skipped).</li>
                  <li>Column 1: Full Name</li>
                  <li>Column 2: Date of Birth (YYYY-MM-DD or Excel Date)</li>
                  <li>Column 3: NIC Number</li>
                  <li>Column 4: Mobile Numbers (comma separated)</li>
                </ul>
              }
              type="info"
              showIcon
            />

            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single .xlsx file. Optimized for up to 1,000,000 records.
              </p>
            </Dragger>

            <Divider />

            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleUpload}
              loading={uploading}
              disabled={fileList.length === 0}
              size="large"
              block
            >
              {uploading ? "Uploading & Processing..." : "Start Bulk Creation"}
            </Button>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default BulkUpdatePage;