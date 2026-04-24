import React from "react";
import { Space, Table, Tag, Button, Tooltip, type TablePaginationConfig } from "antd";

import type { Customer } from "../../types/customer.types";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";

interface CustomerTableProps {
  customers: Customer[];
  loading: boolean;
  pagination: TablePaginationConfig;
  onChange: (pagination: TablePaginationConfig, filters: any, sorter: any) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  pagination,
  onChange,
  onView,
  onEdit,
}) => {
  const columns: ColumnsType<Customer> = [
    {
      title: 'Customer',
      key: 'customer',
      fixed: 'left',
      width: 200,
      render: (_, record) => (
        <Space>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: '50%', 
            background: '#e6f4ff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#1677ff'
          }}>
            <UserOutlined />
          </div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
        </Space>
      ),
      sorter: true,
      dataIndex: 'name',
    },
    {
      title: 'NIC Number',
      dataIndex: 'nicNumber',
      key: 'nicNumber',
      width: 150,
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: 150,
      render: (dob: string) => <span style={{ color: '#595959' }}>{new Date(dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>,
    },
    {
      title: 'Mobile Numbers',
      dataIndex: 'mobileNumbers',
      key: 'mobileNumbers',
      render: (numbers: string[]) => (
        <Space size={[0, 4]} wrap>
          {numbers?.length > 0 ? (
            numbers.map((num, idx) => (
              <Tag key={idx} color="blue" variant="filled" style={{ borderRadius: '4px' }}>{num}</Tag>

            ))
          ) : (
            <span style={{ color: '#bfbfbf' }}>-</span>
          )}
        </Space>
      ),
    },
    {
      title: 'Relations',
      key: 'relations',
      render: (_, record) => (
        <Space separator={<span style={{ color: '#d9d9d9' }}>|</span>}>
          <Tooltip title="Addresses">

            <span style={{ color: '#595959' }}>🏠 {record.addresses?.length || 0}</span>
          </Tooltip>
          <Tooltip title="Family Members">
            <span style={{ color: '#595959' }}>👥 {record.familyMembers?.length || 0}</span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text" 
              style={{ color: '#1677ff' }}
              icon={<EyeOutlined />} 
              onClick={() => onView(record)} 
            />

          </Tooltip>
          <Tooltip title="Edit Customer">
            <Button 
              type="text" 
              style={{ color: '#52c41a' }}
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
            />

          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={customers}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      onChange={onChange}
      scroll={{ x: 1000 }}
      size="middle"
      style={{
        borderRadius: '8px',
      }}
    />
  );
};

export default CustomerTable;