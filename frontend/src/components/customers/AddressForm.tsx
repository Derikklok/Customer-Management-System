import React from "react";
import { Form, Input, Select } from "antd";
import { useCities } from "../../hooks/useLocation";
import type { Country } from "../../types/location.types";


const { Option } = Select;

interface AddressFormProps {
  name: number;
  countries?: Country[];
  isCountriesLoading: boolean;
}


const AddressForm: React.FC<AddressFormProps> = ({ name, countries, isCountriesLoading }) => {
  const form = Form.useFormInstance();
  const countryId = Form.useWatch(["addresses", name, "countryId"], form);
  const { data: cities, isLoading: isCitiesLoading } = useCities(countryId);

  return (
    <div style={{ marginBottom: "24px", padding: "16px", background: "#fafafa", borderRadius: "8px", position: "relative" }}>
      <Form.Item
        name={[name, "addressLine1"]}
        label="Address Line 1"
        rules={[{ required: true, message: "Required" }]}
      >
        <Input placeholder="123 Main St" />
      </Form.Item>
      <Form.Item
        name={[name, "addressLine2"]}
        label="Address Line 2 (Optional)"
      >
        <Input placeholder="Apt 4B" />
      </Form.Item>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Form.Item
          name={[name, "countryId"]}
          label="Country"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            placeholder="Select Country"
            onChange={() => {
              form.setFieldValue(["addresses", name, "cityId"], undefined);
            }}
            loading={isCountriesLoading}
          >
            {countries?.map((c: any) => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={[name, "cityId"]}
          label="City"
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            placeholder="Select City"
            loading={isCitiesLoading}
            disabled={!countryId}
          >
            {cities?.map((c: any) => (
              <Option key={c.id} value={c.id}>{c.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </div>
  );
};

export default AddressForm;
