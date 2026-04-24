import {
  Layout,
  Typography,
  Card,
  Breadcrumb,
  Button,
  Space,
  Descriptions,
  Tag,
  Divider,

  Skeleton,
  Result,
  Avatar,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined, EditOutlined, UserOutlined, PhoneOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomer } from "../../hooks/useCustomers";

const { Content, Header } = Layout;
const { Title, Text } = Typography;

const ViewCustomerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const customerId = id ? parseInt(id, 10) : undefined;
  const { data: customer, isLoading, error } = useCustomer(customerId);

  if (isLoading) {
    return (
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Content style={{ padding: "24px" }}>
          <Card><Skeleton active avatar paragraph={{ rows: 10 }} /></Card>
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
            Customer Details
          </Title>
        </Space>
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => navigate(`/edit-customer/${customer.id}`)}
        >
          Edit Customer
        </Button>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Breadcrumb 
          style={{ marginBottom: "16px" }}
          items={[
            { title: "Home", onClick: () => navigate("/"), className: "cursor-pointer" },
            { title: "Customers", onClick: () => navigate("/"), className: "cursor-pointer" },
            { title: "Details" },
          ]}
        />

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card
              variant="borderless"
              style={{
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
              }}
            >
              <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#e6f4ff', color: '#1677ff', marginBottom: '16px' }} />
              <Title level={3} style={{ marginBottom: 0 }}>{customer.name}</Title>
              <Text type="secondary">ID: {customer.id}</Text>
              <Divider />
              <Space orientation="vertical" style={{ width: '100%', textAlign: 'left' }}>

                <Text strong><PhoneOutlined /> Contact Numbers</Text>
                <div style={{ marginTop: '8px' }}>
                  {customer.mobileNumbers?.map((num, idx) => (
                    <Tag key={idx} color="blue" variant="filled" style={{ marginBottom: '4px' }}>{num}</Tag>

                  ))}
                  {(!customer.mobileNumbers || customer.mobileNumbers.length === 0) && <Text type="secondary">No contacts</Text>}
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>

              <Card
                title={<Space><UserOutlined />Personal Information</Space>}
                variant="borderless"
                style={{ borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}
              >
                <Descriptions column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="Full Name">{customer.name}</Descriptions.Item>
                  <Descriptions.Item label="NIC Number">{customer.nicNumber}</Descriptions.Item>
                  <Descriptions.Item label="Date of Birth">
                    {new Date(customer.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card
                title={<Space><HomeOutlined />Addresses</Space>}
                variant="borderless"
                style={{ borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {customer.addresses?.map((item: any, idx: number) => (
                    <div key={idx} style={{ padding: '8px 0', borderBottom: idx < customer.addresses.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ fontWeight: 500 }}>{item.addressLine1}{item.addressLine2 ? ', ' + item.addressLine2 : ''}</div>
                      <div style={{ color: '#8c8c8c', fontSize: '12px' }}>{item.cityName}, {item.countryName}</div>
                    </div>
                  ))}
                  {(!customer.addresses || customer.addresses.length === 0) && <Text type="secondary">No addresses recorded</Text>}
                </div>

              </Card>

              <Card
                title={<Space><TeamOutlined />Family Members</Space>}
                variant="borderless"
                style={{ borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {customer.familyMembers?.map((member: any, idx: number) => (
                    <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < customer.familyMembers.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                      <Space>
                        <Avatar icon={<UserOutlined />} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{member.name}</div>
                          <div style={{ color: '#8c8c8c', fontSize: '12px' }}>NIC: {member.nicNumber}</div>
                        </div>
                      </Space>
                      <Button type="link" onClick={() => navigate(`/view-customer/${member.id}`)}>View</Button>
                    </div>
                  ))}
                  {(!customer.familyMembers || customer.familyMembers.length === 0) && <Text type="secondary">No family members linked</Text>}
                </div>

              </Card>
            </Space>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ViewCustomerPage;
