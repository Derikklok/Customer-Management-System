import React from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Space,
  Divider,
  Typography,
} from "antd";
import { PlusOutlined, MinusCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { useCountries } from "../../hooks/useLocation";
import AddressForm from "./AddressForm";

const { Title } = Typography;

interface EditCustomerFormProps {
  initialValues: any;
  onFinish: (values: any) => void;
  loading: boolean;
}

const EditCustomerForm: React.FC<EditCustomerFormProps> = ({
  initialValues,
  onFinish,
  loading,
}) => {
  const [form] = Form.useForm();
  const { data: countries, isLoading: isCountriesLoading } = useCountries();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
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
          Update Customer
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCustomerForm;
