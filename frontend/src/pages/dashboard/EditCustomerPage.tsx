import { useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Breadcrumb,
  Button,
  Space,
  App,
  Skeleton,
  Result,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomer } from "../../hooks/useCustomers";
import { updateCustomer } from "../../services/customer.service";
import EditCustomerForm from "../../components/customers/EditCustomerForm";


const { Content, Header } = Layout;
const { Title } = Typography;

const EditCustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);


  const customerId = id ? parseInt(id, 10) : undefined;
  const { data: customer, isLoading, error } = useCustomer(customerId);

  const onFinish = async (values: any) => {
    if (!customerId) return;
    setUpdating(true);
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        mobileNumbers: values.mobileNumbers?.filter((n: string) => n && n.trim() !== "") || [],
        addresses: values.addresses.map((addr: any) => ({
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2,
          cityId: addr.cityId,
          countryId: addr.countryId,
        })),
        familyMemberIds: values.familyMemberIds?.map((id: any) => parseInt(id, 10)) || [],
      };
      await updateCustomer(customerId, payload);

      // Invalidate the cache to trigger a refresh on the dashboard
      await queryClient.invalidateQueries({ queryKey: ['customers'] });

      message.success("Customer updated successfully!");
      navigate("/");

    } catch (err: any) {
      console.error("Update Error:", err);
      const errorMsg = typeof err.response?.data === "string" 
        ? err.response.data 
        : err.response?.data?.message || "Failed to update customer.";
      message.error(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Content style={{ padding: "24px" }}>
          <Card><Skeleton active /></Card>
        </Content>
      </Layout>
    );
  }

  if (error || !customer) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Content style={{ padding: "24px" }}>
          <Result
            status="error"
            title="Failed to load customer"
            subTitle="The customer you are looking for does not exist or an error occurred."
            extra={<Button type="primary" onClick={() => navigate("/")}>Back to Dashboard</Button>}
          />
        </Content>
      </Layout>
    );
  }

  // Map backend response to form initial values
  const initialValues = {
    ...customer,
    dateOfBirth: dayjs(customer.dateOfBirth),
    addresses: customer.addresses.map((addr: any) => ({
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2,
      // We need IDs for the select components
      // Note: The backend response should ideally include cityId and countryId
      // But based on API.md, it might return cityName/countryName.
      // If the backend DTO mapping is consistent, we might need to adjust this.
      // Assuming for now the Address entity/DTO has cityId/countryId or we map them.
      cityId: addr.cityId, 
      countryId: addr.countryId,
    })),
    familyMemberIds: customer.familyMembers?.map((fm: any) => fm.id) || [],
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
            Edit Customer: {customer.name}
          </Title>
        </Space>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Breadcrumb 
          style={{ marginBottom: "16px" }}
          items={[
            { title: "Home", onClick: () => navigate("/"), className: "cursor-pointer" },
            { title: "Customers", onClick: () => navigate("/"), className: "cursor-pointer" },
            { title: "Edit" },
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
          <EditCustomerForm
            initialValues={initialValues}
            onFinish={onFinish}
            loading={updating}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default EditCustomerPage;