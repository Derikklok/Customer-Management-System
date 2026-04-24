import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Layout, Typography, Card, Breadcrumb, Button, Space } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import CustomerTable from "../../components/customers/CustomerTable";
import { useCustomers } from "../../hooks/useCustomers";
import type { TablePaginationConfig } from "antd";

const { Content, Header } = Layout;
const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState({

    page: 0,
    size: 10,
    sort: "name,asc",
  });

  const { data, isLoading, refetch } = useCustomers(params);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: any,
    sorter: any
  ) => {
    const newParams = {
      ...params,
      page: (pagination.current || 1) - 1,
      size: pagination.pageSize || 10,
    };

    if (sorter.field) {
      newParams.sort = `${sorter.field},${sorter.order === "descend" ? "desc" : "asc"}`;
    }

    setParams(newParams);
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
        <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
          CMS Portal
        </Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isLoading}>
            Refresh
          </Button>
          <Button icon={<PlusOutlined />} onClick={() => navigate("/bulk-create")}>
            Bulk Create
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/create-customer")}>
            Add Customer
          </Button>


        </Space>
      </Header>
      <Content style={{ padding: "24px" }}>
        <Breadcrumb 
          style={{ marginBottom: "16px" }}
          items={[
            { title: "Home" },
            { title: "Customers" },
          ]}
        />
        <Card
          variant="borderless"
          style={{
            borderRadius: "8px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
          }}
        >

          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={3} style={{ margin: 0 }}>Customers</Title>
          </div>
          <CustomerTable
            customers={data?.content || []}
            loading={isLoading}
            pagination={{
              current: params.page + 1,
              pageSize: params.size,
              total: data?.totalElements || 0,
            }}
            onChange={handleTableChange}
            onView={(customer) => navigate(`/view-customer/${customer.id}`)}
            onEdit={(customer) => navigate(`/edit-customer/${customer.id}`)}


          />
        </Card>
      </Content>
    </Layout>
  );
};

export default Dashboard;

