import React, { useState } from 'react';
import { Card, Table, Button, Input, Tag, Modal, Space, Tooltip } from 'antd';
import { SearchOutlined, ExportOutlined, EnvironmentOutlined, InfoCircleOutlined, AlertOutlined } from '@ant-design/icons';

const mockRooms = [
  { id: 1, name: 'A101', building: '1号楼', floor: 1, type: '大会议室', capacity: 20, status: '空闲', devices: ['投影', '白板'], manager: '王建国', maintain: false, lng: 117.120, lat: 36.650 },
  { id: 2, name: 'A102', building: '1号楼', floor: 1, type: '小会议室', capacity: 8, status: '占用', devices: ['白板'], manager: '李明', maintain: false, lng: 117.121, lat: 36.651 },
  { id: 3, name: 'B201', building: '2号楼', floor: 2, type: '多功能厅', capacity: 50, status: '维护', devices: ['投影', '音响', '视频终端'], manager: '赵云', maintain: true, lng: 117.123, lat: 36.649 },
  { id: 4, name: 'C301', building: '3号楼', floor: 3, type: '中会议室', capacity: 16, status: '空闲', devices: ['投影'], manager: '孙倩', maintain: false, lng: 117.127, lat: 36.652 },
  { id: 5, name: 'B202', building: '2号楼', floor: 2, type: '小会议室', capacity: 10, status: '占用', devices: ['白板'], manager: '陈梓涵', maintain: false, lng: 117.124, lat: 36.648 },
  { id: 6, name: 'A103', building: '1号楼', floor: 1, type: '中会议室', capacity: 14, status: '空闲', devices: ['投影', '白板'], manager: '李思远', maintain: false, lng: 117.122, lat: 36.650 },
  { id: 7, name: 'C302', building: '3号楼', floor: 3, type: '多功能厅', capacity: 40, status: '维护', devices: ['音响', '视频终端'], manager: '孙嘉禾', maintain: true, lng: 117.128, lat: 36.653 },
];

const statusColors = { '空闲': 'green', '占用': 'orange', '维护': 'red' };

export default function MeetingRoom() {
  const [search, setSearch] = useState('');
  const [data] = useState(mockRooms);
  const [modal, setModal] = useState({ open: false, record: null });

  const columns = [
    { title: '会议室', dataIndex: 'name', key: 'name' },
    { title: '楼栋', dataIndex: 'building', key: 'building' },
    { title: '楼层', dataIndex: 'floor', key: 'floor' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '容量', dataIndex: 'capacity', key: 'capacity' },
    { title: '设备', dataIndex: 'devices', key: 'devices', render: arr => arr.join('、') },
    { title: '负责人', dataIndex: 'manager', key: 'manager' },
    { title: '状态', dataIndex: 'status', key: 'status', render: s => <Tag color={statusColors[s]}>{s}</Tag> },
    { title: '维护提醒', dataIndex: 'maintain', key: 'maintain', render: m => m ? <Tag icon={<AlertOutlined />} color="red">维护中</Tag> : <Tag color="default">-</Tag> },
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

  function exportExcel() {
    // 简单导出示例
    const rows = data.map(r => ({ ...r, devices: r.devices.join('、') }));
    const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '会议室列表.csv';
    a.click();
  }

  return (
    <Card className="content-card">
      <div style={{marginBottom:16,display:'flex',gap:16}}>
        <Input.Search
          placeholder="搜索会议室/楼栋/负责人"
          allowClear
          enterButton={<SearchOutlined />}
          style={{width:300}}
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
        <Button icon={<ExportOutlined />} onClick={exportExcel}>导出</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data.filter(r => r.name.includes(search) || r.building.includes(search) || r.manager.includes(search))}
        rowKey="id"
        pagination={{pageSize:5}}
      />
      <Card title={<><EnvironmentOutlined /> 会议室分布图</>} variant="borderless" style={{marginTop:24}}>
        <div style={{height:220,position:'relative',background:'#f5f5f5',borderRadius:8,overflow:'hidden'}}>
          <svg width="100%" height="100%" viewBox="0 0 400 220">
            <rect x="40" y="30" width="320" height="160" rx="24" fill="#e6f7ff" stroke="#91d5ff" strokeWidth="3" />
            {data.map(room => {
              const x = 40 + ((room.lng-117.118)/0.012)*320;
              const y = 190 - ((room.lat-36.646)/0.007)*160;
              return (
                <g key={room.id} style={{cursor:'pointer'}} onClick={()=>setModal({ open: true, record: room })}>
                  <circle cx={x} cy={y} r="12" fill={statusColors[room.status]} stroke="#fff" strokeWidth="2" />
                  <text x={x+16} y={y+6} fontSize="14" fill="#333">{room.name}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card>
      <Modal
        open={modal.open}
        title="会议室详情"
        onCancel={()=>setModal({ open: false, record: null })}
        footer={null}
      >
        {modal.record && (
          <div>
            <p><b>会议室：</b>{modal.record.name}</p>
            <p><b>楼栋：</b>{modal.record.building}</p>
            <p><b>楼层：</b>{modal.record.floor}</p>
            <p><b>类型：</b>{modal.record.type}</p>
            <p><b>容量：</b>{modal.record.capacity}</p>
            <p><b>设备：</b>{modal.record.devices.join('、')}</p>
            <p><b>负责人：</b>{modal.record.manager}</p>
            <p><b>状态：</b><Tag color={statusColors[modal.record.status]}>{modal.record.status}</Tag></p>
            <p><b>维护提醒：</b>{modal.record.maintain ? <Tag icon={<AlertOutlined />} color="red">维护中</Tag> : '-'}</p>
            <p><b>经度：</b>{modal.record.lng}</p>
            <p><b>纬度：</b>{modal.record.lat}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
} 