
import { useState } from "react";
import {
  Layout,
  Typography,
  Card,
  Breadcrumb,
  Button,
  Form,
  Input,
  DatePicker,
  Space,
  App,
  Divider,
} from "antd";

import { ArrowLeftOutlined, SaveOutlined, PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCountries } from "../../hooks/useLocation";

import { createCustomer } from "../../services/customer.service";
import AddressForm from "../../components/customers/AddressForm";

const { Content, Header } = Layout;
const { Title } = Typography;



  const CreateCustomerPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { data: countries, isLoading: isCountriesLoading } = useCountries();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        mobileNumbers: values.mobileNumbers?.filter((n: string) => n && n.trim() !== "") || [],
        addresses: values.addresses.map((addr: any) => ({
          ...addr,
          cityId: addr.cityId,
          countryId: addr.countryId,
        })),
        familyMemberIds: values.familyMemberIds?.map((id: any) => parseInt(id, 10)) || [],
      };
      await createCustomer(payload);
      
      // Invalidate the cache to trigger a refresh on the dashboard
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      message.success("Customer created successfully!");
      navigate("/");

    } catch (error: any) {
      console.error("Creation Error:", error);
      const errorMsg = typeof error.response?.data === "string" 
        ? error.response.data 
        : error.response?.data?.message || "Failed to create customer. Check NIC uniqueness.";
      message.error(errorMsg);
    } finally {

      setLoading(false);
    }
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
            Add New Customer
          </Title>
        </Space>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Breadcrumb 
          style={{ marginBottom: "16px" }}
          items={[
            { title: "Home", onClick: () => navigate("/"), className: "cursor-pointer" },
            { title: "Customers", onClick: () => navigate("/"), className: "cursor-pointer" },
            { title: "Create" },
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
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ mobileNumbers: [""], addresses: [{ addressLine1: "" }] }}
          >
            <Title level={5}>Personal Information</Title>
            <Divider style={{ margin: "12px 0 24px" }} />
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter customer name" }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
              <Form.Item
                name="nicNumber"
                label="NIC Number"
                rules={[{ required: true, message: "Please enter NIC number" }]}
              >
                <Input placeholder="123456789V" />
              </Form.Item>
            </div>

            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[{ required: true, message: "Please select date of birth" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Title level={5} style={{ marginTop: "24px" }}>Contact Numbers</Title>
            <Divider style={{ margin: "12px 0 24px" }} />
            
            <Form.List name="mobileNumbers">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Form.Item
                      required={false}
                      key={`mobile-${key}`}
                      style={{ marginBottom: "8px" }}
                    >
                      <Space align="baseline">
                        <Form.Item
                          name={name}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please input mobile number or delete this field.",
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="0712345678" style={{ width: "300px" }} />
                        </Form.Item>
                        {fields.length > 1 && (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(name)}
                            style={{ color: "#ff4d4f" }}
                          />
                        )}
                      </Space>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      style={{ width: "300px" }}
                    >
                      Add Mobile Number
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Title level={5} style={{ marginTop: "24px" }}>Addresses</Title>
            <Divider style={{ margin: "12px 0 24px" }} />

            <Form.List name="addresses">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <div key={`address-${key}`} style={{ position: "relative" }}>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ position: "absolute", top: "16px", right: "16px", color: "#ff4d4f", fontSize: "16px", zIndex: 10 }}
                        />
                      )}
                      <AddressForm 
                        name={name} 
                        countries={countries || []} 
                        isCountriesLoading={isCountriesLoading} 
                      />

                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      block
                    >
                      Add Address
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Title level={5} style={{ marginTop: "24px" }}>Family Members</Title>
            <Divider style={{ margin: "12px 0 24px" }} />
            
            <Form.List name="familyMemberIds">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <Form.Item
                      required={false}
                      key={`family-${key}`}
                      style={{ marginBottom: "8px" }}
                    >
                      <Space align="baseline">
                        <Form.Item
                          name={name}
                          rules={[{ required: true, message: "Please enter customer ID" }]}
                          noStyle
                        >
                          <Input placeholder="1001" style={{ width: "200px" }} type="number" />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          style={{ color: "#ff4d4f" }}
                        />
                      </Space>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      style={{ width: "200px" }}
                    >
                      Add Family Member ID
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item style={{ marginTop: "32px" }}>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
                block
              >
                Create Customer
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default CreateCustomerPage;

