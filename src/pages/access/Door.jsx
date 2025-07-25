import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, message, Tooltip, Select, Input, Checkbox, Drawer, List, Badge } from 'antd';
import { PoweroffOutlined, ReloadOutlined, ExclamationCircleOutlined, InfoCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const mockDevices = [
  {
    key: '1',
    name: 'A1号门禁闸机',
    code: 'GATE-001',
    location: '1号楼北门',
    status: 'online',
    type: '闸机',
    lastOp: '2025-05-10 09:12',
    manager: '王建国',
    health: '正常',
    firmware: 'v2.1.3',
    nextMaintain: '2025-05-20',
    logs: [
      { time: '2025-05-10 09:12', action: '远程开门', user: '管理员' },
      { time: '2025-05-20 15:00', action: '固件升级', user: '技术员' },
    ],
  },
  {
    key: '2',
    name: 'B2号门禁',
    code: 'DOOR-002',
    location: '2号楼南门',
    status: 'offline',
    type: '门禁',
    lastOp: '2025-05-18 18:22',
    manager: '李明',
    health: '故障',
    firmware: 'v2.0.9',
    nextMaintain: '2025-05-15',
    logs: [
      { time: '2025-05-18 18:22', action: '设备离线', user: '系统' },
      { time: '2025-05-20 10:00', action: '维护保养', user: '李明' },
    ],
  },
  {
    key: '3',
    name: 'C3号闸机',
    code: 'GATE-003',
    location: '3号楼西门',
    status: 'online',
    type: '闸机',
    lastOp: '2025-05-12 08:45',
    manager: '赵云',
    health: '正常',
    firmware: 'v2.1.3',
    nextMaintain: '2025-05-25',
    logs: [
      { time: '2025-05-12 08:45', action: '远程关门', user: '管理员' },
      { time: '2025-05-15 09:00', action: '维护保养', user: '赵云' },
    ],
  },
  {
    key: '4',
    name: 'D4号门禁',
    code: 'DOOR-004',
    location: '4号楼东门',
    status: 'online',
    type: '门禁',
    lastOp: '2025-05-10 10:00',
    manager: '孙倩',
    health: '正常',
    firmware: 'v2.2.0',
    nextMaintain: '2025-05-28',
    logs: [
      { time: '2025-05-10 10:00', action: '远程开门', user: '管理员' },
      { time: '2025-05-10 14:00', action: '固件升级', user: '技术员' },
    ],
  },
  {
    key: '5',
    name: 'E5号门禁闸机',
    code: 'GATE-005',
    location: '5号楼南门',
    status: 'online',
    type: '闸机',
    lastOp: '2025-05-11 11:00',
    manager: '陈梓涵',
    health: '正常',
    firmware: 'v2.2.1',
    nextMaintain: '2025-05-28',
    logs: [
      { time: '2025-05-11 11:00', action: '远程开门', user: '管理员' },
      { time: '2025-05-10 10:00', action: '维护保养', user: '陈梓涵' },
    ],
  },
  {
    key: '6',
    name: 'F6号门禁',
    code: 'DOOR-006',
    location: '6号楼西门',
    status: 'offline',
    type: '门禁',
    lastOp: '2025-05-15 09:30',
    manager: '李思远',
    health: '故障',
    firmware: 'v2.0.8',
    nextMaintain: '2025-05-15',
    logs: [
      { time: '2025-05-15 09:30', action: '设备离线', user: '系统' },
      { time: '2025-05-10 09:00', action: '维护保养', user: '李思远' },
    ],
  },
  {
    key: '7',
    name: 'G7号闸机',
    code: 'GATE-007',
    location: '7号楼北门',
    status: 'online',
    type: '闸机',
    lastOp: '2025-05-12 08:20',
    manager: '孙嘉禾',
    health: '正常',
    firmware: 'v2.1.5',
    nextMaintain: '2025-05-28',
    logs: [
      { time: '2025-05-12 08:20', action: '远程开门', user: '管理员' },
      { time: '2025-05-10 10:00', action: '维护保养', user: '孙嘉禾' },
    ],
  },
  {
    key: '8',
    name: 'H8号门禁',
    code: 'DOOR-008',
    location: '8号楼东门',
    status: 'online',
    type: '门禁',
    lastOp: '2025-05-13 09:40',
    manager: '王子睿',
    health: '正常',
    firmware: 'v2.2.2',
    nextMaintain: '2025-05-28',
    logs: [
      { time: '2025-05-13 09:40', action: '远程开门', user: '管理员' },
      { time: '2025-08-01 10:00', action: '维护保养', user: '王子睿' },
    ],
  },
  {
    key: '9',
    name: 'I9号门禁闸机',
    code: 'GATE-009',
    location: '9号楼南门',
    status: 'offline',
    type: '闸机',
    lastOp: '2025-05-20 12:00',
    manager: '高子墨',
    health: '故障',
    firmware: 'v2.0.7',
    nextMaintain: '2025-05-28',
    logs: [
      { time: '2025-05-20 12:00', action: '设备离线', user: '系统' },
      { time: '2025-05-15 09:00', action: '维护保养', user: '高子墨' },
    ],
  },
  {
    key: '10',
    name: 'J10号门禁',
    code: 'DOOR-010',
    location: '10号楼西门',
    status: 'online',
    type: '门禁',
    lastOp: '2025-05-14 10:30',
    manager: '许思辰',
    health: '正常',
    firmware: 'v2.2.3',
    nextMaintain: '2025-05-28',
    logs: [
      { time: '2025-05-14 10:30', action: '远程开门', user: '管理员' },
      { time: '2025-05-10 10:00', action: '维护保养', user: '许思辰' },
    ],
  },
  {
    key: '11',
    name: 'K11号闸机',
    code: 'GATE-011',
    location: '11号楼北门',
    status: 'online',
    type: '闸机',
    lastOp: '2025-05-15 11:15',
    manager: '罗一帆',
    health: '正常',
    firmware: 'v2.1.6',
    nextMaintain: '2025-05-28',
    logs: [
      { time: '2025-05-15 11:15', action: '远程开门', user: '管理员' },
      { time: '2025-05-10 10:00', action: '维护保养', user: '罗一帆' },
    ],
  },
  {
    key: '12',
    name: 'L12号门禁',
    code: 'DOOR-012',
    location: '12号楼东门',
    status: 'offline',
    type: '门禁',
    lastOp: '2025-08-10 13:00',
    manager: '贾嘉懿',
    health: '故障',
    firmware: 'v2.0.6',
    nextMaintain: '2025-05-28',
    logs: [
      { time: '2025-08-10 13:00', action: '设备离线', user: '系统' },
      { time: '2025-05-10 09:00', action: '维护保养', user: '贾嘉懿' },
    ],
  },
];

const deviceTypes = ['闸机', '门禁'];
const managers = ['王建国', '李明', '赵云', '孙倩'];

export default function Door() {
  const [data, setData] = useState(mockDevices);
  const [selectedType, setSelectedType] = useState();
  const [selectedManager, setSelectedManager] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({ open: false, record: null });

  const handleRemote = (records, action) => {
    Modal.confirm({
      title: `确认${action === 'open' ? '远程开门' : '远程关门'}？`,
      icon: <ExclamationCircleOutlined />,
      content: Array.isArray(records)
        ? `批量操作设备数量：${records.length}`
        : `设备：${records.name}（${records.location}）`,
      onOk: () => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          message.success(Array.isArray(records)
            ? `已批量${action === 'open' ? '开门' : '关门'}`
            : `${records.name} ${action === 'open' ? '已远程开门' : '已远程关门'}`);
        }, 1000);
      },
    });
  };

  const handleFilter = () => {
    let filtered = mockDevices;
    if (selectedType) filtered = filtered.filter(d => d.type === selectedType);
    if (selectedManager) filtered = filtered.filter(d => d.manager === selectedManager);
    setData(filtered);
  };

  const columns = [
    { title: '设备名称', dataIndex: 'name', key: 'name', render: (text, record) => <Button type="link" icon={<InfoCircleOutlined />} onClick={() => setDetail({ open: true, record })}>{text}</Button> },
    { title: '编号', dataIndex: 'code', key: 'code' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s === 'online' ? <Tag color="green">在线</Tag> : <Tag color="red">离线</Tag> },
    { title: '健康', dataIndex: 'health', key: 'health', render: h => h === '正常' ? <Tag color="blue">正常</Tag> : <Tag color="red">故障</Tag> },
    { title: '固件', dataIndex: 'firmware', key: 'firmware' },
    { title: '负责人', dataIndex: 'manager', key: 'manager' },
    { title: '下次维护', dataIndex: 'nextMaintain', key: 'nextMaintain', render: t => <span style={{ color: new Date(t) < new Date() ? 'red' : undefined }}>{t}</span> },
    { title: '最近操作', dataIndex: 'lastOp', key: 'lastOp' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="远程开门"><Button icon={<PoweroffOutlined />} disabled={record.status !== 'online'} loading={loading} onClick={() => handleRemote(record, 'open')}>开门</Button></Tooltip>
          <Tooltip title="远程关门"><Button icon={<ReloadOutlined />} disabled={record.status !== 'online'} loading={loading} onClick={() => handleRemote(record, 'close')}>关门</Button></Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select allowClear placeholder="设备类型" style={{ width: 120 }} options={deviceTypes.map(t => ({ value: t, label: t }))} value={selectedType} onChange={setSelectedType} />
        <Select allowClear placeholder="负责人" style={{ width: 120 }} options={managers.map(m => ({ value: m, label: m }))} value={selectedManager} onChange={setSelectedManager} />
        <Button onClick={handleFilter}>筛选</Button>
        <Button icon={<PlusOutlined />}>添加设备</Button>
        <Button icon={<DeleteOutlined />} danger disabled={!selectedRowKeys.length}>删除设备</Button>
        <Button icon={<PoweroffOutlined />} disabled={!selectedRowKeys.length} onClick={() => handleRemote(data.filter(d => selectedRowKeys.includes(d.key)), 'open')}>批量开门</Button>
        <Button icon={<ReloadOutlined />} disabled={!selectedRowKeys.length} onClick={() => handleRemote(data.filter(d => selectedRowKeys.includes(d.key)), 'close')}>批量关门</Button>
      </Space>
      <Table columns={columns} dataSource={data} bordered rowKey="key" rowSelection={rowSelection} />
      <Drawer
        open={detail.open}
        title={detail.record?.name + ' 详情'}
        width={400}
        onClose={() => setDetail({ open: false, record: null })}
      >
        {detail.record && (
          <div>
            <p><b>编号：</b>{detail.record.code}</p>
            <p><b>位置：</b>{detail.record.location}</p>
            <p><b>类型：</b>{detail.record.type}</p>
            <p><b>状态：</b><Tag color={detail.record.status === 'online' ? 'green' : 'red'}>{detail.record.status === 'online' ? '在线' : '离线'}</Tag></p>
            <p><b>健康：</b><Tag color={detail.record.health === '正常' ? 'blue' : 'red'}>{detail.record.health}</Tag></p>
            <p><b>固件：</b>{detail.record.firmware}</p>
            <p><b>负责人：</b>{detail.record.manager}</p>
            <p><b>下次维护：</b><span style={{ color: new Date(detail.record.nextMaintain) < new Date() ? 'red' : undefined }}>{detail.record.nextMaintain}</span></p>
            <h4>操作日志</h4>
            <List
              size="small"
              bordered
              dataSource={detail.record.logs}
              renderItem={item => <List.Item><Badge status="processing" />{item.time} - {item.action}（{item.user}）</List.Item>}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
}
 