import React, { useState } from 'react';
import { Table, Button, Tag, Tabs, Modal, message, Space, DatePicker, Select, Input, Upload } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const mockUsers = [
  { key: '1', name: '王建国', empId: 'E101', dept: '技术部', card: '100101', auth: '员工', valid: '2025-05-31', method: 'IC卡', status: '正常' },
  { key: '2', name: '李明', empId: 'E102', dept: '行政部', card: '100102', auth: '访客', valid: '2025-05-30', method: '人脸', status: '挂失' },
  { key: '3', name: '赵云', empId: 'E103', dept: '管理层', card: '100103', auth: 'VIP', valid: '2025-12-31', method: 'IC卡+人脸', status: '正常' },
  { key: '4', name: '孙倩', empId: 'E104', dept: '财务部', card: '100104', auth: '员工', valid: '2025-07-15', method: 'IC卡', status: '正常' },
];

const mockTemplates = [
  { key: 't1', name: '员工', doors: '全部办公区', valid: '长期', method: 'IC卡' },
  { key: 't2', name: '访客', doors: '指定区域', valid: '临时', method: 'IC卡/人脸' },
  { key: 't3', name: 'VIP', doors: '全部', valid: '长期', method: 'IC卡+人脸' },
];

const mockHistory = [
  { key: 'h1', name: '王建国', action: '分配权限', time: '2025-05-10 10:00', detail: '员工模板' },
  { key: 'h2', name: '李明', action: '挂失', time: '2025-05-11 11:20', detail: '卡号100102' },
  { key: 'h3', name: '赵云', action: '恢复', time: '2025-05-12 09:30', detail: '卡号100103' },
  { key: 'h4', name: '孙倩', action: '分配权限', time: '2025-05-13 14:00', detail: '员工模板' },
];

const templatesOptions = mockTemplates.map(t => ({ value: t.name, label: t.name }));

export default function Auth() {
  const [users, setUsers] = useState(mockUsers);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState();

  const handleLoss = (record, type) => {
    Modal.confirm({
      title: `确认${type === 'loss' ? '挂失' : '恢复'}该卡？`,
      icon: <ExclamationCircleOutlined />,
      content: `人员：${record.name}，卡号：${record.card}`,
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setUsers(users.map(u => u.key === record.key ? { ...u, status: type === 'loss' ? '挂失' : '正常' } : u));
          message.success(`${record.name} ${type === 'loss' ? '已挂失' : '已恢复'}`);
        }, 800);
      },
    });
  };

  const handleBatchAssign = () => {
    if (!selectedTemplate || !selectedRowKeys.length) return message.warning('请选择模板和人员');
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      message.success('批量分配权限申请已提交审批');
      setSelectedRowKeys([]);
      setSelectedTemplate(undefined);
    }, 1200);
  };

  const userColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '工号', dataIndex: 'empId', key: 'empId' },
    { title: '部门', dataIndex: 'dept', key: 'dept' },
    { title: '卡号', dataIndex: 'card', key: 'card' },
    { title: '权限', dataIndex: 'auth', key: 'auth' },
    { title: '有效期', dataIndex: 'valid', key: 'valid', render: v => <span style={{ color: new Date(v) < new Date() ? 'red' : undefined }}>{v}</span> },
    { title: '认证方式', dataIndex: 'method', key: 'method' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s === '正常' ? <Tag color="green">正常</Tag> : <Tag color="red">挂失</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button disabled={record.status === '挂失'} onClick={() => handleLoss(record, 'loss')}>挂失</Button>
          <Button disabled={record.status === '正常'} onClick={() => handleLoss(record, 'recover')}>恢复</Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const templateColumns = [
    { title: '模板名称', dataIndex: 'name', key: 'name' },
    { title: '门区范围', dataIndex: 'doors', key: 'doors' },
    { title: '有效期', dataIndex: 'valid', key: 'valid' },
    { title: '认证方式', dataIndex: 'method', key: 'method' },
  ];

  const historyColumns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '操作', dataIndex: 'action', key: 'action' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '详情', dataIndex: 'detail', key: 'detail' },
  ];

  return (
    <Tabs defaultActiveKey="1" type="card" items={[{
      key: '1',
      label: '人员权限分配',
      children: <>
        <Space style={{ marginBottom: 16 }}>
          <Select allowClear placeholder="选择权限模板" style={{ width: 140 }} options={templatesOptions} value={selectedTemplate} onChange={setSelectedTemplate} />
          <Button type="primary" loading={approving} disabled={!selectedRowKeys.length || !selectedTemplate} onClick={handleBatchAssign}>批量分配权限</Button>
          <Upload showUploadList={false}><Button icon={<UploadOutlined />}>导入</Button></Upload>
          <Button>导出</Button>
        </Space>
        <Table columns={userColumns} dataSource={users} bordered rowKey="key" loading={loading} rowSelection={rowSelection} />
      </>,
    }, {
      key: '2',
      label: '权限模板',
      children: <Table columns={templateColumns} dataSource={mockTemplates} bordered rowKey="key" />,
    }, {
      key: '3',
      label: '权限变更历史',
      children: <Table columns={historyColumns} dataSource={mockHistory} bordered rowKey="key" />,
    }]} />
  );
} 