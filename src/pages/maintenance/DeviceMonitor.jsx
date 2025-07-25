import React, { useState } from 'react';
import { Card, Row, Col, Tag, Table, Button, Input, Modal, Space, Tooltip, Alert } from 'antd';
import { EnvironmentOutlined, ExclamationCircleOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';

// mock设备数据
const mockDevices = [
  { id: 1, name: '1号楼电梯', type: '电梯', status: '在线', location: '1号楼A区', manager: '王建国', lastCheck: '2025-05-10', alarm: false, lng: 117.120, lat: 36.650 },
  { id: 2, name: '2号楼空调', type: '空调', status: '异常', location: '2号楼B区', manager: '李明', lastCheck: '2025-05-10', alarm: true, lng: 117.121, lat: 36.651 },
  { id: 3, name: '3号楼消防', type: '消防', status: '离线', location: '3号楼C区', manager: '赵云', lastCheck: '2025-05-30', alarm: false, lng: 117.123, lat: 36.649 },
  { id: 4, name: '1号楼照明', type: '照明', status: '在线', location: '1号楼A区', manager: '孙倩', lastCheck: '2025-05-10', alarm: false, lng: 117.127, lat: 36.652 },
  { id: 5, name: '2号楼门禁', type: '门禁', status: '待巡检', location: '2号楼B区', manager: '陈梓涵', lastCheck: '2025-05-28', alarm: false, lng: 117.124, lat: 36.648 },
  { id: 6, name: '3号楼空调', type: '空调', status: '异常', location: '3号楼C区', manager: '李思远', lastCheck: '2025-05-10', alarm: true, lng: 117.122, lat: 36.650 },
  { id: 7, name: '1号楼消防', type: '消防', status: '在线', location: '1号楼A区', manager: '孙嘉禾', lastCheck: '2025-05-10', alarm: false, lng: 117.128, lat: 36.653 },
];

const statusColors = { '在线': 'green', '离线': 'default', '异常': 'red', '待巡检': 'orange' };

export default function DeviceMonitor() {
  const [search, setSearch] = useState('');
  const [data] = useState(mockDevices);
  const [modal, setModal] = useState({ open: false, record: null });

  // 统计
  const total = data.length;
  const online = data.filter(d=>d.status==='在线').length;
  const offline = data.filter(d=>d.status==='离线').length;
  const abnormal = data.filter(d=>d.status==='异常').length;
  const toCheck = data.filter(d=>d.status==='待巡检').length;
  const alarms = data.filter(d=>d.alarm);

  const columns = [
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '负责人', dataIndex: 'manager', key: 'manager' },
    { title: '上次巡检', dataIndex: 'lastCheck', key: 'lastCheck' },
    { title: '告警', dataIndex: 'alarm', key: 'alarm', render: a => a ? <Tag color="red"><ExclamationCircleOutlined /> 故障</Tag> : '-' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="详情"><Button icon={<InfoCircleOutlined />} onClick={()=>setModal({ open: true, record })} /></Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card className="content-card">
      <Row gutter={[32, 24]} style={{marginBottom:24}}>
        <Col>
          <Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #e6f7ff',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f8fafc'}}>
            <div style={{ color: '#1890ff', fontSize: 14, marginBottom: 4 }}>设备总数</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#1890ff' }}>{total}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #f6ffed',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f6fffb'}}>
            <div style={{ color: '#52c41a', fontSize: 14, marginBottom: 4 }}>在线</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#52c41a' }}>{online}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #fffbe6',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fffbe6'}}>
            <div style={{ color: '#faad14', fontSize: 14, marginBottom: 4 }}>待巡检</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#faad14' }}>{toCheck}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #fff1f0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fff1f0'}}>
            <div style={{ color: '#ff4d4f', fontSize: 14, marginBottom: 4 }}>异常/故障</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#ff4d4f' }}>{abnormal}</div>
          </Card>
        </Col>
        <Col>
          <Card variant="outlined" style={{minWidth:130,height:90,borderRadius:16,boxShadow:'0 4px 16px #f0f1f2',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#f0f1f2'}}>
            <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>离线</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#888' }}>{offline}</div>
          </Card>
        </Col>
      </Row>
      {alarms.length > 0 && (
        <Alert
          type="error"
          showIcon
          style={{marginBottom:24}}
          message={<span>当前有 <b style={{color:'#ff4d4f'}}>{alarms.length}</b> 台设备发生故障，请及时处理！</span>}
        />
      )}
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索设备名称/类型/位置/负责人"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:320}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data.filter(d => d.name.includes(search) || d.type.includes(search) || d.location.includes(search) || d.manager.includes(search))}
        rowKey="id"
        pagination={{pageSize:6}}
      />
      <Modal
        open={modal.open}
        title="设备详情"
        onCancel={()=>setModal({ open: false, record: null })}
        footer={null}
      >
        {modal.record && (
          <div>
            <p><b>设备名称：</b>{modal.record.name}</p>
            <p><b>类型：</b>{modal.record.type}</p>
            <p><b>状态：</b><Tag color={statusColors[modal.record.status]}>{modal.record.status}</Tag></p>
            <p><b>位置：</b>{modal.record.location}</p>
            <p><b>负责人：</b>{modal.record.manager}</p>
            <p><b>上次巡检：</b>{modal.record.lastCheck}</p>
            <p><b>告警：</b>{modal.record.alarm ? <Tag color="red">故障</Tag> : '-'}</p>
            <p><b>经度：</b>{modal.record.lng}</p>
            <p><b>纬度：</b>{modal.record.lat}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
} 