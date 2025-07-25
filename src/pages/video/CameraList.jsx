import React, { useState } from 'react';
import { Table, Tag, Button, Space, Select, Modal, Input, Drawer, List, Badge, message } from 'antd';
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';

const mockCameras = [
  { key: '1', name: '1号楼大门', code: 'CAM-001', location: '1号楼北门', group: '1号楼', status: '在线', type: '枪机', lastOnline: '2025-05-10 09:00', install: '2022-03-01', manager: '王建国', logs: [{ time: '2025-05-30', action: '固件升级', user: '管理员' }] },
  { key: '2', name: '2号楼大门', code: 'CAM-002', location: '2号楼南门', group: '2号楼', status: '离线', type: '球机', lastOnline: '2025-05-31 18:00', install: '2022-04-15', manager: '李明', logs: [{ time: '2025-05-20', action: '维护保养', user: '李明' }] },
  { key: '3', name: '3号楼大门', code: 'CAM-003', location: '3号楼西门', group: '3号楼', status: '在线', type: '枪机', lastOnline: '2025-05-10 08:50', install: '2022-05-10', manager: '赵云', logs: [{ time: '2025-05-10', action: '固件升级', user: '管理员' }] },
  { key: '4', name: '4号楼大门', code: 'CAM-004', location: '1号楼大厅', group: '1号楼', status: '在线', type: '球机', lastOnline: '2025-05-10 09:10', install: '2022-03-05', manager: '王建国', logs: [{ time: '2025-05-28', action: '维护保养', user: '王建国' }] },
  { key: '5', name: '2号楼停车场枪机', code: 'CAM-005', location: '2号楼停车场', group: '2号楼', status: '在线', type: '枪机', lastOnline: '2025-05-10 09:12', install: '2022-04-20', manager: '李明', logs: [{ time: '2025-05-25', action: '固件升级', user: '管理员' }] },
  { key: '6', name: '3号楼屋顶球机', code: 'CAM-006', location: '3号楼屋顶', group: '3号楼', status: '离线', type: '球机', lastOnline: '2025-05-30 17:00', install: '2022-05-20', manager: '赵云', logs: [{ time: '2025-05-18', action: '维护保养', user: '赵云' }] },
  { key: '7', name: '1号楼电梯间枪机', code: 'CAM-007', location: '1号楼电梯间', group: '1号楼', status: '在线', type: '枪机', lastOnline: '2025-05-10 09:15', install: '2022-03-10', manager: '王建国', logs: [{ time: '2025-05-28', action: '固件升级', user: '管理员' }] },
  { key: '8', name: '2号楼大堂球机', code: 'CAM-008', location: '2号楼大堂', group: '2号楼', status: '在线', type: '球机', lastOnline: '2025-05-10 09:18', install: '2022-04-25', manager: '李明', logs: [{ time: '2025-05-27', action: '维护保养', user: '李明' }] },
  { key: '9', name: '3号楼地下室枪机', code: 'CAM-009', location: '3号楼地下室', group: '3号楼', status: '在线', type: '枪机', lastOnline: '2025-05-10 09:20', install: '2022-05-25', manager: '赵云', logs: [{ time: '2025-05-22', action: '固件升级', user: '管理员' }] },
  { key: '10', name: '1号楼门厅球机', code: 'CAM-010', location: '1号楼门厅', group: '1号楼', status: '离线', type: '球机', lastOnline: '2025-05-28 16:00', install: '2022-03-15', manager: '王建国', logs: [{ time: '2025-05-15', action: '维护保养', user: '王建国' }] },
];

const groups = ['全部', '1号楼', '2号楼', '3号楼'];
const statusList = ['全部', '在线', '离线'];

export default function CameraList() {
  const [data, setData] = useState(mockCameras);
  const [group, setGroup] = useState('全部');
  const [status, setStatus] = useState('全部');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [detail, setDetail] = useState({ open: false, record: null });

  const handleFilter = () => {
    let filtered = mockCameras;
    if (group !== '全部') filtered = filtered.filter(c => c.group === group);
    if (status !== '全部') filtered = filtered.filter(c => c.status === status);
    setData(filtered);
  };

  const handleDelete = () => {
    setData(data.filter(c => !selectedRowKeys.includes(c.key)));
    setSelectedRowKeys([]);
    message.success('删除成功');
  };

  const columns = [
    { title: '摄像头名称', dataIndex: 'name', key: 'name', render: (text, record) => <Button type="link" icon={<InfoCircleOutlined />} onClick={() => setDetail({ open: true, record })}>{text}</Button> },
    { title: '编号', dataIndex: 'code', key: 'code' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '分组', dataIndex: 'group', key: 'group' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => s === '在线' ? <Tag color="green">在线</Tag> : <Tag color="red">离线</Tag> },
    { title: '负责人', dataIndex: 'manager', key: 'manager' },
    { title: '最近在线', dataIndex: 'lastOnline', key: 'lastOnline' },
    { title: '操作', key: 'action', render: () => <Space><Button type="link">预览</Button><Button type="link">回放</Button></Space> },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select value={group} style={{ width: 120 }} onChange={setGroup} options={groups.map(g => ({ value: g, label: g }))} />
        <Select value={status} style={{ width: 120 }} onChange={setStatus} options={statusList.map(s => ({ value: s, label: s }))} />
        <Button onClick={handleFilter}>筛选</Button>
        <Button icon={<PlusOutlined />}>添加摄像头</Button>
        <Button icon={<DeleteOutlined />} danger disabled={!selectedRowKeys.length} onClick={handleDelete}>删除</Button>
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
            <p><b>分组：</b>{detail.record.group}</p>
            <p><b>类型：</b>{detail.record.type}</p>
            <p><b>状态：</b><Tag color={detail.record.status === '在线' ? 'green' : 'red'}>{detail.record.status}</Tag></p>
            <p><b>负责人：</b>{detail.record.manager}</p>
            <p><b>最近在线：</b>{detail.record.lastOnline}</p>
            <p><b>安装时间：</b>{detail.record.install}</p>
            <h4>维护日志</h4>
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