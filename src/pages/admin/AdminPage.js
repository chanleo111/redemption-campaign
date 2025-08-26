import React from 'react';
import { Card, Table, Tag } from 'antd';
import { useAuth } from '../../components/AuthContext';

const AdminPage = () => {
  const { users } = useAuth();

  const columns = [
    { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
    { title: 'Phone', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: (r) => <Tag color={r === 'admin' ? 'red' : 'blue'}>{r || 'user'}</Tag> },
    { title: 'Points', dataIndex: 'points_balance', key: 'points_balance' },
  ];

  return (
    <Card title="Admin">
      <p>Only admins can access this page.</p>
      <Table rowKey="user_id" columns={columns} dataSource={users} pagination={{ pageSize: 5 }} />
    </Card>
  );
};

export default AdminPage;
