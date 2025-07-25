import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, Input, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const mockUsers = [
  { key: '1', name: '王建国', username: 'wjg', role: '管理员', status: '启用', dept: '技术部', phone: '13800000001' },
  { key: '2', name: '李明', username: 'lm', role: '普通用户', status: '禁用', dept: '行政部', phone: '13800000002' },
  { key: '3', name: '赵云', username: 'zy', role: '运维', status: '启用', dept: '管理层', phone: '13800000003' },
];

export default function UserManage() {
  const [data, setData] = useState(mockUsers);
  const [modal, setModal] = useState({ open: false, record: null });

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '角色', dataIndex: 'role', key: 'role' },
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s === '启用' ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => setModal({ open: true, record })}>编辑</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => message.success('删除成功')}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />}>添加用户</Button>
      </Space>
      <Table columns={columns} dataSource={data} bordered rowKey="key" />
      <Modal
        open={modal.open}
        title="编辑用户"
        onCancel={() => setModal({ open: false, record: null })}
        onOk={() => setModal({ open: false, record: null })}
      >
        {modal.record && (
          <div>
            <Input style={{ marginBottom: 8 }} value={modal.record.name} addonBefore="姓名" />
            <Input style={{ marginBottom: 8 }} value={modal.record.username} addonBefore="用户名" />
            <Select style={{ width: '100%', marginBottom: 8 }} value={modal.record.role} options={[{ value: '管理员', label: '管理员' }, { value: '普通用户', label: '普通用户' }, { value: '运维', label: '运维' }]} />
            <Input style={{ marginBottom: 8 }} value={modal.record.dept} addonBefore="部门" />
            <Input style={{ marginBottom: 8 }} value={modal.record.phone} addonBefore="手机号" />
            <Select style={{ width: '100%' }} value={modal.record.status} options={[{ value: '启用', label: '启用' }, { value: '禁用', label: '禁用' }]} />
          </div>
        )}
      </Modal>
    </div>
  );
} 