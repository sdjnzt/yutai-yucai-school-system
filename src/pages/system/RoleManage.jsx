import React, { useState } from 'react';
import { Table, Button, Space, Modal, Input, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const mockRoles = [
  { key: '1', name: '管理员', desc: '系统最高权限', perms: ['用户管理', '角色管理', '系统设置'] },
  { key: '2', name: '普通用户', desc: '普通操作权限', perms: ['用户管理'] },
  { key: '3', name: '运维', desc: '设备维护权限', perms: ['用户管理', '系统设置'] },
];

export default function RoleManage() {
  const [data, setData] = useState(mockRoles);
  const [modal, setModal] = useState({ open: false, record: null });

  const columns = [
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'desc', key: 'desc' },
    { title: '权限', dataIndex: 'perms', key: 'perms', render: perms => perms.map(p => <Tag key={p}>{p}</Tag>) },
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
        <Button type="primary" icon={<PlusOutlined />}>添加角色</Button>
      </Space>
      <Table columns={columns} dataSource={data} bordered rowKey="key" />
      <Modal
        open={modal.open}
        title="编辑角色"
        onCancel={() => setModal({ open: false, record: null })}
        onOk={() => setModal({ open: false, record: null })}
      >
        {modal.record && (
          <div>
            <Input style={{ marginBottom: 8 }} value={modal.record.name} addonBefore="角色名称" />
            <Input style={{ marginBottom: 8 }} value={modal.record.desc} addonBefore="描述" />
            <Input style={{ marginBottom: 8 }} value={modal.record.perms.join(',')} addonBefore="权限" />
          </div>
        )}
      </Modal>
    </div>
  );
} 